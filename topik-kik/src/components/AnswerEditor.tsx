import { useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';

interface AnswerEditorProps {
  value: string;
  onChange: (value: string) => void;
  minLength: number;
  maxLength: number;
}

export default function AnswerEditor({ value, onChange, minLength, maxLength }: AnswerEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentLength = value.length;

  const getCounterColor = () => {
    if (currentLength < minLength) return 'text-orange-500';
    if (currentLength > maxLength) return 'text-orange-500';
    return 'text-green-600';
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // textarea 높이 자동 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-2 flex justify-between items-center">
        <label className="text-lg font-semibold text-gray-700">
          답안 작성
        </label>
        <span className={`text-sm font-medium ${getCounterColor()}`}>
          현재 {currentLength}자 / 목표 {minLength}~{maxLength}자
        </span>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        className="w-full min-h-96 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
        placeholder="아래에 한국어로 답안을 작성해 주세요."
      />
    </div>
  );
}
