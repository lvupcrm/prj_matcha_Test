
import { GoogleGenAI, Type } from "@google/genai";
import {
  ProductInfo,
  DetailPageData,
  WellnessGoal,
  SectionType,
  FAQItem,
  GuideSectionData,
  ComparisonSectionData,
  DraftPageData,
  DraftSection
} from "../types";

const API_KEY = process.env.API_KEY || '';

// 제품 목적별 한글 라벨
const purposeLabels: Record<WellnessGoal, string> = {
  'weight-loss': '다이어트/체중감량',
  'muscle-gain': '근력증진',
  'body-correction': '체형교정',
  'mental-care': '멘탈케어/명상',
  'nutrition': '영양공급',
  'daily-life': '생활용품'
};

// 일반 제품용 시스템 지시사항
const getGeneralSystemInstruction = () => `
당신은 연 매출 100억 이상의 이커머스 브랜드를 컨설팅하는 대한민국 최고의 전환율 최적화(CRO) 전문가이자 전문 카피라이터입니다.
사용자가 제공한 정보를 바탕으로 고객의 지갑을 열게 만드는 '고관여 상세페이지'를 기획합니다.

핵심 원칙:
1. 특징(Feature)이 아닌 이득(Benefit)을 강조하세요. (예: "10,000mAh" -> "캠핑장에서 3일 밤낮 걱정 없는 자유")
2. 고객의 페인 포인트(Pain Point)를 집요하게 건드려 해결책으로 연결하세요.
3. 모바일 가독성을 위해 문장은 짧고 강렬하게, 불렛포인트를 적극 활용하세요.

구성 단계 (필수 포함):
1. 후킹 헤드라인 (hero): 타겟의 고민 자극 또는 압도적 혜택 제시.
2. 공감 및 문제 제기 (problem): 현재 겪는 불편함을 생생하게 묘사.
3. 압도적 해결책 (solution): 특징을 고객의 언어로 변환하여 설명.
4. 신뢰 구축 (trust): 인증, 테스트 결과, 리뷰 텍스트 제안.
5. 거절할 수 없는 제안 (cta): 지금 구매해야 하는 강력한 이유.
`;

