import Link from 'next/link';
import { Chapter } from '@/lib/types';
import LessonList from './LessonList';

export default function ChapterCard({ chapter }: { chapter: Chapter }) {
  const lessonCount = chapter.lessons.length;
  const totalDuration = chapter.lessons.reduce((acc, lesson) => acc + lesson.duration, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: chapter.color }}
      />
      <div className="p-6 flex-grow">
        <h2 className="text-2xl font-bold mb-2 uppercase" style={{ color: chapter.color }}>
          {chapter.title}
        </h2>
        <p className="text-gray-600 mb-6 min-h-[3rem]">{chapter.subtitle}</p>
        
        <div className="flex gap-4 text-sm text-gray-500 mb-6 font-mono bg-gray-50 p-2 rounded">
          <div>{lessonCount} lessons</div>
          <div>•</div>
          <div>~{totalDuration} mins</div>
        </div>

        <LessonList chapter={chapter} />
      </div>
    </div>
  );
}
