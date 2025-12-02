import type { TOPIKFeedback } from '../services/openai';

interface FeedbackPanelProps {
  feedback: TOPIKFeedback | null;
  isLoading: boolean;
}

export default function FeedbackPanel({ feedback, isLoading }: FeedbackPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-600">피드백을 생성하는 중...</div>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-gray-500 text-center py-8">
          아직 피드백이 없습니다. 답안을 작성하고 '피드백 받기'를 눌러주세요.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Overall Score Header */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800">평가 결과</h3>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{feedback.overall_score}/50</div>
            <div className="text-sm text-gray-600">예상 급수: {feedback.estimated_level}</div>
          </div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="space-y-4 mb-6">
        <div className="border-b pb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">내용 (Task Performance)</span>
            <span className="text-lg font-bold text-blue-600">{feedback.task_performance.score}/15</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">{feedback.task_performance.comment_korean}</p>
          <p className="text-gray-500 text-xs italic">{feedback.task_performance.comment_english}</p>
        </div>

        <div className="border-b pb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">구성 (Organization)</span>
            <span className="text-lg font-bold text-blue-600">{feedback.organization.score}/15</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">{feedback.organization.comment_korean}</p>
          <p className="text-gray-500 text-xs italic">{feedback.organization.comment_english}</p>
        </div>

        <div className="border-b pb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">문법/어휘 (Grammar & Vocabulary)</span>
            <span className="text-lg font-bold text-blue-600">{feedback.grammar_vocabulary.score}/10</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">{feedback.grammar_vocabulary.comment_korean}</p>
          <p className="text-gray-500 text-xs italic">{feedback.grammar_vocabulary.comment_english}</p>
        </div>

        <div className="border-b pb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">표현/연결성 (Style & Expression)</span>
            <span className="text-lg font-bold text-blue-600">{feedback.style_expression.score}/10</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">{feedback.style_expression.comment_korean}</p>
          <p className="text-gray-500 text-xs italic">{feedback.style_expression.comment_english}</p>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">장점 (Strengths)</h4>
          <p className="text-sm text-gray-700 mb-2">{feedback.strengths_korean}</p>
          <p className="text-xs text-gray-600 italic">{feedback.strengths_english}</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <h4 className="font-semibold text-orange-800 mb-2">약점 (Weaknesses)</h4>
          <p className="text-sm text-gray-700 mb-2">{feedback.weaknesses_korean}</p>
          <p className="text-xs text-gray-600 italic">{feedback.weaknesses_english}</p>
        </div>
      </div>

      {/* Specific Improvements */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h4 className="font-semibold text-purple-800 mb-2">개선 방안 (Specific Improvements)</h4>
        <p className="text-sm text-gray-700 mb-2">{feedback.specific_improvements_korean}</p>
        <p className="text-xs text-gray-600 italic">{feedback.specific_improvements_english}</p>
      </div>
    </div>
  );
}
