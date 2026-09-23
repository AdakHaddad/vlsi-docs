import { ContentSection } from '@/lib/types';

type TruthTableType = Extract<ContentSection, { kind: 'truthTable' }>;

export default function TruthTableSection({ section }: { section: TruthTableType }) {
  return (
    <div className="my-8 overflow-hidden rounded-lg border border-gray-200 bg-white max-w-2xl mx-auto shadow-sm">
      <table className="w-full text-center font-mono">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {section.inputs.map((input, idx) => (
              <th key={`in-${idx}`} className="px-4 py-3 text-sm font-bold text-gray-700 uppercase tracking-wider">
                {input}
              </th>
            ))}
            {/* Divider column visually */}
            <th className="w-px p-0 bg-gray-200"></th>
            {section.outputs.map((output, idx) => (
              <th key={`out-${idx}`} className="px-4 py-3 text-sm font-bold text-primary uppercase tracking-wider">
                {output}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {section.rows.map((row, rowIdx) => (
            <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.slice(0, section.inputs.length).map((val, colIdx) => (
                <td key={`in-${rowIdx}-${colIdx}`} className="px-4 py-3">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-sm ${val === 1 ? 'bg-blue-100 text-blue-800 font-bold' : 'bg-gray-100 text-gray-600'}`}>
                    {val}
                  </span>
                </td>
              ))}
              <td className="w-px p-0 bg-gray-200"></td>
              {row.slice(section.inputs.length).map((val, colIdx) => (
                <td key={`out-${rowIdx}-${colIdx}`} className="px-4 py-3">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-sm ${val === 1 ? 'bg-primary-lightest text-primary-dark font-bold' : 'bg-gray-100 text-gray-600'}`}>
                    {val}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
