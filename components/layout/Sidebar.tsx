'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CURRICULUM } from '@/lib/curriculum';
import { useProgress } from '@/lib/progress';
import { ChevronRight, ChevronDown, CheckCircle2, Circle } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>(() => {
    // Expand first chapter by default
    const initial: Record<string, boolean> = {};
    if (CURRICULUM.length > 0) {
      initial[CURRICULUM[0].id] = true;
    }
    return initial;
  });
  
  const { progress } = useProgress();

  const toggleChapter = (id: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalLessons = CURRICULUM.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const completedLessons = Object.values(progress.lessons).filter(l => l.completed).length;
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="w-72 bg-primary-dark text-white flex flex-col h-screen overflow-hidden border-r border-primary">
      <div className="p-6 border-b border-primary-light/30">
        <Link href="/" className="text-3xl font-bold uppercase tracking-tight hover:text-primary-lightest transition-colors">
          VeriLearn
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        {CURRICULUM.map(chapter => (
          <div key={chapter.id} className="mb-2">
            <button 
              onClick={() => toggleChapter(chapter.id)}
              className="w-full flex items-center gap-2 px-6 py-3 text-left hover:bg-primary/50 transition-colors"
            >
              {expandedChapters[chapter.id] ? (
                <ChevronDown className="w-4 h-4 text-primary-lightest" />
              ) : (
                <ChevronRight className="w-4 h-4 text-primary-lightest" />
              )}
              <span className="font-bold uppercase text-sm" style={{ color: chapter.color }}>
                {chapter.title}
              </span>
            </button>
            
            {expandedChapters[chapter.id] && (
              <div className="mt-1 mb-3">
                {chapter.lessons.map((lesson, idx) => {
                  const isActive = pathname === `/learn/${chapter.id}/${lesson.id}`;
                  const isCompleted = progress.lessons[lesson.id]?.completed;
                  
                  return (
                    <Link
                      key={lesson.id}
                      href={`/learn/${chapter.id}/${lesson.id}`}
                      className={`
                        flex items-center gap-3 py-2 px-6 pl-12 text-sm transition-colors relative
                        ${isActive ? 'bg-primary text-white font-medium' : 'text-gray-300 hover:text-white hover:bg-primary/30'}
                      `}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary" />
                      )}
                      
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-success-border" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-500" />
                      )}
                      
                      <div className="flex-1 truncate">{lesson.title}</div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-6 bg-primary border-t border-primary-light/30">
        <div className="flex justify-between items-end mb-2 text-xs font-mono text-primary-lightest">
          <span>Overall Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 w-full bg-primary-dark rounded-full overflow-hidden">
          <div 
            className="h-full bg-secondary transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