// 웰니스/피트니스 특화 시스템 지시사항 (5단계: HOOK → AGITATION → SOLUTION → TRUST → CTA)
const getWellnessSystemInstruction = () => `
당신은 대한민국 최고의 웰니스/피트니스 전문 카피라이터입니다.
10년간 헬스케어, 다이어트 보충제, 운동기구, 건강기능식품 브랜드에서 연 매출 100억 이상을 달성시킨 전환율 최적화(CRO) 전문가입니다.

당신의 역할은 고객의 '건강한 변화에 대한 열망'을 자극하여, 구매 결정을 이끌어내는 것입니다.

═══════════════════════════════════════════════════════════════
🎯 웰니스 카피라이팅 5단계 공식 (HASCT Framework)
═══════════════════════════════════════════════════════════════

【1단계 - HOOK (후킹)】 type: "hero"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
목적: 3초 안에 스크롤을 멈추게 만드는 강렬한 첫인상
기법:
- 고객이 꿈꾸는 '변화된 미래'를 한 문장으로 선언
- 감정을 자극하는 질문형 헤드라인 ("~하고 싶으신가요?", "왜 ~는 실패할까요?")
- 구체적 숫자로 신뢰도 상승 ("4주 만에", "하루 5분으로")
예시: "매일 아침, 거울 속 달라진 나를 만나세요"

【2단계 - AGITATION (고통 자극)】 type: "problem"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
목적: 고객의 Pain Point를 깊게 건드려 '지금 해결해야 한다'는 긴박감 유발
기법:
- 고객이 겪는 장애물과 좌절감을 생생하게 묘사
- "~해서 포기하셨나요?", "~때문에 힘드셨죠?" 형식 활용
- 방치했을 때의 부정적 결과 암시 (하지만 과장 금지)
- 감정적 공감 → 고객이 "내 얘기다!"라고 느끼게
예시: "운동할 시간이 없어서... 맛없는 건강식에 지쳐서... 효과가 안 보여서 포기하셨나요?"

【3단계 - SOLUTION (해결책 제시)】 type: "solution"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
목적: 이 제품만의 차별화된 해결 방식을 명확히 전달
기법:
- 핵심 기술/성분의 '작동 원리'를 쉽게 설명
- Feature → Benefit 변환 (기술 → 고객이 얻는 가치)
- "그래서 당신은 ~할 수 있습니다" 형식으로 결론
- 경쟁 제품 대비 차별점 강조
예시: "흡수율 3배 높인 저분자 공법으로, 하루 한 포로 충분합니다"

【4단계 - TRUST (신뢰 구축)】 type: "trust"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
목적: 과학적 근거와 사회적 증거로 의심 제거
기법:
- 임상시험 결과, 인체적용시험 데이터 제시
- 전문가 추천/설계 정보 (물리치료사, 영양사, 트레이너)
- 인증/특허 정보 (식약처 인증, IFOS 인증, 특허 기술)
- 고객 만족도 수치 ("98% 만족", "재구매율 87%")
- Before/After 개념의 변화 데이터
예시: "인체적용시험 결과: 4주 섭취 후 체지방률 5.2% 감소 확인"

【5단계 - CTA (행동 촉구)】 type: "cta"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
목적: 지금 당장 구매해야 하는 이유 제시
기법:
- 긴급성 부여 ("지금 시작하면", "오늘 주문 시")
- 리스크 제거 ("100% 환불 보장", "무료 체험")
- 변화된 미래 다시 한번 상기
- 간단한 첫 걸음 제안 ("지금 버튼을 누르세요")
예시: "3개월 후, 달라진 당신을 만나보세요. 지금 시작하세요."

═══════════════════════════════════════════════════════════════
⚠️ 웰니스 카피라이팅 필수 준수사항
═══════════════════════════════════════════════════════════════
1. 의약품 오인 표현 금지: "치료", "완치", "질병 예방" 등 사용 불가
2. 과장 광고 금지: 입증 가능한 효과만 언급
3. 건강기능식품 광고 가이드라인 준수
4. 모바일 가독성: 짧은 문장, 불렛포인트 적극 활용
5. 감정 + 논리 밸런스: 공감으로 시작해서 데이터로 설득
`;

// 일반 제품용 프롬프트 생성
const getGeneralPrompt = (info: ProductInfo) => `
상품명: ${info.name}
카테고리: ${info.category}
주요 특장점: ${info.features}
타겟 고객: ${info.targetAudience}
원하는 톤: ${info.tone}

위 정보를 바탕으로 상세페이지 기획안을 JSON 형태로 작성하세요.
각 섹션의 'imagePrompt'는 해당 섹션의 분위기와 제품이 잘 어우러진 전문적인 스튜디오 촬영 환경을 묘사해야 합니다.
`;

