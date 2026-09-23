import { getLesson, getChapter } from '@/lib/curriculum';
import { notFound } from 'next/navigation';
import LessonClient from './LessonClient';

export default async function LessonPage({
  params,
}: {
  params: Promise<{ chapterId: string; lessonId: string }>
}) {
  const { chapterId, lessonId } = await params;
  const lesson = getLesson(chapterId, lessonId);
  const chapter = getChapter(chapterId);

  if (!lesson || !chapter) {
    notFound();
  }

  return <LessonClient lesson={lesson} chapterId={chapterId} />;
}
