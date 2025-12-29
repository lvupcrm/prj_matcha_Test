import React from 'react';
import { DraftPageData, DraftSection, SectionType } from '../types';

interface DraftReviewProps {
  draft: DraftPageData;
  onUpdate: (draft: DraftPageData) => void;
  onApprove: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

// 섹션 타입별 아이콘 매핑
const sectionIcons: Record<SectionType, string> = {
  hero: 'fa-bolt',
  problem: 'fa-face-frown',
  solution: 'fa-lightbulb',
  features: 'fa-star',
  trust: 'fa-shield-check',
  reviews: 'fa-comments',
  faq: 'fa-circle-question',
  guide: 'fa-user-tie',
  comparison: 'fa-scale-balanced',
  cta: 'fa-rocket'
};

// 섹션 타입별 라벨 매핑
const sectionLabels: Record<SectionType, string> = {
  hero: '후킹 헤드라인',
  problem: '문제/공감',
  solution: '해결책',
  features: '제품 특징',
  trust: '신뢰 구축',
  reviews: '리뷰/후기',
  faq: 'FAQ',
  guide: '전문가 가이드',
  comparison: '비교 테이블',
  cta: '행동 촉구'
};

const DraftReview: React.FC<DraftReviewProps> = ({
  draft,
  onUpdate,
  onApprove,
  onBack,
  isLoading = false
}) => {
  const toggleSectionApproval = (index: number) => {
    const updatedSections = [...draft.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      isApproved: !updatedSections[index].isApproved
    };
    onUpdate({ ...draft, sections: updatedSections });
  };

  const approvedCount = draft.sections.filter(s => s.isApproved).length;
  const totalCount = draft.sections.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 mb-4">
            <i className="fa-solid fa-wand-magic-sparkles text-purple-500" />
            <span className="text-sm font-medium text-slate-600">AI 초안 검토</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            상세페이지 구성을 검토해주세요
          </h1>
          <p className="text-slate-500 text-sm">
            원하지 않는 섹션은 끄고, 필요한 섹션만 켜주세요
          </p>
        </div>

        {/* Color Preview */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">추천 브랜드 컬러</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg shadow-inner border border-white/50"
                  style={{ backgroundColor: draft.suggestedColors.primary }}
                />
                <span className="text-xs text-slate-400">{draft.suggestedColors.primary}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg shadow-inner border border-white/50"
                  style={{ backgroundColor: draft.suggestedColors.secondary }}
                />
                <span className="text-xs text-slate-400">{draft.suggestedColors.secondary}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Cards */}
        <div className="space-y-3 mb-8">
          {draft.sections.map((section, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 ${
                section.isApproved
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : 'border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    section.isApproved
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <i className={`fa-solid ${sectionIcons[section.type as SectionType] || 'fa-puzzle-piece'}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        section.isApproved ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      {sectionLabels[section.type as SectionType] || section.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm mb-1 truncate">
                    {section.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {section.outline}
                  </p>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggleSectionApproval(index)}
                  className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
                    section.isApproved ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      section.isApproved ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary & Actions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          {/* Selection Summary */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
            <span className="text-sm text-slate-600">선택된 섹션</span>
            <span className="font-bold text-slate-900">
              {approvedCount} / {totalCount}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <i className="fa-solid fa-arrow-left mr-2" />
              이전으로
            </button>
            <button
              onClick={onApprove}
              disabled={isLoading || approvedCount === 0}
              className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2" />
                  생성 중...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles mr-2" />
                  상세페이지 생성
                </>
              )}
            </button>
          </div>

          {/* Warning */}
          {approvedCount === 0 && (
            <p className="text-center text-xs text-amber-600 mt-3">
              <i className="fa-solid fa-exclamation-triangle mr-1" />
              최소 1개 이상의 섹션을 선택해주세요
            </p>
          )}
        </div>

        {/* Tip */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-lightbulb text-blue-500 text-sm" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">팁</p>
              <p className="text-xs text-blue-600 leading-relaxed">
                FAQ, 전문가 가이드, 비교 테이블은 고객의 구매 결정에 큰 영향을 미칩니다.
                가능하면 모두 포함하는 것을 권장드려요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftReview;