// 생활용품 특화 시스템 지시사항
const getDailyLifeSystemInstruction = () => `
당신은 대한민국 최고의 생활용품/가전 전문 카피라이터입니다.
10년간 생활용품, 주방용품, 청소용품, 소형가전 브랜드에서 연 매출 100억 이상을 달성시킨 전환율 최적화(CRO) 전문가입니다.

당신의 역할은 고객의 '일상의 불편함 해결에 대한 욕구'를 자극하여, 구매 결정을 이끌어내는 것입니다.

═══════════════════════════════════════════════════════════════
🎯 생활용품 카피라이팅 5단계 공식 (HASCT Framework)
═══════════════════════════════════════════════════════════════

【1단계 - HOOK (후킹)】 type: "hero"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
목적: 3초 안에 스크롤을 멈추게 만드는 강렬한 첫인상
기법:
- 고객이 꿈꾸는 '편리해진 일상'을 한 문장으로 선언
- 시간 절약, 노력 절감을 구체적 숫자로 표현
- "이제 ~하지 마세요", "드디어 ~가 가능합니다" 형식
예시: "청소 시간, 절반으로 줄여드립니다"

【2단계 - AGITATION (불편함 자극)】 type: "problem"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
목적: 기존 제품의 불편함을 상기시켜 '더 나은 것'에 대한 갈망 유발
기법:
- 기존 제품 사용 시 겪는 불편함을 구체적으로 묘사
- "~할 때마다 짜증나지 않으셨나요?", "~때문에 힘드셨죠?" 형식
- 일상에서 반복되는 작은 스트레스 포인트 공략
예시: "무거운 청소기 때문에 손목이 아프셨나요? 구석구석 닿지 않아 답답하셨나요?"

【3단계 - SOLUTION (해결책 제시)】 type: "solution"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
목적: 이 제품만의 차별화된 기능과 편의성을 명확히 전달
기법:
- 핵심 기술/기능의 '작동 원리'를 쉽게 설명
- Feature → Benefit 변환 (기능 → 고객이 얻는 편의)
- "그래서 당신은 ~할 수 있습니다" 형식으로 결론
예시: "500g 초경량 설계로, 한 손으로도 쉽게 청소할 수 있습니다"

【4단계 - TRUST (신뢰 구축)】 type: "trust"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
목적: 품질과 안전성에 대한 신뢰 구축
기법:
- 인증 정보 (KC인증, ISO, CE 등)
- 내구성 테스트 결과, 품질 보증 기간
- 고객 만족도, 재구매율, 누적 판매량
- A/S 정책, 브랜드 신뢰도
예시: "KC 인증 완료, 3년 품질 보증, 누적 판매 10만대 돌파"

【5단계 - CTA (행동 촉구)】 type: "cta"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
목적: 지금 당장 구매해야 하는 이유 제시
기법:
- 한정 수량/기간 할인 언급
- 편리해진 일상의 모습 다시 한번 상기
- 간단한 첫 걸음 제안 ("지금 버튼을 누르세요")
예시: "더 편한 일상, 지금 시작하세요."

═══════════════════════════════════════════════════════════════
⚠️ 생활용품 카피라이팅 필수 준수사항
═══════════════════════════════════════════════════════════════
1. 실용성 강조: 일상에서의 실제 사용 편의 중심
2. 구체적 수치: 시간 절약, 무게, 크기 등 구체적 숫자 활용
3. 비교 우위: 기존 제품 대비 개선점 명확히
4. 모바일 가독성: 짧은 문장, 불렛포인트 적극 활용
5. 실생활 공감: 일상적인 상황과 불편함 연결
`;

