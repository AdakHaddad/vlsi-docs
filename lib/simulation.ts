// ─── Simple Logic Simulator ───────────────────────────────────────────────────
// Pure TypeScript — no external dependencies
// Evaluates combinational gate networks and steps sequential circuits

import type { CircuitDef, GateType } from './types'

// ─────────────────────────────────────────────────────────────────────────────
//  Gate Evaluation
// ─────────────────────────────────────────────────────────────────────────────

function evalGate(type: GateType, inputs: number[]): number {
  const [a = 0, b = 0, c = 0] = inputs
  switch (type) {
    case 'AND':   return inputs.every(i => i === 1) ? 1 : 0
    case 'OR':    return inputs.some(i => i === 1) ? 1 : 0
    case 'NOT':   return a === 0 ? 1 : 0
    case 'BUF':   return a
    case 'NAND':  return inputs.every(i => i === 1) ? 0 : 1
    case 'NOR':   return inputs.some(i => i === 1) ? 0 : 1
    case 'XOR':   return inputs.reduce((acc, i) => acc ^ i, 0) & 1
    case 'XNOR':  return (inputs.reduce((acc, i) => acc ^ i, 0) & 1) === 0 ? 1 : 0
    case 'MUX2':  return c ? b : a   // a=D0, b=D1, c=SEL
    case 'MUX4': {
      const [d0, d1, d2, d3, s0, s1] = inputs
      const sel = (s1 << 1) | s0
      return [d0, d1, d2, d3][sel] ?? 0
    }
    case 'DFF':   return 0 // handled separately via state
    case 'LATCH': return c ? a : b   // a=D, b=Q_prev, c=EN
    case 'HALFADDER': return a ^ b   // returns sum; carry computed separately
    case 'FULLADDER': {
      const sum = a ^ b ^ c
      return sum
    }
    default: return 0
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Circuit Simulator
// ─────────────────────────────────────────────────────────────────────────────

export interface SimulatorState {
  inputValues: Record<string, number>
  gateOutputs: Record<string, number>
  outputValues: Record<string, number>
  dffState: Record<string, number>   // sequential state
  clockCycle: number
}

export function createSimulator(circuit: CircuitDef): SimulatorState {
  const inputValues: Record<string, number> = {}
  const dffState: Record<string, number> = {}

  for (const inp of circuit.inputs) {
    inputValues[inp.id] = inp.defaultValue
  }
  for (const gate of circuit.gates) {
    if (gate.type === 'DFF' || gate.type === 'LATCH') {
      dffState[gate.id] = 0
    }
  }

  return evaluateCombinational({
    inputValues,
    gateOutputs: {},
    outputValues: {},
    dffState,
    clockCycle: 0,
  }, circuit)
}

function resolveSignal(
  id: string,
  inputs: Record<string, number>,
  gateOutputs: Record<string, number>,
  dffState: Record<string, number>,
): number {
  if (id in inputs) return inputs[id]
  if (`${id}_q` in dffState) return dffState[`${id}_q`] ?? dffState[id] ?? 0
  if (id in dffState) return dffState[id]
  if (id in gateOutputs) return gateOutputs[id]
  // Try numeric literal
  if (/^\d+$/.test(id)) return parseInt(id)
  return 0
}

export function evaluateCombinational(
  state: SimulatorState,
  circuit: CircuitDef,
): SimulatorState {
  const gateOutputs = { ...state.gateOutputs }
  const { inputValues, dffState } = state

  // Evaluate gates in order (assumes topological sort is implicit in definition order)
  // For cycles, iterate to convergence (max 10 passes)
  for (let pass = 0; pass < 10; pass++) {
    let changed = false
    for (const gate of circuit.gates) {
      if (gate.type === 'DFF') {
        // DFF output is from stored state
        const prev = gateOutputs[gate.id]
        gateOutputs[gate.id] = dffState[gate.id] ?? 0
        if (gateOutputs[gate.id] !== prev) changed = true
        continue
      }

      const gateInputValues = gate.inputs.map(inp =>
        resolveSignal(inp, inputValues, gateOutputs, dffState),
      )
      const prev = gateOutputs[gate.id]
      gateOutputs[gate.id] = evalGate(gate.type, gateInputValues)
      if (gateOutputs[gate.id] !== prev) changed = true
    }
    if (!changed) break
  }

  // Evaluate outputs via their expressions
  const outputValues: Record<string, number> = {}
  for (const out of circuit.outputs) {
    try {
      const allVals = { ...inputValues, ...gateOutputs, ...dffState }
      // Build safe eval context
      const keys = Object.keys(allVals)
      const vals = Object.values(allVals)
      // Replace common SV-isms
      const expr = out.expression
        .replace(/~\s*/g, '~')
        .replace(/dff_q/g, String(state.dffState[circuit.gates.find(g => g.type === 'DFF')?.id ?? ''] ?? 0))
      // eslint-disable-next-line no-new-func
      outputValues[out.id] = (new Function(...keys, `return (${expr}) & 1`)(...vals) as number)
    } catch {
      outputValues[out.id] = 0
    }
  }

  return { ...state, gateOutputs, outputValues }
}

/**
 * Step the clock — capture DFF inputs into DFF state (rising edge)
 */
export function stepClock(state: SimulatorState, circuit: CircuitDef): SimulatorState {
  const newDffState = { ...state.dffState }

  for (const gate of circuit.gates) {
    if (gate.type === 'DFF') {
      const [dIn, rstIn, enIn] = gate.inputs.map(inp =>
        resolveSignal(inp, state.inputValues, state.gateOutputs, state.dffState),
      )

      if (rstIn) {
        newDffState[gate.id] = 0
      } else if (enIn === undefined || enIn === 1) {
        newDffState[gate.id] = dIn
      }
      // else: hold current state
    }
  }

  const newState: SimulatorState = {
    ...state,
    dffState: newDffState,
    clockCycle: state.clockCycle + 1,
  }
  return evaluateCombinational(newState, circuit)
}

/**
 * Update an input value and re-evaluate
 */
export function setInput(
  state: SimulatorState,
  inputId: string,
  value: number,
  circuit: CircuitDef,
): SimulatorState {
  const newState: SimulatorState = {
    ...state,
    inputValues: { ...state.inputValues, [inputId]: value },
  }
  return evaluateCombinational(newState, circuit)
}
