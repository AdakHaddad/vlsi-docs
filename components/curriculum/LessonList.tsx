import Link from 'next/link';
import { Chapter } from '@/lib/types';

export default function LessonList({ chapter }: { chapter: Chapter }) {
  return (
    <div className="space-y-2">
      {chapter.lessons.map((lesson, idx) => (
        <Link 
          key={lesson.id} 
          href={`/learn/${chapter.id}/${lesson.id}`}
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 group border border-transparent hover:border-gray-200 transition-colors"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-xs font-mono text-gray-500 group-hover:bg-primary/10 group-hover:text-primary">
            {idx + 1}
          </div>
          <div className="flex-grow">
            <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary">{lesson.title}</h3>
          </div>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded">
            {lesson.type}
          </div>
        </Link>
      ))}
    </div>
  );
}