// 제품 목적별 프롬프트 생성 (5섹션: HOOK, AGITATION, SOLUTION, TRUST, CTA)
const getProductPrompt = (info: ProductInfo) => {
  const data = info.wellnessData!;
  const purposeLabel = purposeLabels[data.goal];
  const isDailyLife = data.goal === 'daily-life';

  return `
═══════════════════════════════════════════════════════════════
📋 셀러 입력 데이터 (SellerInput)
═══════════════════════════════════════════════════════════════

【기본 정보】
• 상품명: ${info.name}
• 카테고리: ${info.category}
• 제품 목적: ${purposeLabel}
• 브랜드 톤앤매너: ${info.tone === 'professional' ? '전문적/신뢰감' : info.tone === 'friendly' ? '친근함/따뜻함' : info.tone === 'luxurious' ? '고급미/프리미엄' : '활발함/에너지'}

【1. ${isDailyLife ? '주요 효과 (Benefit)' : '목표 및 효능 (Goal & Benefit)'}】
• ${isDailyLife ? '사용자가 얻게 될 가장 큰 편의' : '사용자가 얻게 될 가장 큰 변화'}: ${data.biggestChange || '(미입력 - 목적에 맞게 창의적으로 작성)'}

【2. ${isDailyLife ? '기술력 (Technology)' : '전문가의 한마디 (Expertise)'}】
• ${isDailyLife ? '차별화된 기술/특장점' : '전문성 입증 정보'}: ${data.expertiseProof || '(미입력 - 일반적인 전문성 강조)'}
• 핵심 ${isDailyLife ? '기능/소재' : '성분/기술력'}: ${data.coreTechnology || '(미입력 - 제품 특성에 맞게 추론)'}

【3. ${isDailyLife ? '불편함 해결 (Problem Solving)' : '심리적 자극 (Motivation)'}】
• ${isDailyLife ? '기존 제품의 불편함' : '고객이 포기하게 만드는 장애물'}: ${data.customerObstacle || '(미입력 - 목적에 맞는 일반적 장애물 추론)'}
• 이 제품의 해결 방법: ${data.obstacleSolution || '(미입력 - 제품 특성에 맞게 추론)'}

【4. ${isDailyLife ? '신뢰 증거 (Trust)' : '시각적 증거 (Visual Proof)'}】
• ${isDailyLife ? '인증/수치 정보' : '데이터 기반 성과'}: ${data.dataProof || '(미입력 - 신뢰할 수 있는 일반적 수치 사용)'}

═══════════════════════════════════════════════════════════════
📝 출력 요청사항
═══════════════════════════════════════════════════════════════

위 셀러 입력 데이터를 바탕으로, HASCT Framework(5단계)에 따라
고전환율 ${isDailyLife ? '생활용품' : '웰니스'} 상세페이지를 기획해주세요.

📌 필수 출력 섹션 (정확히 5개):
1. type: "hero" - HOOK (후킹 헤드라인)
2. type: "problem" - AGITATION (${isDailyLife ? '불편함 자극' : '고통 자극/공감'})
3. type: "solution" - SOLUTION (해결책 제시)
4. type: "trust" - TRUST (신뢰 구축/${isDailyLife ? '품질 증거' : '데이터 증거'})
5. type: "cta" - CTA (행동 촉구)

📌 각 섹션별 작성 가이드:
- title: 해당 섹션의 핵심 메시지 (1-2문장)
- content: 본문 내용 (2-4문장, 감정적 공감 + 논리적 설득)
- subContent: 불렛포인트 3-5개 (구체적 혜택/증거)
- imagePrompt: ${isDailyLife ? '생활용품/실용적인' : '웰니스/피트니스'} 분위기의 이미지 묘사 (영문)

📌 이미지 프롬프트 작성 시 주의:
${isDailyLife ? `
- 깨끗하고 정돈된 생활 공간
- 제품 사용 장면 (실제 사용 환경)
- 밝고 현대적인 인테리어
- 편리함과 실용성이 느껴지는 구도
` : `
- 밝고 건강한 라이프스타일 이미지
- ${purposeLabel} 목적에 맞는 장면 묘사
- 깨끗하고 전문적인 스튜디오 환경
- 활력있고 긍정적인 분위기
`}

📌 브랜드 컬러 추천:
${isDailyLife ? `
- 생활용품: 블루/그레이 계열 (신뢰감, 깔끔함)
- 주방용품: 화이트/민트 계열 (청결함, 위생)
- 청소용품: 블루/그린 계열 (깨끗함, 상쾌함)
` : `
- ${purposeLabel} 목적에 맞는 색상 선정
- 다이어트: 그린/민트 계열
- 근력증진: 레드/오렌지 계열
- 체형교정: 블루/퍼플 계열
- 멘탈케어: 라벤더/소프트블루 계열
- 영양공급: 옐로우/오렌지 계열
`}
`;
};

export const generateDetailPageContent = async (info: ProductInfo): Promise<DetailPageData> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // 제품 목적에 따라 시스템 지시사항과 프롬프트 선택
  const isDailyLife = info.wellnessData?.goal === 'daily-life';
  const hasWellnessData = info.wellnessData !== undefined;

  let systemInstruction: string;
  let prompt: string;

  if (hasWellnessData) {
    // 웰니스 데이터가 있으면 목적에 따라 분기
    systemInstruction = isDailyLife ? getDailyLifeSystemInstruction() : getWellnessSystemInstruction();
    prompt = getProductPrompt(info);
  } else {
    // 웰니스 데이터가 없으면 일반 제품용 (하위 호환성)
    systemInstruction = getGeneralSystemInstruction();
    prompt = getGeneralPrompt(info);
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro-preview-06-05',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: {
                  type: Type.STRING,
                  description: "섹션 타입: hero(HOOK), problem(AGITATION), solution(SOLUTION), trust(TRUST), cta(CTA)"
                },
                title: {
                  type: Type.STRING,
                  description: "섹션 제목 - 핵심 메시지를 담은 1-2문장"
                },
                content: {
                  type: Type.STRING,
                  description: "본문 내용 - 감정적 공감과 논리적 설득을 담은 2-4문장"
                },
                subContent: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "불렛포인트 3-5개 - 구체적 혜택, 증거, 특징"
                },
                imagePrompt: {
                  type: Type.STRING,
                  description: "이미지 생성 프롬프트 - 웰니스/피트니스 분위기의 영문 묘사"
                }
              },
              required: ["type", "title", "content", "imagePrompt"]
            }
          },
          brandColors: {
            type: Type.OBJECT,
            properties: {
              primary: {
                type: Type.STRING,
                description: "메인 브랜드 컬러 (HEX 코드, 예: #4CAF50)"
              },
              secondary: {
                type: Type.STRING,
                description: "보조 브랜드 컬러 (HEX 코드, 예: #81C784)"
              }
            }
          }
        },
        required: ["sections", "brandColors"]
      }
    }
  });

  const result = JSON.parse(response.text);
  return { ...result, baseImage: info.baseImage };
};

