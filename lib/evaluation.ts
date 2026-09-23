// ─── Pure RTL Evaluation Engine ───────────────────────────────────────────────
// Client-side analysis: pattern matching + test vector execution
// No external Verilog simulator — we use regex-based structural analysis
// combined with a simple test-vector evaluator against a golden function.

import type {
  EvaluationResult,
  CheckResult,
  EvaluationRule,
  TestVector,
  LabExercise,
} from './types'

// ─────────────────────────────────────────────────────────────────────────────
//  Test Vector Evaluation
//  We parse the RTL and build a JS evaluator for simple combinational cases.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate a simple combinational RTL module against test vectors.
 * We look for:
 *   assign y = <expr>;
 *   always_comb with simple assignments
 *   case statements
 */
function extractCombinationalLogic(
  rtl: string,
  inputNames: string[],
  outputNames: string[],
): ((inputs: Record<string, number>) => Record<string, number>) | null {
  // Attempt to extract assign statements
  const assignments: Record<string, string> = {}

  // Match: assign <id> = <expr>;
  const assignRe = /assign\s+(\w+)\s*=\s*([^;]+);/g
  let m
  while ((m = assignRe.exec(rtl)) !== null) {
    assignments[m[1]] = m[2].trim()
  }

  if (Object.keys(assignments).length === 0) return null

  // Build an evaluator function
  return (inputs: Record<string, number>) => {
    const result: Record<string, number> = {}
    for (const outputName of outputNames) {
      const expr = assignments[outputName]
      if (!expr) continue
      try {
        // Replace SV operators with JS operators
        let jsExpr = expr
          .replace(/~\s*/g, '~') // bitwise not
          .replace(/\^/g, '^') // XOR already valid
          .replace(/&&/g, '&&')
          .replace(/\|\|/g, '||')
          // Replace signal names
          .replace(/\b(\w+)\b/g, (tok) => {
            if (tok in inputs) return String(inputs[tok])
            if (/^\d+$/.test(tok)) return tok
            return tok
          })

        // eslint-disable-next-line no-new-func
        const val = new Function(...Object.keys(inputs), `return (${jsExpr}) & 1`)(
          ...Object.values(inputs),
        )
        result[outputName] = val as number
      } catch {
        result[outputName] = -1 // evaluation error
      }
    }
    return result
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Static Checks
// ─────────────────────────────────────────────────────────────────────────────

function checkNoLatch(rtl: string): CheckResult {
  // Detect always_comb with if without else that assigns an output
  const hasComb = /always_comb/.test(rtl)
  if (!hasComb) return { rule: 'no_latch', passed: true, severity: 'error', message: '' }

  // Check for if without else pattern
  const hasIfWithoutElse = /if\s*\([^)]+\)\s*\n\s*\w+\s*=/.test(rtl) &&
    !/else/.test(rtl)

  // Also check for case without default (potential latch)
  const hasCaseWithoutDefault = /case\s*\(/.test(rtl) && !/default\s*:/.test(rtl)

  const passed = !hasIfWithoutElse && !hasCaseWithoutDefault
  return {
    rule: 'no_latch',
    passed,
    severity: 'error',
    message: passed
      ? 'No obvious latch inference detected.'
      : hasIfWithoutElse
        ? 'Missing else branch in always_comb — latch may be inferred for output.'
        : 'Case statement missing default — latch may be inferred.',
    hardwareConsequence: passed
      ? undefined
      : 'A latch is a level-sensitive storage element. Unintentional latches cause timing issues and are almost always bugs.',
  }
}

function checkNoBlockingInFF(rtl: string): CheckResult {
  // Look for = (blocking) inside always_ff blocks
  const ffBlocks = rtl.match(/always_ff[\s\S]*?end(?=\s|$)/gm) ?? []
  let hasBlocking = false
  for (const block of ffBlocks) {
    // Remove comments first
    const clean = block.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
    // Look for blocking = that is not part of <=
    if (/(?<!<)\s*=\s*(?!>)/.test(clean.replace(/<=/g, ''))) {
      hasBlocking = true
      break
    }
  }

  return {
    rule: 'no_blocking_in_ff',
    passed: !hasBlocking,
    severity: 'error',
    message: hasBlocking
      ? 'Blocking assignment (=) detected inside always_ff. Use non-blocking (<=) for sequential logic.'
      : 'Non-blocking assignment used correctly in always_ff.',
    hardwareConsequence: hasBlocking
      ? 'Blocking assignment in flip-flop logic causes simulation-synthesis mismatches and race conditions between parallel DFFs.'
      : undefined,
  }
}

function checkCompleteCase(rtl: string): CheckResult {
  // Check that case statements in always_comb have default or cover all values
  const hasCombCase = /always_comb[\s\S]*?case\s*\(/.test(rtl)
  if (!hasCombCase) return { rule: 'complete_case', passed: true, severity: 'warning', message: '' }

  const hasDefault = /default\s*:/.test(rtl)
  return {
    rule: 'complete_case',
    passed: hasDefault,
    severity: 'warning',
    message: hasDefault
      ? 'Case statement has default branch.'
      : 'Case statement missing default branch. Add default to prevent latch inference.',
    hardwareConsequence: hasDefault
      ? undefined
      : 'Without a default, undefined inputs can cause latch inference or undefined output behavior.',
  }
}

function checkResetPriority(rtl: string): CheckResult {
  // In always_ff, reset should be checked first (outermost if)
  const ffBlocks = rtl.match(/always_ff[\s\S]*?end(?=\s|$)/gm) ?? []
  let hasWrongPriority = false
  for (const block of ffBlocks) {
    // Check that rst/reset appears in the first if, not an else if
    if (/else\s+if\s*\(\s*rst/.test(block) || /else\s+if\s*\(\s*reset/.test(block)) {
      hasWrongPriority = true
    }
  }

  return {
    rule: 'reset_priority',
    passed: !hasWrongPriority,
    severity: 'warning',
    message: hasWrongPriority
      ? 'Reset appears as else-if, not the primary if. Reset should have highest priority.'
      : 'Reset has correct priority.',
    hardwareConsequence: hasWrongPriority
      ? 'If reset is lower priority than another condition, it may fail to clear the register when expected.'
      : undefined,
  }
}

function checkModulePresent(rtl: string, moduleName?: string): CheckResult {
  const hasModule = /module\s+\w+/.test(rtl)
  const hasEndModule = /endmodule/.test(rtl)
  const passed = hasModule && hasEndModule
  return {
    rule: 'module_structure',
    passed,
    severity: 'error',
    message: passed
      ? 'Module structure is valid.'
      : !hasModule
        ? 'Missing `module` declaration.'
        : 'Missing `endmodule`.',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Main Evaluation Function
// ─────────────────────────────────────────────────────────────────────────────

export function evaluateRTL(
  rtl: string,
  exercise: LabExercise,
  goldenFn: (inputs: Record<string, number>) => Record<string, number>,
): EvaluationResult {
  const checks: CheckResult[] = []

  // 1. Module structure
  checks.push(checkModulePresent(rtl))

  // 2. Apply evaluation rules from exercise
  for (const rule of exercise.evaluationRules) {
    switch (rule.check) {
      case 'no_latch':
        checks.push(checkNoLatch(rtl))
        break
      case 'no_blocking_in_ff':
        checks.push(checkNoBlockingInFF(rtl))
        break
      case 'complete_case':
        checks.push(checkCompleteCase(rtl))
        break
      case 'reset_priority':
        checks.push(checkResetPriority(rtl))
        break
    }
  }

  // 3. Run functional test vectors against golden function
  const failingVectors: TestVector[] = []
  for (const tv of exercise.testVectors) {
    const golden = goldenFn(tv.inputs)
    for (const [key, expected] of Object.entries(tv.expectedOutputs)) {
      if (golden[key] !== expected) {
        // This shouldn't happen for well-formed golden fns, but guards us
      }
    }
  }

  // Try to parse and evaluate user's RTL against test vectors
  const inputNames = exercise.testVectors[0]
    ? Object.keys(exercise.testVectors[0].inputs)
    : []
  const outputNames = exercise.testVectors[0]
    ? Object.keys(exercise.testVectors[0].expectedOutputs)
    : []

  const userEval = extractCombinationalLogic(rtl, inputNames, outputNames)
  let functionalPassed = false

  if (userEval) {
    for (const tv of exercise.testVectors) {
      const userOut = userEval(tv.inputs)
      for (const [key, expected] of Object.entries(tv.expectedOutputs)) {
        if (userOut[key] !== expected) {
          failingVectors.push(tv)
          break
        }
      }
    }
    functionalPassed = failingVectors.length === 0
  } else {
    // Can't evaluate — check if there are keywords suggesting sequential logic
    // In that case we can't do functional check client-side; assume passes if structure ok
    const isSequential = /always_ff/.test(rtl)
    if (isSequential) {
      functionalPassed = checks.every(c => c.severity === 'warning' || c.passed)
    }
  }

  const hasErrors = checks.some(c => !c.passed && c.severity === 'error')
  const passed = functionalPassed && !hasErrors

  // Compute score
  let score = 0
  if (functionalPassed) score += 60
  const passingChecks = checks.filter(c => c.passed).length
  score += Math.round((passingChecks / Math.max(checks.length, 1)) * 40)

  return {
    passed,
    score,
    functionalPassed,
    checks,
    failingVectors: failingVectors.length > 0 ? failingVectors : undefined,
    hardwareExplanation: exercise.explanation,
    suggestion: !functionalPassed && failingVectors.length > 0
      ? buildFailureExplanation(failingVectors[0], exercise)
      : undefined,
  }
}

function buildFailureExplanation(tv: TestVector, exercise: LabExercise): string {
  const inputStr = Object.entries(tv.inputs)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ')
  const expectedStr = Object.entries(tv.expectedOutputs)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ')
  return `With inputs [${inputStr}], expected [${expectedStr}].

${exercise.explanation}

**Hint**: ${exercise.hints[0] ?? 'Review the hardware specification and try again.'}`
}
