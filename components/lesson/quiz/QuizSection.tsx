'use client';

import { useState } from 'react';
import { QuizQuestion } from '@/lib/types';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function QuizSection({ questions }: { questions: QuizQuestion[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  const question = questions[currentIdx];
  const isDone = currentIdx >= questions.length;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === question.correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setSubmitted(false);
    setSelected(null);
    setCurrentIdx(i => i + 1);
  };

  if (isDone) {
    return (
      <div className="my-12 p-8 border border-gray-200 rounded-lg bg-white text-center max-w-2xl mx-auto shadow-sm">
        <h3 className="text-3xl font-bold uppercase text-primary mb-4">Quiz Complete</h3>
        <div className="text-5xl font-mono mb-4 text-gray-900">
          {score} / {questions.length}
        </div>
        <p className="text-gray-600">
          {score === questions.length ? 'Perfect score! You are ready to move on.' : 'Review the concepts and try again if you missed any.'}
        </p>
      </div>
    );
  }

  const isCorrect = selected === question.correct;

  return (
    <div className="my-12 p-8 border border-gray-200 rounded-lg bg-white max-w-3xl mx-auto shadow-sm">
      <div className="text-sm font-mono text-gray-500 mb-4 uppercase tracking-wider">
        Question {currentIdx + 1} of {questions.length}
      </div>
      
      <h3 className="text-xl font-bold mb-6 text-gray-900">
        {question.question}
      </h3>
      
      <div className="space-y-3 mb-8">
        {question.options.map((opt, idx) => {
          let stateClass = 'border-gray-200 hover:border-primary hover:bg-primary/5';
          let indicator = null;

          if (submitted) {
             if (idx === question.correct) {
                stateClass = 'border-success-border bg-success-bg text-success-text font-medium';
                indicator = <CheckCircle2 className="w-5 h-5 text-success-border shrink-0" />;
             } else if (idx === selected) {
                stateClass = 'border-warning-border bg-warning-bg text-warning-text font-medium';
                indicator = <XCircle className="w-5 h-5 text-warning-border shrink-0" />;
             } else {
                stateClass = 'border-gray-100 opacity-50';
             }
          } else if (selected === idx) {
             stateClass = 'border-primary bg-primary text-white';
          }

          return (
            <button
              key={idx}
              onClick={() => !submitted && setSelected(idx)}
              disabled={submitted}
              className={`w-full text-left p-4 rounded-lg border transition-all flex justify-between items-center ${stateClass}`}
            >
              <span>{opt}</span>
              {indicator}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button 
          onClick={handleSubmit}
          disabled={selected === null}
          className="bg-primary text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-light transition-colors"
        >
          Check Answer
        </button>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-success-bg border-success-border text-success-text' : 'bg-warning-bg border-warning-border text-warning-text'}`}>
             <p className="font-medium mb-2">{isCorrect ? 'Correct!' : 'Incorrect.'}</p>
             <p className="text-sm">{question.explanation}</p>
             {question.hardwareExplanation && (
               <div className="mt-3 text-sm border-t border-current pt-3 opacity-90">
                 <strong className="font-mono">Hardware Context:</strong> {question.hardwareExplanation}
               </div>
             )}
          </div>
          
          <button 
            onClick={handleNext}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
          >
            {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
}