// 섹션 타입별 웰니스 키워드 매핑
const wellnessKeywordsBySectionType: Record<string, string[]> = {
  hero: [
    'natural sunlight streaming through large windows',
    'bright and airy interior space',
    'healthy person with confident posture',
    'morning wellness routine',
    'clean minimalist background',
    'aspirational lifestyle photography'
  ],
  problem: [
    'soft natural lighting',
    'person looking contemplative',
    'subtle shadows suggesting struggle',
    'warm indoor environment',
    'relatable everyday setting',
    'emotional connection moment'
  ],
  solution: [
    'bright natural light interior',
    'clean product close-up shot',
    'healthy person actively using product',
    'modern fitness studio environment',
    'professional product photography',
    'action shot with positive energy'
  ],
  features: [
    'detailed product macro shot',
    'clean white background',
    'ingredients or components visualization',
    'scientific yet approachable aesthetic',
    'infographic style composition',
    'professional studio lighting'
  ],
  trust: [
    'professional medical or lab setting',
    'certification badges and documents',
    'before and after concept',
    'data visualization aesthetic',
    'trustworthy clinical environment',
    'expert endorsement style'
  ],
  cta: [
    'vibrant energetic atmosphere',
    'person celebrating achievement',
    'bright optimistic lighting',
    'motivational fitness moment',
    'healthy happy lifestyle',
    'call to action energy'
  ]
};

// 섹션 타입별 생활용품 키워드 매핑
const dailyLifeKeywordsBySectionType: Record<string, string[]> = {
  hero: [
    'modern clean living room interior',
    'bright natural daylight',
    'minimalist scandinavian design',
    'product in lifestyle setting',
    'clean organized space',
    'professional product photography'
  ],
  problem: [
    'cluttered messy space',
    'person looking frustrated',
    'everyday household challenge',
    'relatable domestic situation',
    'before improvement scene',
    'real life setting'
  ],
  solution: [
    'clean product demonstration',
    'person using product happily',
    'organized tidy space',
    'modern kitchen or living room',
    'action shot showing ease of use',
    'bright cheerful atmosphere'
  ],
  features: [
    'product detail close-up',
    'clean white studio background',
    'exploded view or components',
    'sleek modern design showcase',
    'premium material texture',
    'professional lighting setup'
  ],
  trust: [
    'certification and quality badges',
    'professional testing environment',
    'customer satisfaction concept',
    'warranty and guarantee visual',
    'trustworthy brand aesthetic',
    'quality assurance imagery'
  ],
  cta: [
    'happy satisfied customer',
    'clean organized home',
    'lifestyle improvement result',
    'bright optimistic scene',
    'product in beautiful setting',
    'aspirational domestic life'
  ]
};

// 기본 웰니스 이미지 스타일 키워드
const baseWellnessKeywords = [
  'high-end wellness product photography',
  'bright healthy lifestyle aesthetic',
  'cinematic studio lighting',
  'clean modern minimalist background',
  '8k commercial quality',
  'positive energetic mood',
  'professional color grading'
];

// 기본 생활용품 이미지 스타일 키워드
const baseDailyLifeKeywords = [
  'high-end product photography',
  'clean modern interior aesthetic',
  'bright natural lighting',
  'minimalist scandinavian style',
  '8k commercial quality',
  'practical lifestyle mood',
  'professional color grading'
];

