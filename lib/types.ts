// ─── Curriculum Types ────────────────────────────────────────────────────────

export type LessonType =
  | 'read'
  | 'explore'
  | 'predict'
  | 'quiz'
  | 'implement'
  | 'repair'
  | 'verify'
  | 'debug'
  | 'optimize'
  | 'design'

export interface Chapter {
  id: string
  title: string
  subtitle: string
  lessons: Lesson[]
  color: string // accent color for chapter
}

export interface Lesson {
  id: string
  title: string
  type: LessonType
  duration: number // minutes
  content: LessonContent
}

export interface LessonContent {
  sections: ContentSection[]
  quiz?: QuizQuestion[]
  lab?: LabExercise
  debugChallenge?: DebugChallenge
}

export type ContentSection =
  | { kind: 'concept'; text: string; title?: string }
  | { kind: 'rtlSnippet'; code: string; language: 'verilog' | 'systemverilog'; caption?: string }
  | { kind: 'circuit'; def: CircuitDef; caption?: string }
  | { kind: 'truthTable'; inputs: string[]; outputs: string[]; rows: (0 | 1)[][] }
  | { kind: 'waveform'; def: WaveformDef; caption?: string; question?: string }
  | { kind: 'callout'; variant: 'info' | 'warning' | 'tip' | 'hardware'; text: string }
  | { kind: 'ppaCompare'; implementations: PPAImpl[] }

// ─── Circuit Types ────────────────────────────────────────────────────────────

export type GateType =
  | 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR'
  | 'MUX2' | 'MUX4' | 'DFF' | 'LATCH' | 'BUF'
  | 'HALFADDER' | 'FULLADDER'

export interface CircuitInput {
  id: string
  label: string
  defaultValue: 0 | 1
}

export interface CircuitOutput {
  id: string
  label: string
  expression: string // JS expression using input ids and gate ids
}

export interface CircuitGate {
  id: string
  type: GateType
  inputs: string[] // ids of inputs or other gates
  label?: string
}

export interface CircuitDef {
  inputs: CircuitInput[]
  gates: CircuitGate[]
  outputs: CircuitOutput[]
  isSequential?: boolean
}

// ─── Waveform Types ───────────────────────────────────────────────────────────

export interface WaveformSignal {
  name: string
  values: (0 | 1 | 'x' | 'z')[] // per clock cycle
  isClock?: boolean
}

export interface WaveformDef {
  signals: WaveformSignal[]
  cycleCount: number
}

// ─── Quiz Types ───────────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
  hardwareExplanation?: string
}

// ─── Lab / RTL Exercise Types ─────────────────────────────────────────────────

export interface TestVector {
  inputs: Record<string, number>
  expectedOutputs: Record<string, number>
  description?: string
}

export interface LabExercise {
  title: string
  spec: string           // markdown hardware specification
  diagramAscii?: string  // ASCII art of the hardware
  starterCode: string
  solution: string       // hidden until submitted
  testVectors: TestVector[]
  hints: string[]
  explanation: string    // hardware context for the exercise
  evaluationRules: EvaluationRule[]
}

export interface EvaluationRule {
  id: string
  check: 'no_latch' | 'no_blocking_in_ff' | 'complete_case' | 'no_loop' | 'reset_priority' | 'width_match' | 'custom'
  customFn?: string // stringified function for custom checks
  severity: 'error' | 'warning'
  message: string
  hardwareConsequence: string
}

// ─── Debug Challenge ──────────────────────────────────────────────────────────

export interface DebugChallenge {
  title: string
  brokenCode: string
  bugs: Bug[]
  explanation: string
}

export interface Bug {
  id: string
  line?: number
  description: string
  hardwareConsequence: string
  fix: string
}

// ─── PPA Compare ─────────────────────────────────────────────────────────────

export interface PPAImpl {
  label: string
  code: string
  area: 'low' | 'medium' | 'high'
  timing: 'fast' | 'medium' | 'slow'
  power: 'low' | 'medium' | 'high'
  notes: string
}

// ─── Progress Types ───────────────────────────────────────────────────────────

export interface LessonProgress {
  lessonId: string
  completed: boolean
  quizScore?: number   // 0-100
  labPassed?: boolean
  attempts: number
  lastAttemptAt?: string
}

export interface TopicMastery {
  topic: string
  score: number  // 0-100
  lessonsCompleted: number
  lessonsTotal: number
}

export interface ProgressState {
  lessons: Record<string, LessonProgress>
  topicMastery: Record<string, TopicMastery>
  weaknesses: string[]
  streakDays: number
  totalMinutes: number
}

// ─── Evaluation Result ────────────────────────────────────────────────────────

export interface EvaluationResult {
  passed: boolean
  score: number // 0-100
  functionalPassed: boolean
  checks: CheckResult[]
  failingVectors?: TestVector[]
  hardwareExplanation?: string
  suggestion?: string
}

export interface CheckResult {
  rule: string
  passed: boolean
  severity: 'error' | 'warning'
  message: string
  hardwareConsequence?: string
}
