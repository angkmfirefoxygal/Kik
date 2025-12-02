import { useState } from 'react';
import ProblemView from './components/ProblemView';
import AnswerEditor from './components/AnswerEditor';
import FeedbackPanel from './components/FeedbackPanel';
import SatisfactionToggle from './components/SatisfactionToggle';
import { getFeedback, generateProblem } from './services/openai';
import type { TOPIKFeedback, TOPIKProblem } from './services/openai';

// 샘플 문제 데이터 (기본 문제)
const SAMPLE_PROBLEM = {
  number: 'TOPIK II 쓰기 54번',
  text: `다음을 주제로 하여 자신의 생각을 600~700자로 글을 쓰십시오. 단, 문제를 그대로 옮겨 쓰지 마십시오.

최근 식당이나 병원, 은행에서도 디지털 기기를 사용하고 있습니다. 그런데 디지털 기기에서 소외되는 사람이 있습니다. 아래의 내용을 중심으로 '디지털 소외 문제와 해결 방안'에 대해 자신의 생각을 쓰십시오.

1. 디지털 기술을 어떻게 활용하고 있는가?
2. 디지털 소외되는 사람은 누구인가? 왜 소외되는가?
3. 디지털 소외 문제를 해결하기 위해 개인과 사회는 어떻게 해야 하는가?`,
  minLength: 600,
  maxLength: 700,
};

function App() {
  const [problem, setProblem] = useState<TOPIKProblem>(SAMPLE_PROBLEM);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<TOPIKFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingProblem, setIsGeneratingProblem] = useState(false);

  const handleGenerateNewProblem = async () => {
    setIsGeneratingProblem(true);
    setAnswer(''); // 답안 초기화
    setFeedback(null); // 피드백 초기화

    try {
      const newProblem = await generateProblem();
      setProblem(newProblem);
      console.log('✅ 새 문제 로드 완료');
    } catch (error) {
      console.error('문제 생성 오류:', error);
      alert('문제 생성 중 오류가 발생했습니다. 기본 문제를 사용합니다.');
      setProblem(SAMPLE_PROBLEM);
    } finally {
      setIsGeneratingProblem(false);
    }
  };

  const handleGetFeedback = async () => {
    if (answer.trim().length === 0) {
      alert('답안을 작성해 주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await getFeedback(problem.text, answer);
      setFeedback(result);
    } catch (error) {
      console.error('피드백 생성 오류:', error);
      alert('피드백 생성 중 오류가 발생했습니다. API 키를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            TOPIK 쓰기 연습 + AI 피드백
          </h1>
          <p className="text-gray-600">
            한국어능력시험 쓰기 영역 실전 연습과 즉각적인 피드백을 받아보세요
          </p>
        </header>

        {/* New Problem Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleGenerateNewProblem}
            disabled={isGeneratingProblem || isLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            {isGeneratingProblem ? '새 문제 생성 중...' : '🎯 새 문제 생성'}
          </button>
        </div>

        <ProblemView
          problemNumber={problem.number}
          problemText={problem.text}
          recommendedLength={`${problem.minLength}~${problem.maxLength}자`}
        />

        <AnswerEditor
          value={answer}
          onChange={setAnswer}
          minLength={problem.minLength}
          maxLength={problem.maxLength}
        />

        <div className="mb-6">
          <button
            onClick={handleGetFeedback}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {isLoading ? '피드백 생성 중...' : '피드백 받기'}
          </button>
        </div>

        <FeedbackPanel feedback={feedback} isLoading={isLoading} />

        {feedback && <SatisfactionToggle />}
      </div>
    </div>
  );
}

export default App;