// 이미지 프롬프트 생성 함수 (웰니스 + 생활용품 지원)
const buildImagePrompt = (
  originalPrompt: string,
  sectionType: string,
  isDailyLife: boolean = false
): string => {
  const keywordMap = isDailyLife ? dailyLifeKeywordsBySectionType : wellnessKeywordsBySectionType;
  const baseKeywords = isDailyLife ? baseDailyLifeKeywords : baseWellnessKeywords;

  const sectionKeywords = keywordMap[sectionType] || keywordMap.solution;

  // 섹션별 키워드 3개 + 기본 키워드 3개 선택
  const selectedSectionKeywords = sectionKeywords.slice(0, 3).join(', ');
  const selectedBaseKeywords = baseKeywords.slice(0, 3).join(', ');

  return `${originalPrompt}, ${selectedSectionKeywords}, ${selectedBaseKeywords}`;
};

export const generateSectionImage = async (
  prompt: string,
  sectionType: SectionType | string = 'solution',
  baseImage?: string,
  isDailyLife: boolean = false
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // 목적에 맞는 키워드가 자동 추가된 프롬프트 생성
  const enhancedPrompt = buildImagePrompt(prompt, sectionType, isDailyLife);

  const contents: any = {
    parts: []
  };

  if (baseImage) {
    contents.parts.push({
      inlineData: {
        data: baseImage.split(',')[1],
        mimeType: 'image/png'
      }
    });
    contents.parts.push({
      text: `Maintain the exact product from the image. Place it in this new environment: ${enhancedPrompt}. Hyper-realistic product photography with wellness/fitness atmosphere.`
    });
  } else {
    contents.parts.push({
      text: enhancedPrompt
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-05-20',
    contents,
    config: {
      responseModalities: ["image", "text"],
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  let imageUrl = '';
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) throw new Error("Image generation failed");
  return imageUrl;
};

// ═══════════════════════════════════════════════════════════════
// 웰니스 특화 컨텐츠 자동 생성 함수
// ═══════════════════════════════════════════════════════════════

/**
 * 상품명 기반 FAQ, 추천 대상, 사용 가이드 자동 생성
 */
export const generateAutoContent = async (
  productName: string,
  category: string,
  productPurpose?: WellnessGoal
): Promise<{
  faq: FAQItem[];
  guide: Omit<GuideSectionData, 'type'>;
  comparison: Omit<ComparisonSectionData, 'type'>;
}> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const purposeLabel = productPurpose ? purposeLabels[productPurpose] : '일반';
  const isDailyLife = productPurpose === 'daily-life';

  const prompt = `
상품명: ${productName}
카테고리: ${category}
제품 목적: ${purposeLabel}

위 제품에 대해 다음 콘텐츠를 한국어로 생성해주세요:

1. FAQ (자주 묻는 질문) 5개
   - 실제 구매 고객이 궁금해할 법한 질문들
   - ${isDailyLife ? '사용법, 세척법, 내구성, AS, 호환성 관련' : '복용법, 효과, 부작용, 보관법, 인증 관련'}

2. 전문가 가이드 (Trainer's Tip / Expert Guide)
   - 전문가 이름과 직함 (예: ${isDailyLife ? '김OO 제품 컨설턴트' : '박OO 건강관리사'})
   - 핵심 팁 3-5개
   - 전문가 추천 멘트 1문장

3. 비교 테이블 (vs 타사 제품)
   - 비교 항목 5-7개
   - ${isDailyLife ? '편의성, 내구성, 디자인, 가격대비, A/S' : '성분 함량, 흡수율, 가성비, 인증, 부가 혜택'} 관련
   - 우리 제품명 (상품명 기반)
   - 경쟁사 명칭 (일반적인 "타사 제품")
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro-preview-06-05',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          faq: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              },
              required: ["id", "question", "answer"]
            }
          },
          guide: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              expertName: { type: Type.STRING },
              expertTitle: { type: Type.STRING },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              recommendation: { type: Type.STRING }
            },
            required: ["title", "expertName", "expertTitle", "tips", "recommendation"]
          },
          comparison: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              ourProductName: { type: Type.STRING },
              competitorName: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    feature: { type: Type.STRING },
                    ourProduct: { type: Type.STRING },
                    competitor: { type: Type.STRING }
                  },
                  required: ["feature", "ourProduct", "competitor"]
                }
              }
            },
            required: ["title", "ourProductName", "competitorName", "items"]
          }
        },
        required: ["faq", "guide", "comparison"]
      }
    }
  });

  return JSON.parse(response.text);
};

// ═══════════════════════════════════════════════════════════════
// 2단계 생성 프로세스 함수
// ═══════════════════════════════════════════════════════════════

/**
 * 1단계: 초안 아웃라인 생성 (빠른 응답)
 */
export const generateDraftOutline = async (info: ProductInfo): Promise<DraftPageData> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const isDailyLife = info.wellnessData?.goal === 'daily-life';
  const purposeLabel = info.wellnessData ? purposeLabels[info.wellnessData.goal] : '일반';

  const prompt = `
상품명: ${info.name}
카테고리: ${info.category}
제품 목적: ${purposeLabel}
타겟 고객: ${info.targetAudience}
주요 특장점: ${info.features}
톤앤매너: ${info.tone}

위 정보를 바탕으로 상세페이지 초안 아웃라인을 생성해주세요.
각 섹션의 개요만 1-2문장으로 간략히 작성합니다.

필수 섹션 타입:
1. hero - 후킹 헤드라인
2. problem - 문제/공감
3. solution - 해결책
4. features - 제품 특징
5. trust - 신뢰 구축
6. reviews - 리뷰/후기
7. faq - 자주 묻는 질문
8. guide - 전문가 가이드
9. comparison - 비교 테이블
10. cta - 행동 촉구

각 섹션에 대해 outline(개요)을 작성하고, 브랜드 컬러를 추천해주세요.
${isDailyLife ? '생활용품에 어울리는 깔끔하고 신뢰감 있는 색상을 선택하세요.' : '웰니스/피트니스에 어울리는 건강하고 활력있는 색상을 선택하세요.'}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-05-20',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: "섹션 타입" },
                title: { type: Type.STRING, description: "섹션 제목 (간략)" },
                outline: { type: Type.STRING, description: "섹션 개요 1-2문장" },
                isApproved: { type: Type.BOOLEAN, description: "기본값 true" }
              },
              required: ["type", "title", "outline", "isApproved"]
            }
          },
          suggestedColors: {
            type: Type.OBJECT,
            properties: {
              primary: { type: Type.STRING, description: "메인 브랜드 컬러 HEX" },
              secondary: { type: Type.STRING, description: "보조 브랜드 컬러 HEX" }
            },
            required: ["primary", "secondary"]
          }
        },
        required: ["sections", "suggestedColors"]
      }
    }
  });

  const result = JSON.parse(response.text ?? '{}');

  // 섹션이 없거나 빈 배열이면 기본 섹션 생성
  if (!result.sections || result.sections.length === 0) {
    result.sections = [
      { type: 'hero', title: '후킹 헤드라인', outline: '고객의 관심을 끄는 강렬한 첫인상', isApproved: true },
      { type: 'problem', title: '문제 인식', outline: '고객이 겪는 불편함과 고민 공감', isApproved: true },
      { type: 'solution', title: '해결책 제시', outline: '제품이 제공하는 핵심 해결책', isApproved: true },
      { type: 'features', title: '제품 특징', outline: '주요 기능과 차별화 포인트', isApproved: true },
      { type: 'trust', title: '신뢰 구축', outline: '인증, 리뷰, 전문가 추천 등', isApproved: true },
      { type: 'cta', title: '행동 촉구', outline: '지금 구매해야 하는 이유', isApproved: true }
    ];
  }

  // suggestedColors가 없으면 기본값 설정
  if (!result.suggestedColors) {
    result.suggestedColors = { primary: '#4CAF50', secondary: '#81C784' };
  }

  return result;
};

