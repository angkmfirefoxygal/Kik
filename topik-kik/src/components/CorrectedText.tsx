import type { CorrectedSentence } from '../services/openai';

interface CorrectedTextProps {
  correctedSentences: CorrectedSentence[];
}

export default function CorrectedText({ correctedSentences }: CorrectedTextProps) {
  if (!correctedSentences || correctedSentences.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">첨삭 피드백</h3>
        <div className="text-gray-500 text-center py-4">
          첨삭이 필요한 문장이 없습니다. 훌륭한 작성입니다!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">첨삭 피드백</h3>
      <p className="text-sm text-gray-600 mb-4">
        개선이 필요한 문장들을 첨삭했습니다. 파란색으로 표시된 부분이 수정된 내용입니다.
      </p>

      <div className="space-y-4">
        {correctedSentences.map((sentence, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
            {/* Original Sentence */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-500 mb-1">원본</div>
              <div className="text-gray-700 line-through decoration-red-400 decoration-2">
                {sentence.original}
              </div>
            </div>

            {/* Corrected Sentence */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-blue-600 mb-1">첨삭</div>
              <div className="text-gray-900 font-medium">
                {highlightDifferences(sentence.original, sentence.corrected)}
              </div>
            </div>

            {/* Reason */}
            <div className="mt-3 pt-3 border-t border-blue-200">
              <div className="text-xs font-semibold text-gray-500 mb-1">수정 이유</div>
              <div className="text-sm text-gray-700 mb-1">{sentence.reason_korean}</div>
              <div className="text-xs text-gray-500 italic">{sentence.reason_english}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function highlightDifferences(original: string, corrected: string): React.ReactNode {
  // 간단한 차이 강조 로직
  // 원본과 첨삭본이 완전히 다른 경우 전체를 파란색으로 표시
  if (original === corrected) {
    return <span>{corrected}</span>;
  }

  // 단어 단위로 비교하여 다른 부분 강조
  const originalWords = original.split(' ');
  const correctedWords = corrected.split(' ');

  // 간단한 구현: 길이가 다르거나 많은 부분이 다르면 전체를 강조
  const differenceRatio = Math.abs(originalWords.length - correctedWords.length) / Math.max(originalWords.length, correctedWords.length);

  if (differenceRatio > 0.3 || correctedWords.length > originalWords.length * 1.5) {
    // 많은 부분이 변경된 경우 전체를 파란색으로 표시
    return <span className="text-blue-600 font-semibold">{corrected}</span>;
  }

  // 단어별로 비교하여 다른 부분만 강조
  return (
    <span>
      {correctedWords.map((word, index) => {
        const isDifferent = !originalWords.includes(word) || index >= originalWords.length || originalWords[index] !== word;
        return (
          <span
            key={index}
            className={isDifferent ? 'text-blue-600 font-semibold border-b-2 border-blue-400' : ''}
          >
            {word}
            {index < correctedWords.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </span>
  );
}
