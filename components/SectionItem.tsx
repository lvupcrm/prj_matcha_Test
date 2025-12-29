
import React, { useState, useEffect } from 'react';
import { DetailSection, FAQItem, ComparisonItem } from '../types';
import { generateSectionImage } from '../services/geminiService';
import FAQSection from './sections/FAQSection';
import GuideSection from './sections/GuideSection';
import ComparisonSection from './sections/ComparisonSection';

// 확장된 섹션 데이터 타입 (웰니스 특화 섹션 포함)
interface ExtendedSectionData extends DetailSection {
  // FAQ 섹션용
  faqItems?: FAQItem[];
  // Guide 섹션용
  expertName?: string;
  expertTitle?: string;
  tips?: string[];
  recommendation?: string;
  // Comparison 섹션용
  ourProductName?: string;
  competitorName?: string;
  comparisonItems?: ComparisonItem[];
}

interface SectionItemProps {
  section: DetailSection;
  primaryColor: string;
  secondaryColor?: string;
  baseImage?: string;
  index: number;
  isDailyLife?: boolean;
}

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  primaryColor,
  secondaryColor = '#81C784',
  baseImage,
  index,
  isDailyLife = false
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // 자동 생성 로직: baseImage가 있고 아직 생성된 이미지가 없을 때 자동 시작
  useEffect(() => {
    if (baseImage && !imageUrl && !loading && !error) {
      handleGenerateImage();
    }
  }, [baseImage]);

  const handleGenerateImage = async () => {
    if (!section.imagePrompt) return;
    setLoading(true);
    setError(false);
    try {
      // 섹션 타입과 제품 목적에 따라 적절한 키워드 자동 추가
      const sectionType = section.type as 'hero' | 'problem' | 'solution' | 'trust' | 'cta' | 'features';
      const url = await generateSectionImage(section.imagePrompt, sectionType, baseImage, isDailyLife);
      setImageUrl(url);
    } catch (error) {
      console.error("Image gen error", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // 웰니스 스타일 Skeleton UI
  const SkeletonLoader = () => (
    <div className="w-full aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex flex-col items-center justify-center overflow-hidden relative">
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skeleton-shimmer" />

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-200 border-t-emerald-500 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-600">이미지 생성 중</p>
          <p className="text-xs text-slate-400 mt-1">AI가 최적의 이미지를 만들고 있어요</p>
        </div>
      </div>

      {/* Skeleton Lines */}
      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        <div className="h-2 bg-slate-200/50 rounded-full w-3/4 animate-pulse" />
        <div className="h-2 bg-slate-200/50 rounded-full w-1/2 animate-pulse" />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );

  // 에러 시 재시도 버튼
  const ErrorRetry = () => (
    <div className="w-full aspect-[4/3] bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
        <i className="fa-solid fa-exclamation-triangle text-red-400" />
      </div>
      <p className="text-sm text-slate-500 mb-3">이미지 생성에 실패했어요</p>
      <button
        onClick={handleGenerateImage}
        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <i className="fa-solid fa-rotate-right mr-2" />
        다시 시도
      </button>
    </div>
  );

  // 이미지 렌더링 (공통)
  const renderImage = (aspectRatio: string = 'aspect-[4/3]') => {
    if (loading) return <SkeletonLoader />;
    if (error) return <ErrorRetry />;
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={section.title}
          className={`w-full ${aspectRatio} object-cover rounded-2xl shadow-lg animate-fadeIn`}
        />
      );
    }
    return <SkeletonLoader />;
  };

  // ═══════════════════════════════════════════════════════════════
  // 섹션별 렌더링 (모바일 퍼스트 + 웰니스 스타일)
  // ═══════════════════════════════════════════════════════════════

  const renderHero = () => (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4">
      {/* Hero Image */}
      <div className="mb-8">
        {renderImage('aspect-[16/10]')}
      </div>

      {/* Hero Content */}
      <div className="text-center space-y-5">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight break-keep">
          {section.title}
        </h1>
        <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
          {section.content}
        </p>

        {/* Sub Content as Tags */}
        {section.subContent && section.subContent.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {section.subContent.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <div className="pt-6">
          <button
            className="w-full max-w-xs px-8 py-4 text-white font-bold rounded-xl transition-all hover:brightness-110 active:scale-[0.98] shadow-lg"
            style={{ backgroundColor: primaryColor }}
          >
            지금 시작하기
          </button>
        </div>
      </div>
    </div>
  );

  const renderProblem = () => (
    <div className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-lg mx-auto">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-8 h-[2px] bg-slate-300" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Problem</span>
          <span className="w-8 h-[2px] bg-slate-300" />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-6 break-keep leading-snug">
          {section.title}
        </h2>

        {/* Pain Point Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <i className="fa-solid fa-face-frown" style={{ color: primaryColor }} />
            </div>
            <p className="text-slate-600 leading-relaxed italic">
              "{section.content}"
            </p>
          </div>

          {/* Pain Points List */}
          {section.subContent && section.subContent.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              {section.subContent.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <i className="fa-solid fa-xmark text-red-400 mt-1 text-sm" />
                  <p className="text-sm text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image */}
        {renderImage()}
      </div>
    </div>
  );

  const renderSolution = () => (
    <div className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-8 h-[2px]" style={{ backgroundColor: secondaryColor }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>Solution</span>
          <span className="w-8 h-[2px]" style={{ backgroundColor: secondaryColor }} />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-6 break-keep leading-snug">
          {section.title}
        </h2>

        {/* Image */}
        <div className="mb-6">
          {renderImage()}
        </div>

        {/* Content */}
        <p className="text-slate-600 leading-relaxed text-center mb-8">
          {section.content}
        </p>

        {/* Benefits List */}
        {section.subContent && section.subContent.length > 0 && (
          <div className="space-y-4">
            {section.subContent.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <i className="fa-solid fa-check text-sm" style={{ color: primaryColor }} />
                </div>
                <p className="text-slate-700 font-medium text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderFeatures = () => (
    <div className="py-16 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-lg mx-auto">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-8 h-[2px] bg-emerald-200" />
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Features</span>
          <span className="w-8 h-[2px] bg-emerald-200" />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8 break-keep leading-snug">
          {section.title}
        </h2>

        {/* Features Grid */}
        {section.subContent && section.subContent.length > 0 && (
          <div className="grid grid-cols-1 gap-4 mb-8">
            {section.subContent.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}10` }}
                  >
                    <i
                      className={`fa-solid ${
                        idx === 0 ? 'fa-award' :
                        idx === 1 ? 'fa-shield-check' :
                        idx === 2 ? 'fa-flask' :
                        idx === 3 ? 'fa-certificate' : 'fa-star'
                      } text-lg`}
                      style={{ color: primaryColor }}
                    />
                  </div>
                  <p className="text-slate-700 font-semibold text-sm flex-1">{item}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <p className="text-slate-500 text-sm text-center leading-relaxed">
          {section.content}
        </p>

        {/* Image */}
        <div className="mt-8">
          {renderImage()}
        </div>
      </div>
    </div>
  );

  const renderTrust = () => (
    <div className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-8 h-[2px] bg-amber-200" />
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Trust</span>
          <span className="w-8 h-[2px] bg-amber-200" />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8 break-keep leading-snug">
          {section.title}
        </h2>

        {/* Trust Badge */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border border-amber-100">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <i key={star} className="fa-solid fa-star text-amber-400 text-lg" />
            ))}
          </div>
          <p className="text-slate-700 text-center leading-relaxed">
            {section.content}
          </p>
        </div>

        {/* Trust Items */}
        {section.subContent && section.subContent.length > 0 && (
          <div className="space-y-3">
            {section.subContent.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-check text-emerald-600 text-xs" />
                </div>
                <p className="text-slate-600 text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
        )}

        {/* Image */}
        <div className="mt-8">
          {renderImage()}
        </div>
      </div>
    </div>
  );

  const renderCTA = () => (
    <div
      className="py-20 px-4"
      style={{ backgroundColor: `${primaryColor}08` }}
    >
      <div className="max-w-lg mx-auto text-center">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"
          style={{ backgroundColor: primaryColor }}
        >
          <i className="fa-solid fa-rocket text-white text-2xl" />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 break-keep leading-snug">
          {section.title}
        </h2>

        {/* Content */}
        <p className="text-slate-600 leading-relaxed mb-8">
          {section.content}
        </p>

        {/* Benefits Summary */}
        {section.subContent && section.subContent.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {section.subContent.map((item, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-slate-600 border border-slate-200"
              >
                <i className="fa-solid fa-check text-emerald-500 mr-2 text-xs" />
                {item}
              </span>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <button
          className="w-full max-w-sm px-8 py-5 text-white font-bold text-lg rounded-2xl transition-all hover:brightness-110 active:scale-[0.98] shadow-xl"
          style={{ backgroundColor: primaryColor }}
        >
          지금 바로 시작하기
          <i className="fa-solid fa-arrow-right ml-3" />
        </button>

        {/* Sub Text */}
        <p className="text-xs text-slate-400 mt-4">
          지금 구매 시 특별 혜택 제공
        </p>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // 웰니스 특화 섹션 렌더링
  // ═══════════════════════════════════════════════════════════════

  // FAQ 섹션 렌더링
  const renderFAQ = () => {
    const extendedSection = section as ExtendedSectionData;
    const faqItems = extendedSection.faqItems || [];

    return (
      <FAQSection
        title={section.title}
        items={faqItems}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        isEditable={false}
      />
    );
  };

  // 전문가 가이드 섹션 렌더링
  const renderGuide = () => {
    const extendedSection = section as ExtendedSectionData;

    return (
      <GuideSection
        title={section.title}
        expertName={extendedSection.expertName || '전문가'}
        expertTitle={extendedSection.expertTitle || '건강 전문가'}
        tips={extendedSection.tips || []}
        recommendation={extendedSection.recommendation || ''}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        isEditable={false}
      />
    );
  };

  // 비교 테이블 섹션 렌더링
  const renderComparison = () => {
    const extendedSection = section as ExtendedSectionData;

    return (
      <ComparisonSection
        title={section.title}
        ourProductName={extendedSection.ourProductName || '우리 제품'}
        competitorName={extendedSection.competitorName || '타사 제품'}
        items={extendedSection.comparisonItems || []}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        isEditable={false}
      />
    );
  };

  // 리뷰 섹션 렌더링 (신규)
  const renderReviews = () => (
    <div className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-lg mx-auto">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-8 h-[2px]" style={{ backgroundColor: secondaryColor }} />
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: primaryColor }}
          >
            Reviews
          </span>
          <span className="w-8 h-[2px]" style={{ backgroundColor: secondaryColor }} />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8 break-keep leading-snug">
          {section.title}
        </h2>

        {/* Reviews */}
        {section.subContent && section.subContent.length > 0 && (
          <div className="space-y-4">
            {section.subContent.map((review, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className="fa-solid fa-star text-amber-400 text-sm" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  "{review}"
                </p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-xs text-slate-400">실제 구매자</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <p className="text-slate-500 text-sm text-center mt-6">
          {section.content}
        </p>
      </div>
    </div>
  );

  // 기본 렌더링 (알 수 없는 타입용)
  const renderDefault = () => (
    <div className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">
          {section.title}
        </h2>
        <p className="text-slate-600 text-center mb-6">
          {section.content}
        </p>
        {section.subContent && (
          <ul className="space-y-3">
            {section.subContent.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <i className="fa-solid fa-circle-check mt-1" style={{ color: primaryColor }} />
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8">
          {renderImage()}
        </div>
      </div>
    </div>
  );

  // 섹션 타입별 렌더링 분기
  const renderContent = () => {
    switch (section.type) {
      case 'hero':
        return renderHero();
      case 'problem':
        return renderProblem();
      case 'solution':
        return renderSolution();
      case 'features':
        return renderFeatures();
      case 'trust':
        return renderTrust();
      case 'cta':
        return renderCTA();
      case 'faq':
        return renderFAQ();
      case 'guide':
        return renderGuide();
      case 'comparison':
        return renderComparison();
      case 'reviews':
        return renderReviews();
      default:
        return renderDefault();
    }
  };

  return (
    <section
      className="w-full"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      {renderContent()}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default SectionItem;