/**
 * 2단계: 승인된 섹션 상세 내용 채우기
 */
export const fillApprovedSections = async (
  info: ProductInfo,
  approvedDraft: DraftPageData
): Promise<DetailPageData> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const isDailyLife = info.wellnessData?.goal === 'daily-life';

  // 승인된 섹션만 필터링
  const approvedSections = approvedDraft.sections.filter(s => s.isApproved);
  const sectionTypes = approvedSections.map(s => s.type);

  // 기본 섹션 (hero, problem, solution, features, trust, cta)
  const basicSections = approvedSections.filter(s =>
    ['hero', 'problem', 'solution', 'features', 'trust', 'cta', 'reviews'].includes(s.type)
  );

  // 웰니스 특화 섹션 (faq, guide, comparison)
  const hasWellnessSections = sectionTypes.some(t => ['faq', 'guide', 'comparison'].includes(t));

  let systemInstruction = isDailyLife ? getDailyLifeSystemInstruction() : getWellnessSystemInstruction();

  // 기본 섹션 생성용 프롬프트
  const basicPrompt = `
상품명: ${info.name}
카테고리: ${info.category}
주요 특장점: ${info.features}
타겟 고객: ${info.targetAudience}
원하는 톤: ${info.tone}

아래 승인된 섹션 초안을 바탕으로 상세 내용을 작성해주세요:

${basicSections.map((s, i) => `
[섹션 ${i + 1}] type: "${s.type}"
- 제목 초안: ${s.title}
- 개요: ${s.outline}
`).join('\n')}

각 섹션별로 title, content, subContent(불렛포인트 3-5개), imagePrompt를 작성해주세요.
`;

  const basicResponse = await ai.models.generateContent({
    model: 'gemini-2.5-pro-preview-06-05',
    contents: basicPrompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                subContent: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                imagePrompt: { type: Type.STRING }
              },
              required: ["type", "title", "content", "imagePrompt"]
            }
          }
        },
        required: ["sections"]
      }
    }
  });

  const basicResult = JSON.parse(basicResponse.text);

  // 웰니스 특화 섹션 생성 (필요 시)
  let wellnessContent = null;
  if (hasWellnessSections) {
    wellnessContent = await generateAutoContent(
      info.name,
      info.category,
      info.wellnessData?.goal
    );
  }

  // 섹션 병합
  const allSections = [...basicResult.sections];

  // FAQ 섹션 추가
  if (sectionTypes.includes('faq') && wellnessContent) {
    allSections.push({
      type: 'faq',
      title: '자주 묻는 질문',
      content: '고객님들이 자주 문의하시는 내용을 모았습니다.',
      faqItems: wellnessContent.faq
    });
  }

  // Guide 섹션 추가
  if (sectionTypes.includes('guide') && wellnessContent) {
    allSections.push({
      type: 'guide',
      title: wellnessContent.guide.title,
      content: '전문가가 알려드리는 올바른 사용법',
      expertName: wellnessContent.guide.expertName,
      expertTitle: wellnessContent.guide.expertTitle,
      tips: wellnessContent.guide.tips,
      recommendation: wellnessContent.guide.recommendation
    });
  }

  // Comparison 섹션 추가
  if (sectionTypes.includes('comparison') && wellnessContent) {
    allSections.push({
      type: 'comparison',
      title: wellnessContent.comparison.title,
      content: '경쟁 제품과 비교해보세요.',
      ourProductName: wellnessContent.comparison.ourProductName,
      competitorName: wellnessContent.comparison.competitorName,
      comparisonItems: wellnessContent.comparison.items.map(item => ({
        feature: item.feature,
        ourProduct: item.ourProduct === 'O' ? true : item.ourProduct === 'X' ? false : item.ourProduct,
        competitor: item.competitor === 'O' ? true : item.competitor === 'X' ? false : item.competitor
      }))
    });
  }

  return {
    sections: allSections,
    brandColors: approvedDraft.suggestedColors,
    baseImage: info.baseImage
  };
};

// ═══════════════════════════════════════════════════════════════
// AI 배경 제거 (Gemini 프롬프트 기반)
// ═══════════════════════════════════════════════════════════════

/**
 * 이미지 배경 제거 및 새 배경 합성
 */
export const generateImageWithBackgroundRemoval = async (
  productImage: string,
  newBackgroundPrompt: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const contents = {
    parts: [
      {
        inlineData: {
          data: productImage.split(',')[1],
          mimeType: 'image/png'
        }
      },
      {
        text: `Remove the background from this product image completely.
Extract only the product itself with clean, precise edges.
Then place the extracted product on this new background: ${newBackgroundPrompt}.
Ensure the product looks naturally integrated with professional lighting and shadows.
Maintain the product's original colors and details perfectly.
High quality, 8K resolution, professional product photography.`
      }
    ]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-05-20',
    contents,
    config: {
      responseModalities: ["image", "text"],
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  let imageUrl = '';
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) throw new Error("Background removal failed");
  return imageUrl;
};
