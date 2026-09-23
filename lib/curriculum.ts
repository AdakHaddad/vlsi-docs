import type { Chapter } from './types'

// ─────────────────────────────────────────────────────────────────────────────
//  Chapter 01 — Digital Logic
// ─────────────────────────────────────────────────────────────────────────────

const chapter01: Chapter = {
  id: '01-digital-logic',
  title: 'Digital Logic',
  subtitle: 'Gates, Boolean algebra, and combinational building blocks',
  color: '#00592B',
  lessons: [
    // ── 01: Logic Gates ────────────────────────────────────────────────────
    {
      id: '01-logic-gates',
      title: 'Logic Gates',
      type: 'read',
      duration: 12,
      content: {
        sections: [
          {
            kind: 'callout',
            variant: 'hardware',
            text: 'Every digital circuit is built from a small set of primitive gates. Before writing RTL, you must be able to **see the hardware** in your mind.',
          },
          {
            kind: 'concept',
            title: 'What Is a Logic Gate?',
            text: `A logic gate is a physical electronic switch that implements a Boolean function. It takes one or more **binary inputs** (0 or 1) and produces a single **binary output**.

In silicon, a logic gate is typically built from complementary pairs of MOSFETs (CMOS). When you write RTL, the synthesizer maps your description to these physical gates in the target technology library.

The fundamental gates are: **AND, OR, NOT, NAND, NOR, XOR, XNOR**.`,
          },
          {
            kind: 'circuit',
            def: {
              inputs: [
                { id: 'a', label: 'A', defaultValue: 0 },
                { id: 'b', label: 'B', defaultValue: 0 },
              ],
              gates: [
                { id: 'g_and', type: 'AND', inputs: ['a', 'b'], label: 'AND' },
                { id: 'g_or', type: 'OR', inputs: ['a', 'b'], label: 'OR' },
                { id: 'g_nand', type: 'NAND', inputs: ['a', 'b'], label: 'NAND' },
              ],
              outputs: [
                { id: 'y_and', label: 'A AND B', expression: 'a & b' },
                { id: 'y_or', label: 'A OR B', expression: 'a | b' },
                { id: 'y_nand', label: 'A NAND B', expression: '~(a & b) & 1' },
              ],
            },
            caption: 'Toggle the inputs to observe how each gate responds.',
          },
          {
            kind: 'truthTable',
            inputs: ['A', 'B'],
            outputs: ['AND', 'OR', 'NAND', 'NOR', 'XOR'],
            rows: [
              [0, 0, 0, 0, 1, 1, 0],
              [0, 1, 0, 1, 1, 0, 1],
              [1, 0, 0, 1, 1, 0, 1],
              [1, 1, 1, 1, 0, 0, 0],
            ],
          },
          {
            kind: 'concept',
            title: 'NAND and NOR — Universal Gates',
            text: `NAND and NOR are called **universal gates** because any Boolean function can be implemented using only NANDs or only NORs.

Real technology libraries often prefer NAND-based implementations because NAND gates are slightly faster and smaller than AND+NOT combinations in CMOS.

When you write \`assign y = a & b;\` in RTL, the synthesizer may actually map this to a NAND followed by an inverter, depending on the library.`,
          },
          {
            kind: 'callout',
            variant: 'tip',
            text: 'When reading RTL, always ask: **what physical gate does this correspond to?** This intuition is the foundation of hardware design.',
          },
        ],
        quiz: [
          {
            id: 'q01-gates-1',
            question: 'A 2-input NAND gate with A=1, B=1 produces what output?',
            options: ['0', '1', 'X (undefined)', 'Depends on implementation'],
            correct: 0,
            explanation: 'NAND is NOT(AND). AND(1,1) = 1, so NAND(1,1) = NOT(1) = 0.',
            hardwareExplanation: 'In CMOS, both pull-down transistors are on, but the output is pulled low only when both inputs are high — NAND inverts this, so the output is 0.',
          },
          {
            id: 'q01-gates-2',
            question: 'Which gate outputs 1 only when its inputs DIFFER?',
            options: ['AND', 'OR', 'XOR', 'XNOR'],
            correct: 2,
            explanation: 'XOR (Exclusive OR) outputs 1 when inputs are different (A≠B), and 0 when they are the same.',
            hardwareExplanation: 'XOR is widely used in adder carry logic and error detection circuits.',
          },
          {
            id: 'q01-gates-3',
            question: 'A 3-input AND gate. If any input is 0, the output is:',
            options: ['Always 0', 'Always 1', 'Equal to the remaining inputs ANDed', 'Undefined'],
            correct: 0,
            explanation: 'AND requires ALL inputs to be 1. A single 0 forces the output to 0, regardless of other inputs.',
          },
        ],
      },
    },

    // ── 02: NOT Gate and Inverter ──────────────────────────────────────────
    {
      id: '02-not-gate',
      title: 'NOT Gate & Inverter',
      type: 'explore',
      duration: 8,
      content: {
        sections: [
          {
            kind: 'concept',
            title: 'The Inverter',
            text: `The NOT gate (inverter) has a single input and produces its complement.

It is the simplest gate and appears constantly in digital design — in reset logic, in muxes, in FSM output logic, and as the "bubble" on NAND/NOR symbols.`,
          },
          {
            kind: 'circuit',
            def: {
              inputs: [{ id: 'a', label: 'A', defaultValue: 0 }],
              gates: [{ id: 'g_not', type: 'NOT', inputs: ['a'], label: 'NOT' }],
              outputs: [{ id: 'y', label: 'NOT A', expression: 'a ^ 1' }],
            },
            caption: 'The inverter: Y = NOT A',
          },
          {
            kind: 'rtlSnippet',
            code: `// SystemVerilog — describing an inverter
assign y = ~a;          // bitwise NOT

// In always_comb:
always_comb begin
    y = ~a;
end`,
            language: 'systemverilog',
            caption: 'RTL → synthesizes to a single inverter gate',
          },
          {
            kind: 'callout',
            variant: 'warning',
            text: 'Avoid unintentional double-inversion (`~~a`). While logically equivalent to `a`, it may add unnecessary gates or confuse synthesis tools.',
          },
        ],
        quiz: [
          {
            id: 'q01-not-1',
            question: 'In RTL, `assign y = ~a` where `a` is a 4-bit vector. The output `y` is:',
            options: [
              'The bitwise complement of all 4 bits',
              'Only the LSB inverted',
              'A single-bit reduction',
              'A syntax error',
            ],
            correct: 0,
            explanation: 'The `~` operator in SystemVerilog performs bitwise NOT on every bit. `~4\'b1010` = `4\'b0101`.',
          },
        ],
      },
    },

    // ── 03: 2:1 Multiplexer ────────────────────────────────────────────────
    {
      id: '03-mux-2to1',
      title: '2:1 Multiplexer',
      type: 'implement',
      duration: 20,
      content: {
        sections: [
          {
            kind: 'callout',
            variant: 'hardware',
            text: 'The **multiplexer** is one of the most important building blocks in digital design. Understand it deeply — it appears in ALUs, datapaths, FSMs, and everywhere else.',
          },
          {
            kind: 'concept',
            title: 'What Does a MUX Do?',
            text: `A 2:1 MUX selects one of two inputs based on a select signal.

When SEL=0, output Y = A.
When SEL=1, output Y = B.

Think of it as a **hardware if-else**. Every \`if/else\` in combinational RTL synthesizes to one or more multiplexers.

The Boolean equation is: **Y = (NOT SEL · A) + (SEL · B)**`,
          },
          {
            kind: 'circuit',
            def: {
              inputs: [
                { id: 'a', label: 'A', defaultValue: 0 },
                { id: 'b', label: 'B', defaultValue: 1 },
                { id: 'sel', label: 'SEL', defaultValue: 0 },
              ],
              gates: [{ id: 'mux', type: 'MUX2', inputs: ['a', 'b', 'sel'], label: '2:1 MUX' }],
              outputs: [{ id: 'y', label: 'Y', expression: 'sel ? b : a' }],
            },
            caption: 'Flip SEL to steer the output between A and B.',
          },
          {
            kind: 'rtlSnippet',
            code: `// RTL description of a 2:1 MUX
// Hardware: SEL controls which input drives Y

assign y = sel ? b : a;

// Equivalent using always_comb:
always_comb begin
    if (sel)
        y = b;
    else
        y = a;
end

// Equivalent using case:
always_comb begin
    case (sel)
        1'b0: y = a;
        1'b1: y = b;
    endcase
end`,
            language: 'systemverilog',
            caption: 'Three equivalent RTL styles. All synthesize to the same MUX hardware.',
          },
          {
            kind: 'callout',
            variant: 'info',
            text: 'The synthesis tool sees these three descriptions as equivalent and may generate identical netlist. The **hardware** is what matters, not the RTL style.',
          },
        ],
        quiz: [
          {
            id: 'q01-mux-1',
            question: 'A 2:1 MUX with A=0, B=1, SEL=1. What is Y?',
            options: ['0', '1', 'X', 'Depends on propagation delay'],
            correct: 1,
            explanation: 'SEL=1 selects input B. B=1, so Y=1.',
          },
          {
            id: 'q01-mux-2',
            question: 'The RTL `assign y = sel ? b : a` describes what hardware?',
            options: [
              'A D flip-flop controlled by sel',
              'A 2:1 multiplexer',
              'A tri-state buffer',
              'A priority encoder',
            ],
            correct: 1,
            explanation: 'The ternary operator in combinational RTL is the canonical description of a 2:1 MUX. SEL=sel, inputs A=a, B=b, output Y=y.',
          },
          {
            id: 'q01-mux-3',
            question: 'In CMOS, a 2:1 MUX is typically implemented using:',
            options: [
              'Two AND gates and an OR gate',
              'Transmission gates controlled by SEL and NOT SEL',
              'A ROM lookup table',
              'A single NAND gate',
            ],
            correct: 1,
            explanation: 'Standard-cell MUX implementations use transmission gates (pass-gate logic) for area efficiency. However, synthesis tools choose based on the target library.',
          },
        ],
        lab: {
          title: 'Implement a 2:1 Multiplexer',
          spec: `## Hardware Specification

Design a **2:1 multiplexer** module.

### Ports
| Port | Direction | Width | Description |
|------|-----------|-------|-------------|
| \`a\`  | input  | 1-bit | Data input 0 |
| \`b\`  | input  | 1-bit | Data input 1 |
| \`sel\`| input  | 1-bit | Select signal |
| \`y\`  | output | 1-bit | Output |

### Behavior
- When \`sel = 0\`: \`y = a\`
- When \`sel = 1\`: \`y = b\``,
          diagramAscii: `      a ──────►┐
               │  2:1 MUX ├──► y
      b ──────►┤
               │
    sel ───────┘`,
          starterCode: `module mux2 (
    input  logic a,
    input  logic b,
    input  logic sel,
    output logic y
);

    // Write your RTL here
    // Hint: use assign with ternary operator, or always_comb with if/else


endmodule`,
          solution: `module mux2 (
    input  logic a,
    input  logic b,
    input  logic sel,
    output logic y
);

    assign y = sel ? b : a;

endmodule`,
          testVectors: [
            { inputs: { a: 0, b: 0, sel: 0 }, expectedOutputs: { y: 0 } },
            { inputs: { a: 0, b: 1, sel: 0 }, expectedOutputs: { y: 0 } },
            { inputs: { a: 1, b: 0, sel: 0 }, expectedOutputs: { y: 1 } },
            { inputs: { a: 1, b: 1, sel: 0 }, expectedOutputs: { y: 1 } },
            { inputs: { a: 0, b: 0, sel: 1 }, expectedOutputs: { y: 0 } },
            { inputs: { a: 0, b: 1, sel: 1 }, expectedOutputs: { y: 1 } },
            { inputs: { a: 1, b: 0, sel: 1 }, expectedOutputs: { y: 0 } },
            { inputs: { a: 1, b: 1, sel: 1 }, expectedOutputs: { y: 1 } },
          ],
          hints: [
            'The ternary operator `sel ? b : a` is a clean one-liner.',
            'You can also use `always_comb` with `if (sel) y = b; else y = a;`',
            'All three RTL styles (assign/if-else/case) synthesize to the same hardware.',
          ],
          explanation: 'A 2:1 MUX routes one of two data inputs to the output. The select signal acts like a hardware switch. In synthesis, this becomes a standard-cell multiplexer.',
          evaluationRules: [
            {
              id: 'no_latch',
              check: 'no_latch',
              severity: 'error',
              message: 'Possible latch inferred. Ensure all code paths assign y.',
              hardwareConsequence: 'A latch adds a state element where none was intended, causing output to depend on previous values.',
            },
          ],
        },
      },
    },

    // ── 04: 4:1 Multiplexer ────────────────────────────────────────────────
    {
      id: '04-mux-4to1',
      title: '4:1 Multiplexer',
      type: 'implement',
      duration: 20,
      content: {
        sections: [
          {
            kind: 'concept',
            title: 'Scaling Up: 4:1 MUX',
            text: `A 4:1 MUX selects one of **four** inputs using a **2-bit select**.

| SEL | Y |
|-----|---|
| 00  | D[0] |
| 01  | D[1] |
| 10  | D[2] |
| 11  | D[3] |

A 4:1 MUX can be built from **three 2:1 MUXes** — two in the first stage, one in the second. This is called a **tree of MUXes**.`,
          },
          {
            kind: 'circuit',
            def: {
              inputs: [
                { id: 'd0', label: 'D[0]', defaultValue: 1 },
                { id: 'd1', label: 'D[1]', defaultValue: 0 },
                { id: 'd2', label: 'D[2]', defaultValue: 1 },
                { id: 'd3', label: 'D[3]', defaultValue: 0 },
                { id: 's0', label: 'SEL[0]', defaultValue: 0 },
                { id: 's1', label: 'SEL[1]', defaultValue: 0 },
              ],
              gates: [
                { id: 'mux01', type: 'MUX2', inputs: ['d0', 'd1', 's0'], label: 'MUX01' },
                { id: 'mux23', type: 'MUX2', inputs: ['d2', 'd3', 's0'], label: 'MUX23' },
                { id: 'mux_out', type: 'MUX2', inputs: ['mux01', 'mux23', 's1'], label: 'OUT MUX' },
              ],
              outputs: [
                { id: 'y', label: 'Y', expression: 's1 ? (s0 ? d3 : d2) : (s0 ? d1 : d0)' },
              ],
            },
          },
          {
            kind: 'rtlSnippet',
            code: `// 4:1 MUX using case (preferred for readability)
always_comb begin
    case (sel)
        2'b00: y = d[0];
        2'b01: y = d[1];
        2'b10: y = d[2];
        2'b11: y = d[3];
    endcase
end

// Equivalent nested ternary (less readable)
assign y = sel[1] ? (sel[0] ? d[3] : d[2])
                  : (sel[0] ? d[1] : d[0]);`,
            language: 'systemverilog',
          },
        ],
        quiz: [
          {
            id: 'q01-mux4-1',
            question: 'A 4:1 MUX with D={0,1,1,0} and SEL=2\'b10. What is Y?',
            options: ['0', '1', 'X', '2\'b10'],
            correct: 1,
            explanation: 'SEL=10 selects D[2]=1. Y=1.',
          },
          {
            id: 'q01-mux4-2',
            question: 'A 4:1 MUX can be built using how many 2:1 MUXes?',
            options: ['2', '3', '4', '6'],
            correct: 1,
            explanation: 'Two 2:1 MUXes in the first stage narrow 4 inputs to 2, then one more selects the final output. Total: 3.',
          },
        ],
        lab: {
          title: 'Implement a 4:1 Multiplexer',
          spec: `## Hardware Specification

Design a **4:1 multiplexer** module.

### Ports
| Port  | Direction | Width | Description |
|-------|-----------|-------|-------------|
| \`d\`   | input  | 4-bit | Data inputs |
| \`sel\` | input  | 2-bit | Select signal |
| \`y\`   | output | 1-bit | Output |

### Behavior
| sel | y    |
|-----|------|
| 00  | d[0] |
| 01  | d[1] |
| 10  | d[2] |
| 11  | d[3] |`,
          starterCode: `module mux4 (
    input  logic [3:0] d,
    input  logic [1:0] sel,
    output logic       y
);

    // Write your RTL here


endmodule`,
          solution: `module mux4 (
    input  logic [3:0] d,
    input  logic [1:0] sel,
    output logic       y
);

    always_comb begin
        case (sel)
            2'b00: y = d[0];
            2'b01: y = d[1];
            2'b10: y = d[2];
            2'b11: y = d[3];
        endcase
    end

endmodule`,
          testVectors: [
            { inputs: { d: 0b0001, sel: 0b00 }, expectedOutputs: { y: 1 }, description: 'SEL=00 → d[0]=1' },
            { inputs: { d: 0b0010, sel: 0b01 }, expectedOutputs: { y: 1 }, description: 'SEL=01 → d[1]=1' },
            { inputs: { d: 0b0100, sel: 0b10 }, expectedOutputs: { y: 1 }, description: 'SEL=10 → d[2]=1' },
            { inputs: { d: 0b1000, sel: 0b11 }, expectedOutputs: { y: 1 }, description: 'SEL=11 → d[3]=1' },
            { inputs: { d: 0b0000, sel: 0b00 }, expectedOutputs: { y: 0 } },
            { inputs: { d: 0b1111, sel: 0b10 }, expectedOutputs: { y: 1 } },
          ],
          hints: [
            'Use `case(sel)` with all four cases. This is cleaner than nested if-else for 4 options.',
            'Using `always_comb` with a complete `case` avoids latch inference.',
            'You can also use `d[sel]` — a direct array index! But this may not work in all tools for output assignment.',
          ],
          explanation: 'A 4:1 MUX is a fundamental datapath element. The `case` statement maps cleanly to MUX hardware and is the recommended RTL style for multi-input selection.',
          evaluationRules: [
            {
              id: 'no_latch',
              check: 'no_latch',
              severity: 'error',
              message: 'Possible latch inferred. All case branches must assign y.',
              hardwareConsequence: 'An incomplete case produces a latch — storage where none was intended.',
            },
            {
              id: 'complete_case',
              check: 'complete_case',
              severity: 'warning',
              message: 'Ensure all 4 sel values are handled.',
              hardwareConsequence: 'Unhandled cases lead to undefined behavior or latch inference.',
            },
          ],
        },
      },
    },

    // ── 05: Half Adder ────────────────────────────────────────────────────
    {
      id: '05-half-adder',
      title: 'Half Adder',
      type: 'implement',
      duration: 18,
      content: {
        sections: [
          {
            kind: 'concept',
            title: 'Adding Binary Bits',
            text: `A **half adder** adds two single-bit numbers (A + B) and produces:

- **Sum (S)**: the result bit
- **Carry (C)**: the carry-out into the next bit position

Binary addition rules:
| A | B | Sum | Carry |
|---|---|-----|-------|
| 0 | 0 |  0  |   0   |
| 0 | 1 |  1  |   0   |
| 1 | 0 |  1  |   0   |
| 1 | 1 |  0  |   1   |

Observe: **Sum = A XOR B** and **Carry = A AND B**.`,
          },
          {
            kind: 'circuit',
            def: {
              inputs: [
                { id: 'a', label: 'A', defaultValue: 0 },
                { id: 'b', label: 'B', defaultValue: 0 },
              ],
              gates: [
                { id: 'xor_g', type: 'XOR', inputs: ['a', 'b'], label: 'XOR' },
                { id: 'and_g', type: 'AND', inputs: ['a', 'b'], label: 'AND' },
              ],
              outputs: [
                { id: 'sum', label: 'Sum', expression: 'a ^ b' },
                { id: 'carry', label: 'Carry', expression: 'a & b' },
              ],
            },
            caption: 'A half adder: one XOR gate for Sum, one AND gate for Carry.',
          },
          {
            kind: 'rtlSnippet',
            code: `module half_adder (
    input  logic a, b,
    output logic sum, carry
);
    assign sum   = a ^ b;   // XOR gate
    assign carry = a & b;   // AND gate
endmodule`,
            language: 'systemverilog',
            caption: 'Two concurrent assign statements — two parallel gates.',
          },
          {
            kind: 'callout',
            variant: 'info',
            text: 'Both `assign` statements execute **simultaneously** — they describe parallel hardware, not sequential code. This is RTL thinking.',
          },
        ],
        quiz: [
          {
            id: 'q01-ha-1',
            question: 'Half adder with A=1, B=1. What are Sum and Carry?',
            options: ['Sum=0, Carry=1', 'Sum=1, Carry=0', 'Sum=1, Carry=1', 'Sum=0, Carry=0'],
            correct: 0,
            explanation: '1+1=10 in binary. Sum=0, Carry=1.',
          },
          {
            id: 'q01-ha-2',
            question: 'A half adder is built from which two gates?',
            options: ['AND + OR', 'XOR + AND', 'OR + NOT', 'NAND + NOR'],
            correct: 1,
            explanation: 'Sum = A XOR B (XOR gate), Carry = A AND B (AND gate).',
          },
        ],
        lab: {
          title: 'Implement a Half Adder',
          spec: `## Hardware Specification

Design a **half adder** module.

### Ports
| Port    | Direction | Width | Description |
|---------|-----------|-------|-------------|
| \`a\`     | input  | 1-bit | Addend A |
| \`b\`     | input  | 1-bit | Addend B |
| \`sum\`   | output | 1-bit | Sum bit |
| \`carry\` | output | 1-bit | Carry out |

### Behavior
\`{carry, sum} = a + b\``,
          starterCode: `module half_adder (
    input  logic a,
    input  logic b,
    output logic sum,
    output logic carry
);

    // Write your RTL here
    // sum   = ?
    // carry = ?


endmodule`,
          solution: `module half_adder (
    input  logic a,
    input  logic b,
    output logic sum,
    output logic carry
);

    assign sum   = a ^ b;
    assign carry = a & b;

endmodule`,
          testVectors: [
            { inputs: { a: 0, b: 0 }, expectedOutputs: { sum: 0, carry: 0 } },
            { inputs: { a: 0, b: 1 }, expectedOutputs: { sum: 1, carry: 0 } },
            { inputs: { a: 1, b: 0 }, expectedOutputs: { sum: 1, carry: 0 } },
            { inputs: { a: 1, b: 1 }, expectedOutputs: { sum: 0, carry: 1 } },
          ],
          hints: [
            'Sum = A XOR B. Use the `^` operator.',
            'Carry = A AND B. Use the `&` operator.',
            'Use two `assign` statements — one per output.',
          ],
          explanation: 'The half adder is the foundation of binary arithmetic. Two gate-level primitives (XOR + AND) implement 1-bit addition.',
          evaluationRules: [
            {
              id: 'no_latch',
              check: 'no_latch',
              severity: 'error',
              message: 'Latch detected. This should be purely combinational.',
              hardwareConsequence: 'A latch in an adder creates a sequential dependency where none should exist.',
            },
          ],
        },
      },
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
//  Chapter 02 — RTL Fundamentals
// ─────────────────────────────────────────────────────────────────────────────

const chapter02: Chapter = {
  id: '02-rtl-fundamentals',
  title: 'RTL Fundamentals',
  subtitle: 'assign, always_comb, always_ff, and the hardware they describe',
  color: '#0023D1',
  lessons: [
    {
      id: '01-assign-statement',
      title: 'The assign Statement',
      type: 'read',
      duration: 12,
      content: {
        sections: [
          {
            kind: 'callout',
            variant: 'hardware',
            text: '`assign` describes **continuous, concurrent, combinational logic**. It is a wire with logic, not a sequential instruction.',
          },
          {
            kind: 'concept',
            title: 'Continuous Assignment',
            text: `The \`assign\` statement in SystemVerilog creates a **continuous assignment** — it permanently connects the right-hand side expression to the left-hand side net.

Whenever any input changes, the output immediately updates (after propagation delay).

\`\`\`
assign y = a & b;
\`\`\`

This is NOT "execute this code when reached." It is a **persistent connection** in the circuit. The AND gate is always there, always computing.`,
          },
          {
            kind: 'rtlSnippet',
            code: `// These three assign statements are PARALLEL
// They all execute simultaneously, always
assign sum   = a ^ b;          // XOR gate
assign carry = a & b;          // AND gate
assign y     = ~(a | b);       // NOR gate (NOT of OR)

// The order of these statements doesn't matter —
// hardware has no concept of "line 1 before line 2"`,
            language: 'systemverilog',
          },
          {
            kind: 'callout',
            variant: 'warning',
            text: 'The biggest mental shift from software: **RTL has no execution order**. All `assign` statements are active simultaneously. Think wires, not instructions.',
          },
        ],
        quiz: [
          {
            id: 'q02-assign-1',
            question: 'You have: `assign y = a & b;` and `assign z = y | c;`. What happens when `a` changes?',
            options: [
              'Only `y` updates; `z` updates only on the next clock edge',
              'Both `y` and `z` update immediately (combinationally)',
              'The `assign` for `z` is executed first because it\'s below',
              'Nothing — assign only runs once at initialization',
            ],
            correct: 1,
            explanation: 'Both assigns are continuous. When `a` changes, `y` updates immediately, and since `y` feeds `z`, `z` also updates immediately in the same combinational evaluation.',
          },
          {
            id: 'q02-assign-2',
            question: 'Which is NOT a valid left-hand side for `assign`?',
            options: [
              '`assign wire_y = a ^ b;`',
              '`assign reg_q = d;` (where reg_q is declared as logic)',
              '`assign {carry, sum} = a + b;`',
              '`assign 3\'b101 = a;` (constant on left)',
            ],
            correct: 3,
            explanation: 'Constants cannot be driven. The LHS of assign must be a net or part-select of a net (or logic in SV). Concatenation on the LHS is valid.',
          },
        ],
      },
    },

    {
      id: '02-always-comb',
      title: 'always_comb — Combinational Logic',
      type: 'read',
      duration: 15,
      content: {
        sections: [
          {
            kind: 'concept',
            title: 'always_comb',
            text: `\`always_comb\` declares a block of combinational logic. The simulator automatically infers the sensitivity list — any signal read inside the block triggers re-evaluation.

Use \`always_comb\` when:
- Logic is more complex than a single expression
- You need a case statement
- You want to split large combinational descriptions into readable blocks`,
          },
          {
            kind: 'rtlSnippet',
            code: `// always_comb for a 4:1 MUX
always_comb begin
    case (sel)
        2'b00: y = d[0];
        2'b01: y = d[1];
        2'b10: y = d[2];
        2'b11: y = d[3];
    endcase
end

// CRITICAL: assign y in every branch
// Missing branches → LATCH (unintended sequential element)`,
            language: 'systemverilog',
          },
          {
            kind: 'callout',
            variant: 'warning',
            text: '**Latch Danger**: If any path through `always_comb` does NOT assign the output, synthesis infers a latch to hold the previous value. Latches are almost always unintentional.',
          },
          {
            kind: 'rtlSnippet',
            code: `// ❌ BAD: missing else — LATCH INFERRED for y
always_comb begin
    if (enable)
        y = data;    // What happens when enable=0? y must retain its value → LATCH
end

// ✅ GOOD: full coverage — COMBINATIONAL MUX
always_comb begin
    if (enable)
        y = data;
    else
        y = '0;      // explicit default
end`,
            language: 'systemverilog',
          },
        ],
        quiz: [
          {
            id: 'q02-comb-1',
            question: 'What unintended hardware does this produce?\n```\nalways_comb begin\n  if (sel) y = a;\nend\n```',
            options: [
              'A 2:1 MUX',
              'A latch (transparent latch)',
              'A flip-flop',
              'Nothing — it\'s valid combinational logic',
            ],
            correct: 1,
            explanation: 'When sel=0, y is never assigned. Hardware must retain y somehow → latch is inferred. This is almost always a bug.',
            hardwareExplanation: 'A latch is a level-sensitive storage element. It retains its output when its enable is low. This creates a feedback path in what was intended to be purely combinational logic.',
          },
          {
            id: 'q02-comb-2',
            question: '`always_comb` vs `always @(*)` — which statement is true?',
            options: [
              '`always_comb` is SystemVerilog only; `always @(*)` is Verilog; they are semantically identical',
              '`always_comb` automatically handles all sensitivity; `always @(*)` may miss some signals',
              '`always_comb` is faster to simulate',
              'They are interchangeable in all cases',
            ],
            correct: 1,
            explanation: '`always_comb` is stricter: it includes function contents in sensitivity, runs once at time 0, and tools can lint for combinational completeness. Prefer `always_comb` in SystemVerilog.',
          },
        ],
      },
    },

    {
      id: '03-always-ff',
      title: 'always_ff — Sequential Logic',
      type: 'read',
      duration: 18,
      content: {
        sections: [
          {
            kind: 'callout',
            variant: 'hardware',
            text: '`always_ff` describes **flip-flop based sequential logic**. Every signal assigned in `always_ff` maps to a register (flip-flop) in hardware.',
          },
          {
            kind: 'concept',
            title: 'The D Flip-Flop',
            text: `A **D flip-flop (DFF)** is the fundamental sequential element. It captures the value of D on the rising edge of CLK and holds it at Q.

Between clock edges, Q does not change, regardless of what D does.

This is how digital circuits store state.`,
          },
          {
            kind: 'circuit',
            def: {
              inputs: [
                { id: 'd', label: 'D', defaultValue: 0 },
                { id: 'clk', label: 'CLK', defaultValue: 0 },
              ],
              gates: [
                { id: 'dff', type: 'DFF', inputs: ['d', 'clk'], label: 'DFF' },
              ],
              outputs: [
                { id: 'q', label: 'Q', expression: 'dff_q' },
              ],
              isSequential: true,
            },
            caption: 'Press STEP CLOCK to capture D into Q.',
          },
          {
            kind: 'rtlSnippet',
            code: `// A single D flip-flop with synchronous reset
always_ff @(posedge clk) begin
    if (rst)
        q <= 1'b0;       // synchronous reset: clears on clock edge
    else
        q <= d;          // captures D on every rising clock edge
end

// KEY: use NON-BLOCKING assignment (<=) in always_ff
// NEVER use blocking assignment (=) in always_ff`,
            language: 'systemverilog',
          },
          {
            kind: 'callout',
            variant: 'warning',
            text: '**Non-blocking (`<=`) is mandatory in `always_ff`**. Using blocking assignment (`=`) in flip-flop logic causes race conditions in simulation and incorrect hardware inference.',
          },
          {
            kind: 'waveform',
            def: {
              signals: [
                { name: 'CLK', values: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], isClock: true },
                { name: 'RST', values: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0] },
                { name: 'D', values: [0, 0, 0, 1, 1, 0, 0, 1, 1, 1] },
                { name: 'Q', values: [0, 0, 0, 0, 1, 1, 0, 0, 1, 1] },
              ],
              cycleCount: 10,
            },
            caption: 'Q updates one cycle after the rising clock edge when D is sampled.',
            question: 'Why does Q remain 0 at cycle 2 even though RST goes low?',
          },
        ],
        quiz: [
          {
            id: 'q02-ff-1',
            question: 'In `always_ff @(posedge clk)`, when does `q` update?',
            options: [
              'Immediately when D changes',
              'On every rising edge of CLK',
              'Continuously, like combinational logic',
              'Only when RST is asserted',
            ],
            correct: 1,
            explanation: 'A DFF captures its input (D) on the rising clock edge and holds it until the next rising edge. This is the fundamental property of a flip-flop.',
          },
          {
            id: 'q02-ff-2',
            question: 'Why use `<=` (non-blocking) in `always_ff` instead of `=` (blocking)?',
            options: [
              'It\'s just a style preference, both work identically',
              'Non-blocking evaluates all RHS first, then updates LHS, preventing simulation races',
              'Blocking is faster to simulate',
              '`<=` is required syntax for `always_ff` blocks',
            ],
            correct: 1,
            explanation: 'Non-blocking assignment schedules the update after all RHS evaluations complete. This correctly models how flip-flops work — all inputs are sampled at the clock edge, all outputs update simultaneously.',
          },
        ],
      },
    },

    // ── Latch Inference Debug Challenge ───────────────────────────────────
    {
      id: '04-latch-debug',
      title: 'Debug: Unintentional Latch',
      type: 'debug',
      duration: 15,
      content: {
        sections: [
          {
            kind: 'callout',
            variant: 'hardware',
            text: 'Latch inference is one of the most common RTL bugs. Find and fix the bug in the code below.',
          },
          {
            kind: 'concept',
            title: 'The Problem',
            text: `The code below was written to implement a simple output mux. But it has a critical bug that causes unintended hardware. Analyze it carefully before revealing the answer.`,
          },
        ],
        debugChallenge: {
          title: 'Identify the Latch',
          brokenCode: `module output_select (
    input  logic       enable,
    input  logic [7:0] data,
    output logic [7:0] y
);

    always_comb begin
        if (enable)
            y = data;
        // Missing: what happens when enable = 0?
    end

endmodule`,
          bugs: [
            {
              id: 'bug-latch',
              line: 7,
              description: 'Missing else branch — latch inferred for y',
              hardwareConsequence: 'When enable=0, y has no driver in the combinational block, so synthesis must insert a latch to retain the previous value of y. This creates unintended state in what should be a purely combinational circuit.',
              fix: `always_comb begin
    if (enable)
        y = data;
    else
        y = '0;    // or y = 8\'hFF; or whatever the correct default is
end`,
            },
          ],
          explanation: 'A latch is a level-sensitive storage element. It is power-hungry, timing-problematic (no setup/hold from a clock), and usually a sign of incomplete RTL specification. Always provide defaults in combinational blocks.',
        },
      },
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
//  Chapter 03 — Sequential Logic
// ─────────────────────────────────────────────────────────────────────────────

const chapter03: Chapter = {
  id: '03-sequential-logic',
  title: 'Sequential Logic',
  subtitle: 'DFFs, registers, counters, and state-holding elements',
  color: '#7C3AED',
  lessons: [
    {
      id: '01-d-flip-flop',
      title: 'D Flip-Flop',
      type: 'explore',
      duration: 15,
      content: {
        sections: [
          {
            kind: 'concept',
            title: 'The D Flip-Flop: State in Hardware',
            text: `The **D flip-flop** is the atomic unit of state in synchronous digital design.

Properties:
- **Edge-triggered**: captures D **only** on the active clock edge
- **Holds state**: Q is stable between edges
- **Predictable**: all DFFs in the design update at the same moment (the clock edge)

This is what makes synchronous design manageable at scale.`,
          },
          {
            kind: 'circuit',
            def: {
              inputs: [
                { id: 'd', label: 'D', defaultValue: 1 },
                { id: 'rst', label: 'RST', defaultValue: 0 },
                { id: 'en', label: 'EN', defaultValue: 1 },
              ],
              gates: [{ id: 'dff', type: 'DFF', inputs: ['d', 'rst', 'en'], label: 'DFF' }],
              outputs: [{ id: 'q', label: 'Q', expression: 'dff_q' }],
              isSequential: true,
            },
            caption: 'Step the clock. RST clears Q. EN controls whether D is captured.',
          },
          {
            kind: 'rtlSnippet',
            code: `// DFF with synchronous reset and enable
always_ff @(posedge clk) begin
    if (rst)          // highest priority: reset
        q <= 1'b0;
    else if (en)      // only load when enabled
        q <= d;
    // implicit: if !rst && !en → q retains its value (DFF holds state)
end`,
            language: 'systemverilog',
          },
          {
            kind: 'waveform',
            def: {
              signals: [
                { name: 'CLK', values: [0,1,0,1,0,1,0,1,0,1,0,1], isClock: true },
                { name: 'RST', values: [1,1,0,0,0,0,0,0,0,0,0,0] },
                { name: 'EN',  values: [0,0,0,1,1,0,0,1,1,1,1,1] },
                { name: 'D',   values: [1,1,1,1,0,0,1,1,0,1,0,1] },
                { name: 'Q',   values: [0,0,0,0,1,0,0,1,1,0,1,0] },
              ],
              cycleCount: 12,
            },
            question: 'At which clock edge does Q first capture the value of D?',
          },
        ],
        quiz: [
          {
            id: 'q03-dff-1',
            question: 'A DFF with RST=0, EN=1, D=1. What happens on the next rising edge?',
            options: ['Q → 1', 'Q → 0', 'Q retains its previous value', 'Q toggles'],
            correct: 0,
            explanation: 'EN=1 and RST=0: the DFF captures D=1 on the rising edge. Q becomes 1.',
          },
          {
            id: 'q03-dff-2',
            question: 'A DFF with RST=0, EN=0, D=1. What happens on the next rising edge?',
            options: ['Q → 1', 'Q → 0', 'Q retains its previous value', 'Q toggles'],
            correct: 2,
            explanation: 'EN=0: the DFF is not enabled. The else-if branch is skipped, and Q holds its current value. This is the "hold" behavior.',
          },
        ],
      },
    },

    {
      id: '02-register',
      title: '8-bit Register',
      type: 'implement',
      duration: 20,
      content: {
        sections: [
          {
            kind: 'concept',
            title: 'A Register is a Bank of Flip-Flops',
            text: `An N-bit **register** is simply N D flip-flops sharing the same clock, reset, and enable signals.

An 8-bit register stores one byte of state. Register files in CPUs are arrays of registers.`,
          },
          {
            kind: 'rtlSnippet',
            code: `// 8-bit register with synchronous reset and enable
always_ff @(posedge clk) begin
    if (rst)
        q <= 8'h00;     // reset all 8 bits to 0
    else if (en)
        q <= d;         // load 8-bit data
end`,
            language: 'systemverilog',
          },
        ],
        lab: {
          title: 'Implement an 8-bit Register',
          spec: `## Hardware Specification

Design an **8-bit register** with synchronous reset and enable.

### Ports
| Port  | Direction | Width | Description |
|-------|-----------|-------|-------------|
| \`clk\` | input  | 1-bit | Clock |
| \`rst\` | input  | 1-bit | Synchronous reset (active-high) |
| \`en\`  | input  | 1-bit | Enable |
| \`d\`   | input  | 8-bit | Data input |
| \`q\`   | output | 8-bit | Data output |

### Behavior
- On rising edge of \`clk\`: if \`rst\`, \`q\` → 0; else if \`en\`, \`q\` → \`d\`; else \`q\` holds`,
          starterCode: `module reg8 (
    input  logic       clk,
    input  logic       rst,
    input  logic       en,
    input  logic [7:0] d,
    output logic [7:0] q
);

    // Write your RTL here


endmodule`,
          solution: `module reg8 (
    input  logic       clk,
    input  logic       rst,
    input  logic       en,
    input  logic [7:0] d,
    output logic [7:0] q
);

    always_ff @(posedge clk) begin
        if (rst)
            q <= 8'h00;
        else if (en)
            q <= d;
    end

endmodule`,
          testVectors: [
            { inputs: { clk: 1, rst: 1, en: 0, d: 0xFF }, expectedOutputs: { q: 0x00 }, description: 'Reset clears q' },
            { inputs: { clk: 1, rst: 0, en: 1, d: 0xAB }, expectedOutputs: { q: 0xAB }, description: 'Enable loads d' },
            { inputs: { clk: 1, rst: 0, en: 0, d: 0xFF }, expectedOutputs: { q: 0xAB }, description: 'Hold: q unchanged' },
          ],
          hints: [
            'Use `always_ff @(posedge clk)`.',
            'Priority: reset first, then enable.',
            'Use `<=` (non-blocking) assignment.',
          ],
          explanation: 'A register is a bank of DFFs. The reset and enable signals control all bits uniformly.',
          evaluationRules: [
            { id: 'no_blocking_in_ff', check: 'no_blocking_in_ff', severity: 'error', message: 'Use non-blocking assignment (<=) in always_ff.', hardwareConsequence: 'Blocking assignment in flip-flop logic causes simulation races and incorrect hardware behavior.' },
            { id: 'reset_priority', check: 'reset_priority', severity: 'warning', message: 'Check reset has higher priority than enable.', hardwareConsequence: 'Wrong priority can prevent reset from clearing the register.' },
          ],
        },
      },
    },

    {
      id: '03-counter',
      title: '4-bit Up Counter',
      type: 'implement',
      duration: 22,
      content: {
        sections: [
          {
            kind: 'concept',
            title: 'Counters: Feedback Through Registers',
            text: `A **counter** is a register whose next state depends on its current state.

The output Q is fed back to the input through an adder. On each clock edge, the register increments.

This is the simplest feedback system and the basis of program counters, timers, and address generators.`,
          },
          {
            kind: 'rtlSnippet',
            code: `// 4-bit counter with synchronous reset
always_ff @(posedge clk) begin
    if (rst)
        count <= 4'd0;
    else if (en)
        count <= count + 4'd1;   // feedback: next = current + 1
end

// The '+' here synthesizes to a 4-bit ripple adder + carry logic
// The result feeds back into the DFF input`,
            language: 'systemverilog',
          },
          {
            kind: 'waveform',
            def: {
              signals: [
                { name: 'CLK',   values: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], isClock: true },
                { name: 'RST',   values: [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0] },
                { name: 'EN',    values: [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1] },
                { name: 'COUNT', values: [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6] },
              ],
              cycleCount: 16,
            },
          },
        ],
        lab: {
          title: 'Implement a 4-bit Up Counter',
          spec: `## Hardware Specification

Design a **4-bit synchronous up counter**.

### Ports
| Port    | Direction | Width | Description |
|---------|-----------|-------|-------------|
| \`clk\`   | input  | 1-bit | Clock |
| \`rst\`   | input  | 1-bit | Synchronous reset |
| \`en\`    | input  | 1-bit | Count enable |
| \`count\` | output | 4-bit | Current count value |

### Behavior
- Counts 0→1→2→…→15→0 (wraps naturally on overflow)
- \`rst\`: resets count to 0 on rising edge
- \`en=0\`: holds current count`,
          starterCode: `module counter4 (
    input  logic       clk,
    input  logic       rst,
    input  logic       en,
    output logic [3:0] count
);

    // Write your RTL here


endmodule`,
          solution: `module counter4 (
    input  logic       clk,
    input  logic       rst,
    input  logic       en,
    output logic [3:0] count
);

    always_ff @(posedge clk) begin
        if (rst)
            count <= 4'd0;
        else if (en)
            count <= count + 4'd1;
    end

endmodule`,
          testVectors: [
            { inputs: { clk: 1, rst: 1, en: 0 }, expectedOutputs: { count: 0 } },
            { inputs: { clk: 1, rst: 0, en: 1 }, expectedOutputs: { count: 1 } },
            { inputs: { clk: 1, rst: 0, en: 1 }, expectedOutputs: { count: 2 } },
            { inputs: { clk: 1, rst: 0, en: 0 }, expectedOutputs: { count: 2 }, description: 'Hold' },
          ],
          hints: [
            '`count <= count + 1` — the feedback creates the counting behavior.',
            'The 4-bit width means it wraps from 15 to 0 naturally.',
          ],
          explanation: 'A counter is a register with an adder in the feedback path. This simple feedback loop is the basis of state machines, timers, and program counters.',
          evaluationRules: [
            { id: 'no_blocking_in_ff', check: 'no_blocking_in_ff', severity: 'error', message: 'Use <= in always_ff.', hardwareConsequence: 'Blocking assignment causes simulation/synthesis mismatch.' },
          ],
        },
      },
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
//  Chapter 04 — FSM
// ─────────────────────────────────────────────────────────────────────────────

const chapter04: Chapter = {
  id: '04-fsm',
  title: 'Finite State Machines',
  subtitle: 'Moore, Mealy, state encoding, and transition logic',
  color: '#B45309',
  lessons: [
    {
      id: '01-fsm-intro',
      title: 'Introduction to FSMs',
      type: 'read',
      duration: 20,
      content: {
        sections: [
          {
            kind: 'callout',
            variant: 'hardware',
            text: 'An FSM is a **register + combinational logic**. The register holds state; the combinational logic computes next state and outputs.',
          },
          {
            kind: 'concept',
            title: 'What Is a Finite State Machine?',
            text: `A **Finite State Machine (FSM)** is a system that:

1. Exists in one of a finite set of **states**
2. Transitions between states based on **inputs**
3. Produces **outputs** based on state (and optionally inputs)

Every digital controller, protocol handler, and sequencer is an FSM.

### Hardware Structure

\`\`\`
         ┌──────────────────────────────────────────┐
         │                                          │
Inputs──►│  Next-State    ┌──────────┐  Output     │
         │    Logic   ───►│  State   ├──► Logic ──►│ Outputs
         │  (comb.)   ◄───│  Register│   (comb.)   │
         │                │  (DFFs)  │             │
         │                └──────────┘             │
         └──────────────────────────────────────────┘
                                ↑
                               CLK
\`\`\`

The **state register** holds the current state. The **next-state logic** (combinational) computes what state comes next. The **output logic** (combinational) drives the outputs.`,
          },
          {
            kind: 'concept',
            title: 'Moore vs Mealy',
            text: `**Moore FSM**: outputs depend only on current state.

**Mealy FSM**: outputs depend on current state AND current inputs.

| Feature | Moore | Mealy |
|---------|-------|-------|
| Output depends on | State only | State + Inputs |
| Output changes | After state transition | Can change mid-state |
| States needed | Often more | Often fewer |
| Glitches | Less likely | Possible on input glitches |

For most controller applications, **Moore is preferred** — simpler timing and cleaner output behavior.`,
          },
          {
            kind: 'rtlSnippet',
            code: `// 3-state Moore FSM: traffic light controller
typedef enum logic [1:0] {
    RED   = 2'b00,
    GREEN = 2'b01,
    YELLOW = 2'b10
} state_t;

state_t state, next_state;

// State register
always_ff @(posedge clk) begin
    if (rst) state <= RED;
    else     state <= next_state;
end

// Next-state logic (combinational)
always_comb begin
    case (state)
        RED:    next_state = timer_expired ? GREEN  : RED;
        GREEN:  next_state = timer_expired ? YELLOW : GREEN;
        YELLOW: next_state = timer_expired ? RED    : YELLOW;
        default: next_state = RED;
    endcase
end

// Output logic (Moore: depends only on state)
always_comb begin
    case (state)
        RED:    {red, yellow, green} = 3'b100;
        GREEN:  {red, yellow, green} = 3'b001;
        YELLOW: {red, yellow, green} = 3'b010;
        default:{red, yellow, green} = 3'b100;
    endcase
end`,
            language: 'systemverilog',
            caption: 'Classic 3-always-block FSM style: state reg + next-state logic + output logic.',
          },
        ],
        quiz: [
          {
            id: 'q04-fsm-1',
            question: 'In a Moore FSM, the output depends on:',
            options: [
              'The current state only',
              'The current state and current inputs',
              'The next state',
              'The clock frequency',
            ],
            correct: 0,
            explanation: 'Moore FSM outputs depend only on the current state. This makes outputs glitch-free (they only change after a state transition on the clock edge).',
          },
          {
            id: 'q04-fsm-2',
            question: 'A Mealy FSM potentially has an advantage in:',
            options: [
              'Glitch immunity',
              'Requiring fewer states',
              'Simpler timing analysis',
              'Faster clock speed',
            ],
            correct: 1,
            explanation: 'Mealy FSMs can produce outputs earlier (mid-state, on input changes), sometimes requiring fewer states. But outputs can glitch on input noise.',
          },
        ],
      },
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
//  Export
// ─────────────────────────────────────────────────────────────────────────────

export const CURRICULUM: Chapter[] = [
  chapter01,
  chapter02,
  chapter03,
  chapter04,
]

export function getChapter(chapterId: string): Chapter | undefined {
  return CURRICULUM.find(c => c.id === chapterId)
}

export function getLesson(chapterId: string, lessonId: string) {
  const chapter = getChapter(chapterId)
  return chapter?.lessons.find(l => l.id === lessonId)
}

export function getTotalLessons(): number {
  return CURRICULUM.reduce((acc, ch) => acc + ch.lessons.length, 0)
}
