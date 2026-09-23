import { ContentSection } from '@/lib/types';

type ConceptType = Extract<ContentSection, { kind: 'concept' }>;

export default function ConceptSection({ section }: { section: ConceptType }) {
  return (
    <div className="prose prose-lg max-w-none text-text-main">
      {section.title && (
        <h2 className="text-3xl font-bold uppercase mb-6 tracking-tight text-text-main">
          {section.title}
        </h2>
      )}
      <div className="font-sans leading-relaxed space-y-4">
        {/* Simple markdown parsing for the text. Normally we'd use react-markdown here for full support */}
        {section.text.split('\n\n').map((paragraph, i) => {
          if (paragraph.startsWith('### ')) {
            return <h3 key={i} className="text-xl font-bold mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
          }
          if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ')) {
            const lines = paragraph.split('\n');
            return (
              <ol key={i} className="list-decimal pl-6 space-y-2 my-4">
                {lines.map((line, j) => (
                  <li key={j}>{line.replace(/^\d+\.\s/, '')}</li>
                ))}
              </ol>
            );
          }
          if (paragraph.includes('```')) {
             const parts = paragraph.split('```');
             if (parts.length >= 3) {
                return (
                  <div key={i} className="my-4">
                     <p>{parts[0]}</p>
                     <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto font-mono text-sm my-2">
                        <code>{parts[1]}</code>
                     </pre>
                     <p>{parts[2]}</p>
                  </div>
                )
             }
          }
          return <p key={i}>{paragraph.split('**').map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}</p>;
        })}
      </div>
    </div>
  );
}
