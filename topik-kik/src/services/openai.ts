import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // 주의: 프로덕션에서는 백엔드에서 API 호출해야 함
});

export interface CategoryFeedback {
  score: number;
  comment_korean: string;
  comment_english: string;
}

export interface TOPIKFeedback {
  overall_score: number; // 0-50
  estimated_level: string; // TOPIK 급수
  task_performance: CategoryFeedback; // 0-15
  organization: CategoryFeedback; // 0-15
  grammar_vocabulary: CategoryFeedback; // 0-10
  style_expression: CategoryFeedback; // 0-10
  strengths_korean: string;
  strengths_english: string;
  weaknesses_korean: string;
  weaknesses_english: string;
  specific_improvements_korean: string;
  specific_improvements_english: string;
}

export interface TOPIKProblem {
  number: string;
  text: string;
  minLength: number;
  maxLength: number;
}

export async function getFeedback(
  problemText: string,
  answer: string
): Promise<TOPIKFeedback> {
  console.log('📝 OpenAI API 호출 시작...');
  console.log('답안 길이:', answer.length, '자');

  const prompt = `You are a TOPIK II Writing Evaluator specializing in essay scoring (Question 54).

**Instructions:**
You will receive:
1. A TOPIK 54 essay prompt (the topic/question)
2. A student's Korean essay response (600-700 characters target)

Your task: Evaluate the essay based on TOPIK official scoring rubrics.

**Scoring Criteria (Total: 50 points):**
1. Task Performance (0-15 points)
   - Did the student address ALL required points in the prompt?
   - How thoroughly are they answered?
   - Score: 15=fully addressed, 10=mostly addressed, 5=partially, 0=not addressed

2. Organization & Development (0-15 points)
   - Clear structure (introduction-body-conclusion)?
   - Logical flow between paragraphs?
   - Proper paragraph separation?
   - Score: 15=excellent, 10=good, 5=fair, 0=poor

3. Grammar & Vocabulary (0-10 points)
   - Grammar accuracy and variety?
   - Advanced vocabulary usage?
   - Appropriate word choice?
   - Score: 10=excellent, 6-7=good, 3-4=fair, 0-1=poor

4. Style & Expression (0-10 points)
   - Use of connectors (그러나, 따라서, 반면에 etc.)?
   - Consistent formal register?
   - Natural-sounding sentences?
   - Score: 10=excellent, 6-7=good, 3-4=fair, 0-1=poor

**Output Format (JSON only, no other text):**
{
  "overall_score": [integer 0-50],
  "estimated_level": "[TOPIK level: 1급/2급/3급/4급/5급/6급]",
  "task_performance": {
    "score": [0-15],
    "comment_korean": "[구체적 피드백 - 한국어]",
    "comment_english": "[Specific feedback - English]"
  },
  "organization": {
    "score": [0-15],
    "comment_korean": "[구체적 피드백 - 한국어]",
    "comment_english": "[Specific feedback - English]"
  },
  "grammar_vocabulary": {
    "score": [0-10],
    "comment_korean": "[구체적 피드백 - 한국어]",
    "comment_english": "[Specific feedback - English]"
  },
  "style_expression": {
    "score": [0-10],
    "comment_korean": "[구체적 피드백 - 한국어]",
    "comment_english": "[Specific feedback - English]"
  },
  "strengths_korean": "[장점 - 한국어]",
  "strengths_english": "[Strengths - English]",
  "weaknesses_korean": "[약점 - 한국어]",
  "weaknesses_english": "[Weaknesses - English]",
  "specific_improvements_korean": "[구체적 개선 방안 - 한국어]",
  "specific_improvements_english": "[Specific improvements - English]"
}

---

**NOW EVALUATE:**

**Prompt (TOPIK 54 Question):**
${problemText}

**Student's Essay:**
${answer}`;

  try {
    const startTime = Date.now();
    console.log('⏳ OpenAI API 요청 중...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a TOPIK II Writing Evaluator. Evaluate essays based on official TOPIK scoring rubrics with accuracy and constructive feedback.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent scoring
      response_format: { type: 'json_object' },
    });

    const endTime = Date.now();
    console.log(`✅ OpenAI API 응답 완료 (${endTime - startTime}ms)`);

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // JSON 파싱 시도
    try {
      console.log('🔍 응답 파싱 중...');
      const parsed = JSON.parse(content) as TOPIKFeedback;
      console.log('📦 파싱된 응답:', parsed);

      // 필수 필드 검증
      if (
        typeof parsed.overall_score !== 'number' ||
        !parsed.task_performance ||
        !parsed.organization ||
        !parsed.grammar_vocabulary ||
        !parsed.style_expression
      ) {
        console.error('❌ 응답 필드가 누락되었습니다:', parsed);
        throw new Error('Invalid response format: missing required fields');
      }

      console.log(`✅ 총점: ${parsed.overall_score}/50 (예상 급수: ${parsed.estimated_level})`);
      return parsed;
    } catch (parseError) {
      console.error('❌ JSON 파싱 오류:', parseError);
      console.error('원본 응답:', content);
      throw new Error('Failed to parse OpenAI response');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

export async function generateProblem(): Promise<TOPIKProblem> {
  console.log('🎯 새 TOPIK 문제 생성 시작...');

  const prompt = `You are a TOPIK II Writing Question Generator specializing in Question 54 (essay).

**Task**: Create a new TOPIK 54-style essay prompt based on past TOPIK 54 patterns and current social issues in Korea/Global context.

**Past TOPIK 54 Pattern Analysis**:
Recent actual exam topics (2021-2024):
- 디지털 소외 (Digital Divide) - 2024 (93회)
- 조기 교육 (Early Education) - 2023 (91회)
- 정보 공유 (Information Sharing) - 2023 (87회)
- 창의력 (Creativity) - 2022 (83회)
- 인간관계와 적당한 거리 (Human Relationships & Distance) - 2022 (81회)
- 칭찬의 효과 (Praise) - 2021 (78회)
- 소비의 목적 (Consumption) - 2021 (75회)

Common structure:
1. Title/theme (10-15 words in Korean)
2. Background description (2-3 sentences explaining the phenomenon)
3. Three specific sub-questions:
   a. How is this phenomenon being used/applied? (현황/활용)
   b. Who are the people affected (positively/negatively) and why? (영향/문제점)
   c. What should individuals and society do to address the issues? (해결방안)

**New Question Requirements**:
- Topic must be a **current social/cultural issue** (2023-2025 trend)
- Must follow the exact TOPIK 54 format (Korean)
- Word count target: 600-700 characters for answer
- Must be suitable for TOPIK II Level 3-6 test takers
- Should be about social/technological/cultural change with clear pros/cons

**Diverse Topic Pool** (randomly choose ONE - ensure variety):
1. AI와 일상생활 (AI in Daily Life - ChatGPT, 생성형 AI)
2. 환경 보호와 개인의 실천 (Climate Action & Individual Practice)
3. 1인 가구 증가와 사회 변화 (Single-person Households)
4. 재택근무와 일의 변화 (Remote Work Culture)
5. 배달 문화와 소비 습관 (Delivery Culture & Consumption)
6. SNS와 인간관계 (Social Media & Relationships)
7. 직업의 변화와 평생 교육 (Career Changes & Lifelong Learning)
8. 정신 건강과 사회적 인식 (Mental Health Awareness)
9. 공유 경제 (Sharing Economy - 카셰어링, 공유 오피스)
10. 온라인 교육의 확대 (Online Education Expansion)
11. 고령화 사회와 세대 통합 (Aging Society & Generational Integration)
12. 친환경 소비 (Eco-friendly Consumption)

**IMPORTANT**:
- Pick a DIFFERENT topic each time to ensure variety
- Make the question feel authentic and exam-like
- Use natural Korean expressions suitable for TOPIK level

**Output Format (JSON only):**
{
  "problem_text": "[Complete TOPIK 54 question in Korean, following exact format with intro + 3 sub-questions]"
}

**Example Reference** (Past TOPIK 54):
"최근 식당이나 병원, 은행에서도 디지털 기기를 사용하고 있습니다. 그런데 디지털 기기에서 소외되는 사람이 있습니다. 아래의 내용을 중심으로 '디지털 소외 문제와 해결 방안'에 대해 자신의 생각을 쓰십시오.

1. 디지털 기술을 어떻게 활용하고 있는가?
2. 디지털 소외되는 사람은 누구인가? 왜 소외되는가?
3. 디지털 소외 문제를 해결하기 위해 개인과 사회는 어떻게 해야 하는가?"

---

**NOW GENERATE A NEW TOPIK 54 QUESTION** (choose the most relevant current issue and create it in Korean):`;

  try {
    const startTime = Date.now();
    console.log('⏳ 문제 생성 API 요청 중...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a TOPIK II Question Generator. Create authentic TOPIK 54-style essay prompts about current social issues in Korean. Generate diverse topics each time - avoid repeating the same theme.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 1.0, // Higher temperature for maximum variety
      response_format: { type: 'json_object' },
    });

    const endTime = Date.now();
    console.log(`✅ 문제 생성 완료 (${endTime - startTime}ms)`);

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    try {
      console.log('🔍 문제 파싱 중...');
      const parsed = JSON.parse(content) as { problem_text: string };
      console.log('📦 생성된 문제:', parsed.problem_text.substring(0, 100) + '...');

      if (!parsed.problem_text) {
        throw new Error('Invalid response format: missing problem_text');
      }

      // Full problem text 앞에 TOPIK 지시문 추가
      const fullText = `다음을 주제로 하여 자신의 생각을 600~700자로 글을 쓰십시오. 단, 문제를 그대로 옮겨 쓰지 마십시오.

${parsed.problem_text}`;

      return {
        number: 'TOPIK II 쓰기 54번',
        text: fullText,
        minLength: 600,
        maxLength: 700,
      };
    } catch (parseError) {
      console.error('❌ JSON 파싱 오류:', parseError);
      console.error('원본 응답:', content);
      throw new Error('Failed to parse OpenAI response');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}
