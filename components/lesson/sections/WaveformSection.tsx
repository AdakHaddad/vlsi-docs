'use client';

import { ContentSection } from '@/lib/types';
import { Clock } from 'lucide-react';

type WaveformType = Extract<ContentSection, { kind: 'waveform' }>;

export default function WaveformSection({ section }: { section: WaveformType }) {
  const { def } = section;
  const cycleWidth = 40;
  const rowHeight = 60;
  const signalCount = def.signals.length;
  
  const width = def.cycleCount * cycleWidth;
  const height = signalCount * rowHeight;

  // Helper to draw a single signal's waveform path
  const drawPath = (values: (0 | 1 | 'x' | 'z')[], isClock?: boolean) => {
    let d = '';
    
    for (let i = 0; i < values.length; i++) {
      const val = values[i];
      const nextVal = values[i + 1];
      const x = i * cycleWidth;
      const nextX = (i + 1) * cycleWidth;
      
      const yHigh = 10;
      const yLow = 50;
      const yMid = 30;

      if (val === 1) {
        d += i === 0 ? `M ${x} ${yHigh} ` : `L ${x} ${yHigh} `;
        d += `L ${nextX} ${yHigh} `;
      } else if (val === 0) {
        d += i === 0 ? `M ${x} ${yLow} ` : `L ${x} ${yLow} `;
        d += `L ${nextX} ${yLow} `;
      } else if (val === 'z') {
        d += i === 0 ? `M ${x} ${yMid} ` : `L ${x} ${yMid} `;
        d += `L ${nextX} ${yMid} `;
      } else if (val === 'x') {
        // Draw crosshatch block for unknown (simplified as mid-box)
        d += i === 0 ? `M ${x} ${yMid} ` : `L ${x} ${yMid} `;
        d += `L ${nextX} ${yMid} `;
      }

      // Transition to next value
      if (nextVal !== undefined && val !== nextVal) {
         if (val === 1 && nextVal === 0) {
            d += `L ${nextX} ${yLow} `;
         } else if (val === 0 && nextVal === 1) {
            d += `L ${nextX} ${yHigh} `;
         } else {
             // For simplicity, just jump
         }
      }
    }
    
    return d;
  };

  return (
    <div className="my-8">
      {section.caption && (
        <p className="text-sm text-gray-500 mb-2 font-mono">{section.caption}</p>
      )}
      <div className="overflow-x-auto bg-gray-900 rounded-lg p-6 font-mono text-sm border border-gray-800 shadow-inner">
        <div className="flex">
          {/* Signal labels */}
          <div className="w-24 shrink-0 flex flex-col mt-[20px]">
            {def.signals.map((sig, idx) => (
              <div 
                key={`label-${idx}`} 
                className="h-[60px] flex items-center text-green-400 font-bold"
              >
                {sig.name}
                {sig.isClock && <Clock className="w-3 h-3 ml-1 text-green-600" />}
              </div>
            ))}
          </div>

          {/* Waveforms */}
          <div className="relative">
            {/* Grid and cycle numbers */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {Array.from({ length: def.cycleCount + 1 }).map((_, i) => (
                <div key={`grid-${i}`}>
                   <div 
                     className="absolute top-0 bottom-0 border-l border-gray-800 border-dashed"
                     style={{ left: `${i * cycleWidth}px` }}
                   />
                   <div 
                     className="absolute top-0 text-gray-600 text-xs -translate-x-1/2"
                     style={{ left: `${i * cycleWidth}px` }}
                   >
                     {i}
                   </div>
                </div>
              ))}
            </div>

            {/* SVG drawing area */}
            <svg width={width} height={height} className="mt-[20px] overflow-visible">
              {def.signals.map((sig, idx) => (
                <g key={`wave-${idx}`} transform={`translate(0, ${idx * rowHeight})`}>
                   {/* Draw paths for X and Z using rects for visual distinction if needed, but path covers it */}
                   {sig.values.map((v, i) => {
                      if (v === 'x') {
                         return (
                           <rect key={`x-${i}`} x={i * cycleWidth} y={15} width={cycleWidth} height={30} fill="#f87171" fillOpacity="0.3" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2"/>
                         )
                      }
                      return null;
                   })}
                   <path 
                     d={drawPath(sig.values, sig.isClock)} 
                     fill="none" 
                     stroke={sig.isClock ? "#3b82f6" : "#22c55e"} 
                     strokeWidth="2"
                     strokeLinejoin="round"
                   />
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
      
      {section.question && (
        <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
          <strong className="font-bold text-primary mr-2">Q:</strong>
          <span>{section.question}</span>
        </div>
      )}
    </div>
  );
}
