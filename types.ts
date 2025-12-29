// 제품 목적 타입 정의 (웰니스 기본 + 생활용품 추가)
export type ProductPurpose =
  | 'weight-loss'      // 다이어트/체중감량
  | 'muscle-gain'      // 근력증진
  | 'body-correction'  // 체형교정
  | 'mental-care'      // 멘탈케어/명상
  | 'nutrition'        // 영양공급
  | 'daily-life';      // 생활용품

// 하위 호환성을 위한 타입 별칭
export type CategoryType = 'wellness'; // 웰니스가 기본값
export type WellnessGoal = ProductPurpose;

// 웰니스/피트니스 전용 데이터
export interface WellnessData {
  // 1. 목표 및 효능
  goal: WellnessGoal;
  biggestChange: string; // 가장 큰 변화

  // 2. 전문가의 한마디
  expertiseProof: string; // 전문성 입증 정보
  coreTechnology: string; // 핵심 성분/기술력

  // 3. 심리적 자극
  customerObstacle: string; // 고객이 포기하게 만드는 장애물
  obstacleSolution: string; // 장애물 해결 방법

  // 4. 시각적 증거
  dataProof: string; // 데이터 기반 성과
}

export interface ProductInfo {
  name: string;
  category: string;
  features: string;
  targetAudience: string;
  tone: 'professional' | 'friendly' | 'luxurious' | 'energetic';
  baseImage?: string; // Base64 encoded image string

  // 웰니스/피트니스 특화 필드
  categoryType: CategoryType;
  wellnessData?: WellnessData;
}

export type SectionType = 'hero' | 'problem' | 'solution' | 'features' | 'reviews' | 'faq' | 'trust' | 'cta' | 'guide' | 'comparison';

export interface DetailSection {
  type: SectionType;
  title: string;
  content: string;
  subContent?: string[];
  imageUrl?: string;
  imagePrompt?: string;
}

export interface DetailPageData {
  sections: DetailSection[];
  brandColors: {
    primary: string;
    secondary: string;
  };
  baseImage?: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING_TEXT = 'LOADING_TEXT',
  LOADING_IMAGE = 'LOADING_IMAGE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

// ═══════════════════════════════════════════════════════════════
// 웰니스 특화 컴포넌트 타입
// ═══════════════════════════════════════════════════════════════

// FAQ 섹션
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQSectionData {
  type: 'faq';
  title: string;
  items: FAQItem[];
  imagePrompt?: string;
}

// 전문가 가이드 섹션 (Trainer's Tip)
export interface GuideSectionData {
  type: 'guide';
  title: string;
  expertName: string;
  expertTitle: string;
  expertImagePrompt?: string;
  tips: string[];
  recommendation: string;
  imagePrompt?: string;
}

// 비교 테이블 섹션
export interface ComparisonItem {
  feature: string;
  ourProduct: string | boolean;
  competitor: string | boolean;
}

export interface ComparisonSectionData {
  type: 'comparison';
  title: string;
  ourProductName: string;
  competitorName: string;
  items: ComparisonItem[];
  imagePrompt?: string;
}

// ═══════════════════════════════════════════════════════════════
// 2단계 생성 프로세스 타입
// ═══════════════════════════════════════════════════════════════

export interface DraftSection {
  type: SectionType;
  title: string;
  outline: string;
  isApproved: boolean;
}

export interface DraftPageData {
  sections: DraftSection[];
  suggestedColors: {
    primary: string;
    secondary: string;
  };
  suggestedFAQ?: FAQItem[];
  suggestedGuide?: Omit<GuideSectionData, 'type'>;
  suggestedComparison?: Omit<ComparisonSectionData, 'type'>;
}

export type GenerationStage = 'idle' | 'draft' | 'reviewing' | 'filling' | 'complete';

// ═══════════════════════════════════════════════════════════════
// 블록 에디터 타입
// ═══════════════════════════════════════════════════════════════

export type BlockHeight = 'auto' | 'small' | 'medium' | 'large' | 'custom';
export type BlockPadding = 'none' | 'small' | 'medium' | 'large';

export interface BlockStyle {
  height: BlockHeight;
  customHeight?: number;
  backgroundColor: string;
  padding: BlockPadding;
}

export interface EditableBlock {
  id: string;
  sectionIndex: number;
  style: BlockStyle;
  isSelected: boolean;
  isLocked: boolean;
}

// ═══════════════════════════════════════════════════════════════
// 에디터 상태 타입
// ═══════════════════════════════════════════════════════════════

export type EditorMode = 'view' | 'edit';

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent?: string;
}

export interface TextStyle {
  fontSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  color: string;
  alignment: 'left' | 'center' | 'right';
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
}

export interface EditorState {
  mode: EditorMode;
  selectedBlockId: string | null;
  blocks: EditableBlock[];
  colorTheme: ColorTheme;
  isDirty: boolean;
}

// 에디터 액션 타입
export type EditorAction =
  | { type: 'SET_MODE'; payload: EditorMode }
  | { type: 'SELECT_BLOCK'; payload: string | null }
  | { type: 'UPDATE_BLOCK'; payload: { id: string; style: Partial<BlockStyle> } }
  | { type: 'REORDER_BLOCKS'; payload: string[] }
  | { type: 'UPDATE_THEME'; payload: ColorTheme }
  | { type: 'SET_DIRTY'; payload: boolean }
  | { type: 'RESET_EDITOR' };

// ═══════════════════════════════════════════════════════════════
// 프리셋 테마
// ═══════════════════════════════════════════════════════════════

export const PRESET_THEMES: ColorTheme[] = [
  { id: 'wellness-green', name: '웰니스 그린', primary: '#4CAF50', secondary: '#81C784' },
  { id: 'energy-orange', name: '에너지 오렌지', primary: '#FF9800', secondary: '#FFB74D' },
  { id: 'calm-blue', name: '차분한 블루', primary: '#2196F3', secondary: '#64B5F6' },
  { id: 'vitality-red', name: '활력 레드', primary: '#F44336', secondary: '#E57373' },
  { id: 'nature-teal', name: '자연 틸', primary: '#009688', secondary: '#4DB6AC' },
  { id: 'premium-purple', name: '프리미엄 퍼플', primary: '#9C27B0', secondary: '#BA68C8' },
  { id: 'modern-gray', name: '모던 그레이', primary: '#607D8B', secondary: '#90A4AE' },
  { id: 'fresh-mint', name: '프레시 민트', primary: '#26A69A', secondary: '#80CBC4' },
];
