import { useState } from 'react';
import ProblemView from './components/ProblemView';
import AnswerEditor from './components/AnswerEditor';
import FeedbackPanel from './components/FeedbackPanel';
import SatisfactionToggle from './components/SatisfactionToggle';

// 샘플 문제 데이터
const SAMPLE_PROBLEM = {
  number: 'TOPIK II 쓰기 54번',
  text: `다음을 주제로 하여 자신의 생각을 600~700자로 글을 쓰십시오. 단, 문제를 그대로 옮겨 쓰지 마십시오.

최근 식당이나 병원, 은행에서도 디지털 기기를 사용하고 있습니다. 그런데 디지털 기기에서 소외되는 사람이 있습니다. 아래의 내용을 중심으로 ‘디지털 소외 문제와 해결 방안’에 대해 자신의 생각을 쓰십시오.

1. 디지털 기술을 어떻게 활용하고 있는가?
2. 디지털 소외되는 사람은 누구인가? 왜 소외되는가?
3. 디지털 소외 문제를 해결하기 위해 개인과 사회는 어떻게 해야 하는가?`,
  minLength: 600,
  maxLength: 700,
};

interface FeedbackItem {
  category: string;
  score: number;
  comment: string;
}

function App() {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<FeedbackItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetFeedback = async () => {
    if (answer.trim().length === 0) {
      alert('답안을 작성해 주세요.');
      return;
    }

    setIsLoading(true);

    // TODO: 실제 API 호출로 대체 필요
    // 현재는 샘플 피드백 데이터 사용
    setTimeout(() => {
      const sampleFeedback: FeedbackItem[] = [
        {
          category: '내용',
          score: 3,
          comment: '과제는 수행했지만 예시가 부족합니다.',
        },
        {
          category: '구조',
          score: 2,
          comment: '도입과 결론이 약하고, 본론이 한쪽 주장에만 치우쳐 있습니다.',
        },
        {
          category: '문법/어휘',
          score: 4,
          comment: '전반적으로 좋지만 조사 실수가 몇 군데 보입니다.',
        },
        {
          category: '표현/연결성',
          score: 3,
          comment: '그러나/반면에 등 연결어를 좀 더 다양하게 써보면 좋겠습니다.',
        },
      ];
      setFeedback(sampleFeedback);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            TOPIK 쓰기 연습 + AI 피드백 (MVP)
          </h1>
          <p className="text-gray-600">
            한국어능력시험 쓰기 영역 실전 연습과 즉각적인 피드백을 받아보세요
          </p>
        </header>

        <ProblemView
          problemNumber={SAMPLE_PROBLEM.number}
          problemText={SAMPLE_PROBLEM.text}
          recommendedLength={`${SAMPLE_PROBLEM.minLength}~${SAMPLE_PROBLEM.maxLength}자`}
        />

        <AnswerEditor
          value={answer}
          onChange={setAnswer}
          minLength={SAMPLE_PROBLEM.minLength}
          maxLength={SAMPLE_PROBLEM.maxLength}
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
