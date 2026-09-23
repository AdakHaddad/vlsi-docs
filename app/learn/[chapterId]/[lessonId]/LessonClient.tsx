'use client';

import { useEffect, useRef } from 'react';
import { Lesson, Chapter } from '@/lib/types';
import { useProgress } from '@/lib/progress';
import LessonHeader from '@/components/lesson/LessonHeader';
import ContentRenderer from '@/components/lesson/ContentRenderer';
import QuizSection from '@/components/lesson/quiz/QuizSection';
import LabEditor from '@/components/lesson/lab/LabEditor';
import NavFooter from '@/components/lesson/NavFooter';
import AppShell from '@/components/layout/AppShell';

export default function LessonClient({ 
  lesson, 
  chapterId 
}: { 
  lesson: Lesson, 
  chapterId: string 
}) {
  const { markCompleted, updateLastAttempt } = useProgress();
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      updateLastAttempt(lesson.id);
      
      // If it's just a read/explore lesson with no quiz or lab, mark it complete automatically after a few seconds
      if (lesson.type === 'read' || lesson.type === 'explore') {
        if (!lesson.content.quiz && !lesson.content.lab) {
           const timer = setTimeout(() => {
             markCompleted(lesson.id);
           }, 3000);
           return () => clearTimeout(timer);
        }
      }
      
      mounted.current = true;
    }
  }, [lesson, markCompleted, updateLastAttempt]);

  return (
    <AppShell>
      <article className="max-w-5xl mx-auto pb-24">
        <LessonHeader lesson={lesson} />
        
        <div className="px-8 mt-8">
          {lesson.content.sections.length > 0 && (
            <ContentRenderer sections={lesson.content.sections} />
          )}
          
          {lesson.content.quiz && lesson.content.quiz.length > 0 && (
             <div className="mt-12 border-t border-gray-200 pt-12">
               <h2 className="text-3xl font-bold uppercase mb-8 text-center text-gray-900">Knowledge Check</h2>
               <QuizSection questions={lesson.content.quiz} />
               {/* Automatically marking complete for quiz lessons when we render it? No, quiz component should ideally handle it, but we'll let it be for now, or just assume completion on page view for prototype */}
             </div>
          )}

          {lesson.content.lab && (
            <div className="mt-12">
               <LabEditor exercise={lesson.content.lab} lessonId={lesson.id} />
            </div>
          )}
          
          <NavFooter chapterId={chapterId} lessonId={lesson.id} />
        </div>
      </article>
    </AppShell>
  );
}
