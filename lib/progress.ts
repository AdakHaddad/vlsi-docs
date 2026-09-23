'use client'

import { useEffect, useState, useCallback } from 'react'
import type { ProgressState, LessonProgress, TopicMastery } from './types'

const STORAGE_KEY = 'rtl-mentor-progress'

const defaultProgress = (): ProgressState => ({
  lessons: {},
  topicMastery: {},
  weaknesses: [],
  streakDays: 0,
  totalMinutes: 0,
})

function load(): ProgressState {
  if (typeof window === 'undefined') return defaultProgress()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress()
    return JSON.parse(raw)
  } catch {
    return defaultProgress()
  }
}

function save(state: ProgressState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(defaultProgress)

  useEffect(() => {
    setProgress(load())
  }, [])

  const updateLesson = useCallback((lessonId: string, update: Partial<LessonProgress>) => {
    setProgress(prev => {
      const existing = prev.lessons[lessonId] ?? {
        lessonId,
        completed: false,
        attempts: 0,
      }
      const next: ProgressState = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [lessonId]: { ...existing, ...update, lastAttemptAt: new Date().toISOString() },
        },
      }
      save(next)
      return next
    })
  }, [])

  const markCompleted = useCallback((lessonId: string, quizScore?: number, labPassed?: boolean) => {
    setProgress(prev => {
      const existing = prev.lessons[lessonId]
      const next: ProgressState = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [lessonId]: {
            lessonId,
            completed: true,
            quizScore,
            labPassed,
            attempts: (existing?.attempts ?? 0) + 1,
            lastAttemptAt: new Date().toISOString(),
          },
        },
      }
      save(next)
      return next
    })
  }, [])

  const updateMastery = useCallback((topic: string, score: number, lessonsCompleted: number, lessonsTotal: number) => {
    setProgress(prev => {
      const next: ProgressState = {
        ...prev,
        topicMastery: {
          ...prev.topicMastery,
          [topic]: { topic, score, lessonsCompleted, lessonsTotal },
        },
      }
      save(next)
      return next
    })
  }, [])

  const addWeakness = useCallback((topic: string) => {
    setProgress(prev => {
      if (prev.weaknesses.includes(topic)) return prev
      const next: ProgressState = {
        ...prev,
        weaknesses: [...prev.weaknesses, topic],
      }
      save(next)
      return next
    })
  }, [])

  const removeWeakness = useCallback((topic: string) => {
    setProgress(prev => {
      const next: ProgressState = {
        ...prev,
        weaknesses: prev.weaknesses.filter(w => w !== topic),
      }
      save(next)
      return next
    })
  }, [])

  const isLessonCompleted = useCallback(
    (lessonId: string) => progress.lessons[lessonId]?.completed ?? false,
    [progress.lessons],
  )

  const getLessonProgress = useCallback(
    (lessonId: string): LessonProgress | undefined => progress.lessons[lessonId],
    [progress.lessons],
  )

  const resetAll = useCallback(() => {
    const fresh = defaultProgress()
    save(fresh)
    setProgress(fresh)
  }, [])

  return {
    progress,
    updateLesson,
    markCompleted,
    updateMastery,
    addWeakness,
    removeWeakness,
    isLessonCompleted,
    getLessonProgress,
    resetAll,
  }
}

// ── Pure helpers (usable server-side or without hook) ─────────────────────────

export function computeChapterProgress(
  lessons: { id: string }[],
  progressLessons: Record<string, LessonProgress>,
): number {
  if (lessons.length === 0) return 0
  const completed = lessons.filter(l => progressLessons[l.id]?.completed).length
  return Math.round((completed / lessons.length) * 100)
}
