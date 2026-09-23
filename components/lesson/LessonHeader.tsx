import { Lesson } from '@/lib/types';

export default function LessonHeader({ lesson }: { lesson: Lesson }) {
  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 py-6 px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono uppercase tracking-wider px-2 py-1 rounded bg-gray-100 text-gray-600">
            {lesson.type}
          </span>
          <span className="text-sm text-gray-500 font-mono">
            {lesson.duration} min read
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 uppercase">
          {lesson.title}
        </h1>
      </div>
    </div>
  );
}
