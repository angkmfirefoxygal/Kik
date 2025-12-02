interface FeedbackItem {
  category: string;
  score: number;
  comment: string;
}

interface FeedbackPanelProps {
  feedback: FeedbackItem[] | null;
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
      <h3 className="text-xl font-bold mb-4">평가 결과</h3>
      <div className="space-y-4">
        {feedback.map((item, index) => (
          <div key={index} className="border-b pb-4 last:border-b-0">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">{item.category}</span>
              <span className="text-lg font-bold text-blue-600">{item.score}/5</span>
            </div>
            <p className="text-gray-600 text-sm">{item.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
