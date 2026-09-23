import { CURRICULUM } from '@/lib/curriculum';
import ChapterCard from '@/components/curriculum/ChapterCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 px-8 border-b-8 border-primary-light">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tight mb-4">
              VeriLearn
            </h1>
            <p className="text-xl md:text-2xl text-primary-lightest font-mono max-w-2xl">
              Master RTL Design for Modern VLSI
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Grid */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold uppercase text-text-main mb-4">Curriculum</h2>
            <div className="h-1 w-24 bg-secondary"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CURRICULUM.map(chapter => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
