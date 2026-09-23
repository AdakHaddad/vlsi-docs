'use client';

import { useState } from 'react';
import { ContentSection } from '@/lib/types';
import { createSimulator, setInput } from '@/lib/simulation';

type CircuitType = Extract<ContentSection, { kind: 'circuit' }>;

export default function CircuitSection({ section }: { section: CircuitType }) {
  const [simState, setSimState] = useState(() => createSimulator(section.def));

  const handleToggle = (inputId: string) => {
    const currentValue = simState.inputValues[inputId];
    const newValue = currentValue === 1 ? 0 : 1;
    const newState = setInput(simState, inputId, newValue as 0 | 1, section.def);
    setSimState(newState);
  };

  return (
    <div className="my-8 border border-gray-200 rounded-lg p-6 bg-surface shadow-sm">
      {section.caption && (
        <h3 className="text-lg font-bold mb-6 text-center">{section.caption}</h3>
      )}
      
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-16">
        
        {/* Inputs */}
        <div className="flex flex-col justify-center gap-4">
          <div className="text-xs font-mono uppercase text-gray-500 mb-2 text-center">Inputs</div>
          {section.def.inputs.map(input => (
            <div key={input.id} className="flex items-center gap-3">
              <span className="font-mono font-bold w-8 text-right">{input.label}</span>
              <button
                onClick={() => handleToggle(input.id)}
                className={`w-12 h-12 flex items-center justify-center rounded-lg font-mono text-xl font-bold transition-colors ${
                  simState.inputValues[input.id] === 1 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {simState.inputValues[input.id]}
              </button>
            </div>
          ))}
        </div>

        {/* Logic / Gates - Simplified representation */}
        <div className="flex items-center justify-center flex-1 min-w-[200px] border-x-2 border-dashed border-gray-300 relative px-8 py-4">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-mono uppercase text-gray-400">Logic Network</div>
          <div className="flex flex-wrap gap-2 justify-center">
             {section.def.gates.map((gate, idx) => (
                <div key={idx} className="bg-gray-100 border border-gray-300 rounded px-3 py-2 text-sm font-mono text-center">
                   <div className="font-bold">{gate.type}</div>
                   <div className="text-xs text-gray-500">{gate.label || gate.id}</div>
                </div>
             ))}
          </div>
        </div>

        {/* Outputs */}
        <div className="flex flex-col justify-center gap-4">
          <div className="text-xs font-mono uppercase text-gray-500 mb-2 text-center">Outputs</div>
          {section.def.outputs.map(output => (
            <div key={output.id} className="flex items-center gap-3">
              <div 
                className={`w-12 h-12 flex items-center justify-center rounded-lg font-mono text-xl font-bold ${
                  simState.outputValues[output.id] === 1 
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(0,89,43,0.5)]' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {simState.outputValues[output.id]}
              </div>
              <span className="font-mono font-bold w-8 text-left">{output.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
