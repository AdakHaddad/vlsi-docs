'use client';

import Link from 'next/link';
import { CURRICULUM } from '@/lib/curriculum';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NavFooter({ chapterId, lessonId }: { chapterId: string, lessonId: string }) {
  // Find current position
  let currentChapterIdx = -1;
  let currentLessonIdx = -1;

  for (let i = 0; i < CURRICULUM.length; i++) {
    if (CURRICULUM[i].id === chapterId) {
      currentChapterIdx = i;
      for (let j = 0; j < CURRICULUM[i].lessons.length; j++) {
        if (CURRICULUM[i].lessons[j].id === lessonId) {
          currentLessonIdx = j;
          break;
        }
      }
      break;
    }
  }

  if (currentChapterIdx === -1 || currentLessonIdx === -1) return null;

  // Determine prev
  let prev = null;
  if (currentLessonIdx > 0) {
    prev = {
      chapterId: CURRICULUM[currentChapterIdx].id,
      lesson: CURRICULUM[currentChapterIdx].lessons[currentLessonIdx - 1]
    };
  } else if (currentChapterIdx > 0) {
    const prevChap = CURRICULUM[currentChapterIdx - 1];
    prev = {
      chapterId: prevChap.id,
      lesson: prevChap.lessons[prevChap.lessons.length - 1]
    };
  }

  // Determine next
  let next = null;
  if (currentLessonIdx < CURRICULUM[currentChapterIdx].lessons.length - 1) {
    next = {
      chapterId: CURRICULUM[currentChapterIdx].id,
      lesson: CURRICULUM[currentChapterIdx].lessons[currentLessonIdx + 1]
    };
  } else if (currentChapterIdx < CURRICULUM.length - 1) {
    next = {
      chapterId: CURRICULUM[currentChapterIdx + 1].id,
      lesson: CURRICULUM[currentChapterIdx + 1].lessons[0]
    };
  }

  const isLastInChapter = currentLessonIdx === CURRICULUM[currentChapterIdx].lessons.length - 1;

  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      {isLastInChapter && (
        <div className="mb-8 p-6 bg-success-bg border border-success-border rounded-lg text-center">
          <h3 className="text-xl font-bold text-success-text mb-2 uppercase">Chapter Complete!</h3>
          <p className="text-success-text/80">Great job finishing {CURRICULUM[currentChapterIdx].title}. Keep the momentum going!</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {prev ? (
          <Link 
            href={`/learn/${prev.chapterId}/${prev.lesson.id}`}
            className="flex-1 flex items-center gap-4 p-6 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-primary" />
            <div>
              <div className="text-xs font-mono text-gray-500 uppercase mb-1">Previous</div>
              <div className="font-bold text-gray-900 group-hover:text-primary">{prev.lesson.title}</div>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {next ? (
          <Link 
            href={`/learn/${next.chapterId}/${next.lesson.id}`}
            className="flex-1 flex items-center justify-end text-right gap-4 p-6 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div>
              <div className="text-xs font-mono text-gray-500 uppercase mb-1">Up Next</div>
              <div className="font-bold text-gray-900 group-hover:text-primary">{next.lesson.title}</div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary" />
          </Link>
        ) : (
          <div className="flex-1 flex items-center justify-end text-right gap-4 p-6 rounded-lg bg-gray-50 border border-gray-200">
            <div>
              <div className="text-xs font-mono text-gray-500 uppercase mb-1">Course Complete</div>
              <div className="font-bold text-gray-900">You've finished all available lessons!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
