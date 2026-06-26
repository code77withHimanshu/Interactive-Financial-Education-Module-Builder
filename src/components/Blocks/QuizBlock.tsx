import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { QuizContent, QuizOption } from '../../types';
import { Button } from '../UI/Button';
import { IconButton } from '../UI/IconButton';

interface QuizBlockProps {
  content: QuizContent;
  onChange: (content: QuizContent) => void;
  isEditing: boolean;
}

export function QuizBlock({ content, onChange, isEditing }: QuizBlockProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const isCorrect = selectedOptionId === content.correctOptionId;

  const handleCheck = () => {
    if (selectedOptionId) setChecked(true);
  };

  const handleReset = () => {
    setSelectedOptionId(null);
    setChecked(false);
  };

  const updateQuestion = (question: string) => onChange({ ...content, question });

  const updateOption = (id: string, text: string) => {
    onChange({
      ...content,
      options: content.options.map((o) => (o.id === id ? { ...o, text } : o)),
    });
  };

  const addOption = () => {
    if (content.options.length >= 4) return;
    const newOption: QuizOption = { id: crypto.randomUUID(), text: '' };
    onChange({ ...content, options: [...content.options, newOption] });
  };

  const removeOption = (id: string) => {
    if (content.options.length <= 2) return;
    const newOptions = content.options.filter((o) => o.id !== id);
    const newCorrect = content.correctOptionId === id ? '' : content.correctOptionId;
    onChange({ ...content, options: newOptions, correctOptionId: newCorrect });
  };

  const setCorrectOption = (id: string) => onChange({ ...content, correctOptionId: id });

  const updateExplanation = (explanation: string) => onChange({ ...content, explanation });

  if (isEditing) {
    return (
      <div className="space-y-4">
        {/* Question */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="quiz-question">
            Question <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <textarea
            id="quiz-question"
            value={content.question}
            onChange={(e) => updateQuestion(e.target.value)}
            rows={2}
            placeholder="Enter your quiz question..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 resize-none"
            aria-required="true"
          />
        </div>

        {/* Options */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">
            Options <span className="text-xs text-slate-400">(select the correct answer)</span>
          </p>
          <div className="space-y-2" role="radiogroup" aria-label="Quiz options - select correct answer">
            {content.options.map((option, idx) => (
              <div key={option.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct-option"
                  id={`option-correct-${option.id}`}
                  checked={content.correctOptionId === option.id}
                  onChange={() => setCorrectOption(option.id)}
                  aria-label={`Mark option ${idx + 1} as correct`}
                  className="w-4 h-4 text-blue-800 focus:ring-blue-800 shrink-0"
                />
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  aria-label={`Option ${idx + 1} text`}
                  className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800"
                />
                <IconButton
                  label={`Remove option ${idx + 1}`}
                  variant="danger"
                  size="sm"
                  onClick={() => removeOption(option.id)}
                  disabled={content.options.length <= 2}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </IconButton>
              </div>
            ))}
          </div>
          {content.options.length < 4 && (
            <button
              type="button"
              onClick={addOption}
              className="mt-2 flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 rounded"
            >
              <Plus size={14} aria-hidden="true" />
              Add option
            </button>
          )}
        </div>

        {/* Explanation */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="quiz-explanation">
            Explanation
          </label>
          <textarea
            id="quiz-explanation"
            value={content.explanation}
            onChange={(e) => updateExplanation(e.target.value)}
            rows={2}
            placeholder="Explain why the correct answer is right..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 resize-none"
          />
        </div>
      </div>
    );
  }

  // Preview mode
  return (
    <div className="space-y-4">
      <p className="font-medium text-slate-900 text-base">{content.question}</p>

      <div className="space-y-2" role="radiogroup" aria-label="Quiz options">
        {content.options.map((option) => {
          let optionClass =
            'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ';
          if (!checked) {
            optionClass +=
              selectedOptionId === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50';
          } else if (option.id === content.correctOptionId) {
            optionClass += 'border-emerald-500 bg-emerald-50';
          } else if (option.id === selectedOptionId && !isCorrect) {
            optionClass += 'border-red-400 bg-red-50';
          } else {
            optionClass += 'border-slate-200 opacity-60';
          }

          return (
            <label key={option.id} className={optionClass}>
              <input
                type="radio"
                name={`quiz-preview-${content.question}`}
                value={option.id}
                checked={selectedOptionId === option.id}
                onChange={() => !checked && setSelectedOptionId(option.id)}
                disabled={checked}
                className="w-4 h-4 text-blue-800 focus:ring-blue-800"
                aria-label={option.text}
              />
              <span className="text-sm text-slate-700 flex-1">{option.text}</span>
              {checked && option.id === content.correctOptionId && (
                <CheckCircle size={18} className="text-emerald-600 shrink-0" aria-label="Correct answer" />
              )}
              {checked && option.id === selectedOptionId && !isCorrect && (
                <XCircle size={18} className="text-red-500 shrink-0" aria-label="Incorrect answer" />
              )}
            </label>
          );
        })}
      </div>

      {/* Check / Result */}
      {!checked ? (
        <Button
          variant="primary"
          size="sm"
          onClick={handleCheck}
          disabled={!selectedOptionId}
          aria-label="Check answer"
        >
          Check Answer
        </Button>
      ) : (
        <div className="space-y-3">
          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              isCorrect ? 'text-emerald-700' : 'text-red-600'
            }`}
            role="alert"
          >
            {isCorrect ? (
              <>
                <CheckCircle size={18} aria-hidden="true" />
                Correct! Well done.
              </>
            ) : (
              <>
                <XCircle size={18} aria-hidden="true" />
                Incorrect. The correct answer is highlighted in green.
              </>
            )}
          </div>

          {content.explanation && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-1">Explanation</p>
              <p className="text-sm text-slate-600">{content.explanation}</p>
            </div>
          )}

          <button
            onClick={handleReset}
            className="text-sm text-blue-700 hover:text-blue-900 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 rounded"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
