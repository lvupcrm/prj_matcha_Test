
import React, { useState, useRef } from 'react';
import { ProductInfo, DetailPageData, GenerationStatus, ProductPurpose, WellnessData, DraftPageData, GenerationStage } from './types';
import { generateDetailPageContent, generateDraftOutline, fillApprovedSections } from './services/geminiService';
import Preview from './components/Preview';
import DraftReview from './components/DraftReview';
import { exportToPNG } from './components/export/PNGExporter';

const INITIAL_WELLNESS_DATA: WellnessData = {
  goal: 'weight-loss',
  biggestChange: '',
  expertiseProof: '',
  coreTechnology: '',
  customerObstacle: '',
  obstacleSolution: '',
  dataProof: ''
};

const INITIAL_FORM_STATE: ProductInfo = {
  name: '',
  category: '',
  features: '',
  targetAudience: '',
  tone: 'professional',
  baseImage: undefined,
  categoryType: 'wellness',
  wellnessData: INITIAL_WELLNESS_DATA // 웰니스가 기본값
};

const App: React.FC = () => {
  const [step, setStep] = useState<'form' | 'draft' | 'preview'>('form');
  const [form, setForm] = useState<ProductInfo>(INITIAL_FORM_STATE);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [pageData, setPageData] = useState<DetailPageData | null>(null);
  const [draftData, setDraftData] = useState<DraftPageData | null>(null);
  const [generationStage, setGenerationStage] = useState<GenerationStage>('idle');
  const [useTwoStepGeneration, setUseTwoStepGeneration] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, baseImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 2단계 생성: 1단계 - 초안 생성
  const handleGenerateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      alert("상품명과 카테고리를 입력해주세요.");
      return;
    }

    setStatus(GenerationStatus.LOADING_TEXT);
    setGenerationStage('draft');
    try {
      const draft = await generateDraftOutline(form);
      setDraftData(draft);
      setStep('draft');
      setGenerationStage('reviewing');
      setStatus(GenerationStatus.SUCCESS);
    } catch (error: any) {
      console.error('Draft generation error:', error);
      setStatus(GenerationStatus.ERROR);
      setGenerationStage('idle');
      const errorMessage = error?.message || error?.toString() || '알 수 없는 오류';
      alert(`초안 생성 중 오류가 발생했습니다.\n\n상세: ${errorMessage}`);
    }
  };

  // 2단계 생성: 2단계 - 승인된 섹션 상세 채우기
  const handleApproveDraft = async () => {
    if (!draftData) return;

    setStatus(GenerationStatus.LOADING_TEXT);
    setGenerationStage('filling');
    try {
      const data = await fillApprovedSections(form, draftData);
      setPageData(data);
      setStep('preview');
      setGenerationStage('complete');
      setStatus(GenerationStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(GenerationStatus.ERROR);
      setGenerationStage('reviewing');
      alert("상세페이지 생성 중 오류가 발생했습니다.");
    }
  };

  // 기존 1단계 생성 (2단계 생성 사용 안 함)
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      alert("상품명과 카테고리를 입력해주세요.");
      return;
    }

    if (useTwoStepGeneration) {
      return handleGenerateDraft(e);
    }

    setStatus(GenerationStatus.LOADING_TEXT);
    try {
      const data = await generateDetailPageContent(form);
      setPageData(data);
      setStep('preview');
      setStatus(GenerationStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(GenerationStatus.ERROR);
      alert("콘텐츠 생성 중 오류가 발생했습니다.");
    }
  };

  const handleReset = () => {
    setStep('form');
    setPageData(null);
    setDraftData(null);
    setStatus(GenerationStatus.IDLE);
    setGenerationStage('idle');
  };

  const handleBackToDraft = () => {
    setStep('draft');
    setPageData(null);
    setGenerationStage('reviewing');
  };

  const handleBackToForm = () => {
    setStep('form');
    setDraftData(null);
    setGenerationStage('idle');
  };

  const handleExportHTML = () => {
    const root = document.getElementById('preview-content');
    if (!root) return;

    // Create a standalone HTML structure that retains styling
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <title>${form.name} 상세페이지</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
          body { font-family: sans-serif; }
          img { max-width: 100%; height: auto; }
          .no-print { display: none !important; }
        </style>
      </head>
      <body>
        <div class="max-w-[1200px] mx-auto">
          ${root.innerHTML}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.name}_상세페이지.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // PNG 내보내기 함수
  const handleExportPNG = async () => {
    try {
      await exportToPNG('preview-content', `${form.name}_상세페이지`);
    } catch (error) {
      console.error('PNG export failed:', error);
      alert('PNG 내보내기에 실패했습니다.');
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400";

  // 웰니스 데이터 업데이트 핸들러
  const updateWellnessData = (field: keyof WellnessData, value: string) => {
    if (form.wellnessData) {
      setForm({
        ...form,
        wellnessData: {
          ...form.wellnessData,
          [field]: value
        }
      });
    }
  };

  // 제품 목적 옵션 (웰니스 + 생활용품)
  const productPurposes: { id: ProductPurpose; label: string; icon: string; description: string }[] = [
    { id: 'weight-loss', label: '다이어트/체중감량', icon: 'fa-weight-scale', description: '체중 관리, 슬리밍' },
    { id: 'muscle-gain', label: '근력증진', icon: 'fa-dumbbell', description: '근육 강화, 운동 보조' },
    { id: 'body-correction', label: '체형교정', icon: 'fa-person-walking', description: '자세 교정, 체형 관리' },
    { id: 'mental-care', label: '멘탈케어/명상', icon: 'fa-brain', description: '스트레스 해소, 마음 건강' },
    { id: 'nutrition', label: '영양공급', icon: 'fa-apple-whole', description: '건강기능식품, 영양제' },
    { id: 'daily-life', label: '생활용품', icon: 'fa-house', description: '일상 편의, 생활 개선' }
  ];

  // Draft 단계 렌더링
  if (step === 'draft' && draftData) {
    return (
      <DraftReview
        draft={draftData}
        onUpdate={setDraftData}
        onApprove={handleApproveDraft}
        onBack={handleBackToForm}
        isLoading={status === GenerationStatus.LOADING_TEXT}
      />
    );
  }

  // Preview 단계 렌더링
  if (step === 'preview' && pageData) {
    return (
      <Preview
        pageData={pageData}
        productInfo={form}
        onReset={handleReset}
        onExportHTML={handleExportHTML}
        onExportPNG={handleExportPNG}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
              <i className="fa-solid fa-wand-sparkles text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">상세페이지 AI 엔진</h1>
              <p className="text-slate-500">제품 정보를 입력하여 고퀄리티 상세페이지를 생성하세요</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <i className="fa-solid fa-camera text-indigo-500"></i>
                1. 제품 사진 업로드 (선택)
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer w-full h-48 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-white hover:border-indigo-400 transition-all overflow-hidden"
              >
                {form.baseImage ? (
                  <div className="relative w-full h-full p-2 bg-white flex items-center justify-center">
                    <img src={form.baseImage} className="max-w-full max-h-full object-contain" alt="Product preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="text-white font-bold text-sm">사진 변경하기</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-400 group-hover:text-indigo-500 mb-2"></i>
                    <p className="text-slate-600 font-bold">제품의 메인 사진을 올려주세요</p>
                    <p className="text-xs text-slate-400 mt-1">배경 합성 및 연출샷 생성에 사용됩니다</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
              </div>
            </div>

            {/* 제품 목적 선택 */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <i className="fa-solid fa-bullseye text-emerald-500"></i>
                2. 제품 목적 선택
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {productPurposes.map((purpose) => (
                  <button
                    key={purpose.id}
                    type="button"
                    onClick={() => updateWellnessData('goal', purpose.id)}
                    className={`py-4 px-4 rounded-xl text-sm font-bold border flex flex-col items-center gap-2 transition-all ${
                      form.wellnessData?.goal === purpose.id
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-300'
                    }`}
                  >
                    <i className={`fa-solid ${purpose.icon} text-lg`}></i>
                    <span>{purpose.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{purpose.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">상품명</label>
                <input
                  type="text"
                  placeholder={form.wellnessData?.goal === 'daily-life' ? "예: 무선 핸디 청소기" : "예: 저분자 콜라겐 펩타이드"}
                  className={inputClasses}
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">카테고리</label>
                <input
                  type="text"
                  placeholder={form.wellnessData?.goal === 'daily-life' ? "예: 청소용품" : "예: 건강기능식품"}
                  className={inputClasses}
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* 상세 정보 입력 폼 */}
            {form.wellnessData && (
              <div className="space-y-6 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                    <i className={`fa-solid ${productPurposes.find(p => p.id === form.wellnessData?.goal)?.icon || 'fa-info'} text-white text-sm`}></i>
                  </div>
                  <span className="font-bold text-emerald-800">
                    {form.wellnessData.goal === 'daily-life' ? '생활용품 상세 정보' : '제품 상세 정보'}
                  </span>
                </div>

                {/* 1. 효능/효과 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">1</span>
                    {form.wellnessData.goal === 'daily-life' ? '주요 효과 (Benefit)' : '목표 및 효능 (Goal & Benefit)'}
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600">
                      {form.wellnessData.goal === 'daily-life'
                        ? "사용자가 얻게 될 '가장 큰 편의'는?"
                        : "사용자가 얻게 될 '가장 큰 변화'는?"}
                    </label>
                    <input
                      type="text"
                      placeholder={form.wellnessData.goal === 'daily-life'
                        ? "예: 청소 시간이 절반으로 줄어듭니다, 손목 통증 없이 편하게 사용할 수 있습니다"
                        : "예: 한 달 만에 굽은 어깨가 펴집니다, 아침에 일어날 때 몸이 가벼워집니다"}
                      className={`${inputClasses} text-sm`}
                      value={form.wellnessData.biggestChange}
                      onChange={e => updateWellnessData('biggestChange', e.target.value)}
                    />
                  </div>
                </div>

                {/* 2. 전문성/기술력 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">2</span>
                    {form.wellnessData.goal === 'daily-life' ? '기술력 (Technology)' : '전문가의 한마디 (Expertise)'}
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600">
                      {form.wellnessData.goal === 'daily-life'
                        ? "제품의 차별화된 기술이나 특장점은?"
                        : "전문성을 입증할 수 있는 정보가 있나요?"}
                    </label>
                    <input
                      type="text"
                      placeholder={form.wellnessData.goal === 'daily-life'
                        ? "예: 특허받은 무소음 모터, 인체공학적 그립 설계"
                        : "예: 물리치료사 설계, 현직 트레이너 100인이 추천, 식약처 인증 기능성"}
                      className={`${inputClasses} text-sm`}
                      value={form.wellnessData.expertiseProof}
                      onChange={e => updateWellnessData('expertiseProof', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600">
                      {form.wellnessData.goal === 'daily-life'
                        ? "핵심 기능이나 소재는?"
                        : "제품의 핵심 성분이나 기술력은?"}
                    </label>
                    <input
                      type="text"
                      placeholder={form.wellnessData.goal === 'daily-life'
                        ? "예: 항균 스테인리스 재질, 2시간 완충 60분 사용"
                        : "예: 특허받은 저소음 모터, 흡수율을 높인 저분자 공법"}
                      className={`${inputClasses} text-sm`}
                      value={form.wellnessData.coreTechnology}
                      onChange={e => updateWellnessData('coreTechnology', e.target.value)}
                    />
                  </div>
                </div>

                {/* 3. 문제/해결 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">3</span>
                    {form.wellnessData.goal === 'daily-life' ? '불편함 해결 (Problem Solving)' : '심리적 자극 (Motivation)'}
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600">
                      {form.wellnessData.goal === 'daily-life'
                        ? "고객이 기존 제품에서 느끼는 '불편함'은?"
                        : "고객이 운동이나 관리를 포기하게 만드는 '장애물'은?"}
                    </label>
                    <input
                      type="text"
                      placeholder={form.wellnessData.goal === 'daily-life'
                        ? "예: 무거워서, 소음이 심해서, 청소가 번거로워서"
                        : "예: 운동이 너무 힘들어서, 맛이 없어서, 시간이 없어서"}
                      className={`${inputClasses} text-sm`}
                      value={form.wellnessData.customerObstacle}
                      onChange={e => updateWellnessData('customerObstacle', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600">이 제품은 그 불편함을 어떻게 해결하나요?</label>
                    <input
                      type="text"
                      placeholder={form.wellnessData.goal === 'daily-life'
                        ? "예: 500g 초경량으로 한 손으로 쉽게 사용 가능합니다"
                        : "예: 하루 5분이면 충분합니다, 간식처럼 맛있게 먹는 단백질입니다"}
                      className={`${inputClasses} text-sm`}
                      value={form.wellnessData.obstacleSolution}
                      onChange={e => updateWellnessData('obstacleSolution', e.target.value)}
                    />
                  </div>
                </div>

                {/* 4. 증거/데이터 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">4</span>
                    {form.wellnessData.goal === 'daily-life' ? '신뢰 증거 (Trust)' : '시각적 증거 (Visual Proof)'}
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-600">
                      {form.wellnessData.goal === 'daily-life'
                        ? "신뢰를 줄 수 있는 인증이나 수치가 있나요?"
                        : "데이터로 보여줄 수 있는 성과가 있나요?"}
                    </label>
                    <input
                      type="text"
                      placeholder={form.wellnessData.goal === 'daily-life'
                        ? "예: KC 인증, 누적 판매 10만대, 고객 만족도 97%"
                        : "예: 인체적용시험 결과 체지방 5% 감소 확인, 사용자 만족도 98%"}
                      className={`${inputClasses} text-sm`}
                      value={form.wellnessData.dataProof}
                      onChange={e => updateWellnessData('dataProof', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">브랜드 톤앤매너</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'professional', label: '전문적', icon: 'fa-briefcase' },
                  { id: 'friendly', label: '친근함', icon: 'fa-face-smile' },
                  { id: 'luxurious', label: '고급미', icon: 'fa-gem' },
                  { id: 'energetic', label: '활발함', icon: 'fa-bolt' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setForm({...form, tone: t.id as any})}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border flex flex-col items-center gap-2 transition-all ${
                      form.tone === t.id 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <i className={`fa-solid ${t.icon}`}></i>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={status === GenerationStatus.LOADING_TEXT}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:bg-indigo-400 mt-4"
            >
              {status === GenerationStatus.LOADING_TEXT ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  상세페이지 설계 중...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-magic-wand-sparkles"></i>
                  상세페이지 생성 시작
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
