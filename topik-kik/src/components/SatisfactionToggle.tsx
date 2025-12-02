import { useState } from 'react';

export default function SatisfactionToggle() {
  const [satisfaction, setSatisfaction] = useState<boolean | null>(null);

  const handleClick = (value: boolean) => {
    setSatisfaction(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-gray-700 mb-4">이 피드백이 도움이 되었나요?</p>
      <div className="flex gap-4">
        <button
          onClick={() => handleClick(true)}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            satisfaction === true
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          예
        </button>
        <button
          onClick={() => handleClick(false)}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            satisfaction === false
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          아니오
        </button>
      </div>
      {satisfaction !== null && (
        <p className="mt-4 text-sm text-gray-600">
          소중한 의견 감사합니다.
        </p>
      )}
    </div>
  );
}
