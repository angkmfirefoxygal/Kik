interface ProblemViewProps {
  problemNumber: string;
  problemText: string;
  recommendedLength: string;
}

export default function ProblemView({ problemNumber, problemText, recommendedLength }: ProblemViewProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">{problemNumber}</h2>
      <div className="mb-4 whitespace-pre-wrap text-gray-700">
        {problemText}
      </div>
      <p className="text-sm text-gray-600">
        권장 글자 수: {recommendedLength}
      </p>
    </div>
  );
}
