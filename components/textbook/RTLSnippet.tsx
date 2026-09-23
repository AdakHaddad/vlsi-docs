'use client'
import { useState } from 'react'

interface RTLSnippetProps {
  code: string
  language?: 'verilog' | 'systemverilog'
  caption?: string
}

export function RTLSnippet({ code, language = 'systemverilog', caption }: RTLSnippetProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple syntax highlighting via regex
  const highlighted = highlightSV(code)

  return (
    <div className="rounded-lg border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d0d0d] border-b border-white/10">
        <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
          {language === 'systemverilog' ? 'SystemVerilog' : 'Verilog'}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs font-mono text-white/40 hover:text-white/70 transition-colors px-2 py-0.5"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div className="relative">
        <pre
          className="p-4 text-sm leading-relaxed overflow-x-auto bg-[#080808] font-['JetBrains_Mono',_monospace] text-white/80"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>
      {caption && (
        <div className="px-4 py-2.5 border-t border-white/10 bg-[#0d0d0d] text-xs text-white/40 font-mono">
          ↳ {caption}
        </div>
      )}
    </div>
  )
}

function highlightSV(code: string): string {
  const keywords = ['module', 'endmodule', 'input', 'output', 'inout', 'logic', 'wire', 'reg', 'always_ff', 'always_comb', 'always', 'assign', 'if', 'else', 'case', 'endcase', 'begin', 'end', 'posedge', 'negedge', 'typedef', 'enum', 'parameter', 'localparam', 'function', 'endfunction', 'task', 'endtask', 'generate', 'endgenerate', 'for', 'default', 'unique', 'priority']
  const types = ['logic', 'wire', 'reg', 'bit', 'byte', 'int', 'integer', 'shortint', 'longint', 'state_t']
  
  let result = code
    // Escape HTML first
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Comments
    .replace(/(^\/\/.*$)/gm, '<span style="color:#4d7c5c">$1</span>')
    // Strings
    .replace(/(\'[^']*\')/g, '<span style="color:#ce9178">$1</span>')
    // Numbers with radix
    .replace(/(\d*\'[bdh][0-9a-fA-F_xzXZ]+)/g, '<span style="color:#b5cea8">$1</span>')
    // Plain numbers
    .replace(/\b(\d+)\b/g, '<span style="color:#b5cea8">$1</span>')

  // Keywords
  for (const kw of keywords) {
    result = result.replace(new RegExp(`\\b(${kw})\\b`, 'g'), '<span style="color:#569cd6;font-weight:600">$1</span>')
  }

  // Operators
  result = result
    .replace(/([&lt;<>!~^|&+\-*=]{1,2})/g, '<span style="color:#d4d4d4">$1</span>')

  return result
}
