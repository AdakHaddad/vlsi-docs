import { ContentSection } from '@/lib/types';
import { RTLSnippet } from '@/components/textbook/RTLSnippet';
import ConceptSection from './sections/ConceptSection';
import CircuitSection from './sections/CircuitSection';
import TruthTableSection from './sections/TruthTableSection';
import WaveformSection from './sections/WaveformSection';
import CalloutSection from './sections/CalloutSection';

export default function ContentRenderer({ sections }: { sections: ContentSection[] }) {
  return (
    <div className="flex flex-col gap-12 py-8">
      {sections.map((section, idx) => {
        switch (section.kind) {
          case 'concept':
            return <ConceptSection key={idx} section={section} />;
          case 'rtlSnippet':
            return (
              <div key={idx} className="my-4">
                <RTLSnippet code={section.code} language={section.language} caption={section.caption} />
              </div>
            );
          case 'circuit':
            return <CircuitSection key={idx} section={section} />;
          case 'truthTable':
            return <TruthTableSection key={idx} section={section} />;
          case 'waveform':
            return <WaveformSection key={idx} section={section} />;
          case 'callout':
            return <CalloutSection key={idx} section={section} />;
          case 'ppaCompare':
            return (
              <div key={idx} className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 uppercase font-mono text-xs text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Implementation</th>
                      <th className="px-6 py-4">Area</th>
                      <th className="px-6 py-4">Timing</th>
                      <th className="px-6 py-4">Power</th>
                      <th className="px-6 py-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {section.implementations.map((impl, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 font-bold">{impl.label}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs uppercase font-mono ${impl.area === 'low' ? 'bg-green-100 text-green-800' : impl.area === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {impl.area}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs uppercase font-mono ${impl.timing === 'fast' ? 'bg-green-100 text-green-800' : impl.timing === 'slow' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {impl.timing}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs uppercase font-mono ${impl.power === 'low' ? 'bg-green-100 text-green-800' : impl.power === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {impl.power}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{impl.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return <div key={idx}>Unknown section type</div>;
        }
      })}
    </div>
  );
}
