
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

  // 나노바나나 스타일 Skeleton UI
  const SkeletonLoader = () => (
    <div className="w-full aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex flex-col items-center justify-center overflow-hidden relative">
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skeleton-shimmer" />

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-slate-700 shadow-sm flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-white animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-white">이미지 생성 중</p>
          <p className="text-xs text-slate-400 mt-1">AI가 최적의 이미지를 만들고 있어요</p>
        </div>
      </div>

      {/* Skeleton Lines */}
      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        <div className="h-2 bg-slate-700/50 rounded-full w-3/4 animate-pulse" />
        <div className="h-2 bg-slate-700/50 rounded-full w-1/2 animate-pulse" />
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
    <div className="w-full aspect-[4/3] bg-slate-900 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-700">
      <div className="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center mb-3">
        <i className="fa-solid fa-exclamation-triangle text-red-400" />
      </div>
      <p className="text-sm text-slate-400 mb-3">이미지 생성에 실패했어요</p>
      <button
        onClick={handleGenerateImage}
        className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium text-white hover:bg-slate-700 transition-colors"
      >
        <i className="fa-solid fa-rotate-right mr-2" />
        다시 시도
      </button>
    </div>
  );

  // 이미지 렌더링 (공통)
  const renderImage = (aspectRatio: string = 'aspect-[4/3]', rounded: string = 'rounded-2xl') => {
    if (loading) return <SkeletonLoader />;
    if (error) return <ErrorRetry />;
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={section.title}
          className={`w-full ${aspectRatio} object-cover ${rounded} animate-fadeIn`}
        />
      );
    }
    return <SkeletonLoader />;
  };

  // ═══════════════════════════════════════════════════════════════
  // 나노바나나 스타일 섹션 렌더링 (다크모드 + 임팩트 있는 디자인)
  // ═══════════════════════════════════════════════════════════════

  const renderHero = () => (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={section.title}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end pb-20 px-6">
        {/* Badge */}
        <div className="mb-6">
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-bold tracking-wide"
            style={{ backgroundColor: primaryColor, color: 'white' }}
          >
            BEST SELLER
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 break-keep">
          {section.title}
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl mb-8">
          {section.content}
        </p>

        {/* Sub Content as Features */}
        {section.subContent && section.subContent.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10">
            {section.subContent.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/20"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <button
          className="w-full max-w-md px-8 py-5 text-white font-black text-lg rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
          style={{ backgroundColor: primaryColor }}
        >
          지금 구매하기
          <i className="fa-solid fa-arrow-right ml-3" />
        </button>
      </div>
    </div>
  );

  const renderProblem = () => (
    <div className="bg-slate-900 py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <i className="fa-solid fa-face-tired text-red-400 text-xl" />
          </div>
          <span className="text-red-400 font-bold text-sm uppercase tracking-widest">PROBLEM</span>
        </div>

        {/* Big Impact Title */}
        <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight break-keep">
          {section.title}
        </h2>

        {/* Quote Box */}
        <div className="bg-slate-800/50 border-l-4 border-red-500 p-6 rounded-r-2xl mb-10">
          <p className="text-xl md:text-2xl text-slate-300 font-medium italic leading-relaxed">
            "{section.content}"
          </p>
        </div>

        {/* Pain Points - Big Cards */}
        {section.subContent && section.subContent.length > 0 && (
          <div className="space-y-4">
            {section.subContent.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-5 p-5 bg-slate-800/30 rounded-2xl border border-slate-700/50 hover:border-red-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-xmark text-red-400" />
                </div>
                <p className="text-white font-medium text-lg">{item}</p>
              </div>
            ))}
          </div>
        )}

        {/* Image */}
        <div className="mt-12">
          {renderImage('aspect-[16/10]', 'rounded-3xl')}
        </div>
      </div>
    </div>
  );

  const renderSolution = () => (
    <div className="bg-black py-20 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]"
        style={{ backgroundColor: primaryColor }}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}30` }}
          >
            <i className="fa-solid fa-lightbulb text-xl" style={{ color: primaryColor }} />
          </div>
          <span className="font-bold text-sm uppercase tracking-widest" style={{ color: primaryColor }}>SOLUTION</span>
        </div>

        {/* Big Impact Title */}
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight break-keep">
          {section.title}
        </h2>

        {/* Description */}
        <p className="text-xl text-slate-400 leading-relaxed mb-12">
          {section.content}
        </p>

        {/* Product Image - Big and Center */}
        <div className="mb-12">
          {renderImage('aspect-square', 'rounded-3xl')}
        </div>

        {/* Benefits List - Cards Style */}
        {section.subContent && section.subContent.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.subContent.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: `${primaryColor}10`,
                  borderColor: `${primaryColor}30`
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <i className="fa-solid fa-check text-white" />
                  </div>
                  <p className="text-white font-semibold leading-relaxed">{item}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderFeatures = () => (
    <div className="bg-gradient-to-b from-slate-900 to-black py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Section Label */}
        <div className="text-center mb-12">
          <span
            className="inline-block px-5 py-2 rounded-full text-sm font-bold tracking-wide mb-6"
            style={{ backgroundColor: `${secondaryColor}20`, color: secondaryColor }}
          >
            FEATURES
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight break-keep">
            {section.title}
          </h2>
        </div>

        {/* Features Grid - Big Impact Cards */}
        {section.subContent && section.subContent.length > 0 && (
          <div className="space-y-6 mb-12">
            {section.subContent.map((item, idx) => {
              const icons = ['fa-bolt', 'fa-shield-halved', 'fa-flask-vial', 'fa-award', 'fa-leaf'];
              const colors = [primaryColor, secondaryColor, '#F59E0B', '#8B5CF6', '#10B981'];

              return (
                <div
                  key={idx}
                  className="relative p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50 overflow-hidden group hover:border-slate-600 transition-all"
                >
                  {/* Number Badge */}
                  <div
                    className="absolute top-0 right-0 w-20 h-20 flex items-center justify-center text-6xl font-black opacity-10"
                    style={{ color: colors[idx % colors.length] }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  <div className="flex items-start gap-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${colors[idx % colors.length]}20` }}
                    >
                      <i
                        className={`fa-solid ${icons[idx % icons.length]} text-2xl`}
                        style={{ color: colors[idx % colors.length] }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-xl leading-relaxed">{item}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Content */}
        <p className="text-slate-400 text-center text-lg leading-relaxed mb-10">
          {section.content}
        </p>

        {/* Image */}
        <div>
          {renderImage('aspect-[16/9]', 'rounded-3xl')}
        </div>
      </div>
    </div>
  );

  const renderTrust = () => (
    <div className="bg-slate-900 py-20 px-6 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
        <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Section Label */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <i key={star} className="fa-solid fa-star text-amber-400 text-2xl" />
            ))}
          </div>
          <span className="text-amber-400 font-bold text-sm uppercase tracking-widest">TRUST</span>
        </div>

        {/* Big Impact Title */}
        <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-8 leading-tight break-keep">
          {section.title}
        </h2>

        {/* Big Trust Quote */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-3xl p-8 mb-10 border border-amber-500/20">
          <p className="text-xl md:text-2xl text-white text-center leading-relaxed font-medium">
            "{section.content}"
          </p>
        </div>

        {/* Trust Items - Badge Style */}
        {section.subContent && section.subContent.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {section.subContent.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-circle-check text-emerald-400" />
                </div>
                <p className="text-white font-medium text-sm">{item}</p>
              </div>
            ))}
          </div>
        )}

        {/* Image */}
        <div className="mt-12">
          {renderImage('aspect-[16/10]', 'rounded-3xl')}
        </div>
      </div>
    </div>
  );

  const renderCTA = () => (
    <div className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: primaryColor }}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-black/10 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Big Icon */}
        <div className="w-24 h-24 rounded-3xl mx-auto mb-8 flex items-center justify-center bg-white/20 backdrop-blur-sm">
          <i className="fa-solid fa-gift text-white text-4xl" />
        </div>

        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight break-keep">
          {section.title}
        </h2>

        {/* Content */}
        <p className="text-xl text-white/80 leading-relaxed mb-10">
          {section.content}
        </p>

        {/* Benefits Summary */}
        {section.subContent && section.subContent.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {section.subContent.map((item, idx) => (
              <span
                key={idx}
                className="px-5 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold border border-white/30"
              >
                <i className="fa-solid fa-check mr-2" />
                {item}
              </span>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <button className="w-full max-w-md px-10 py-6 bg-white text-lg font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
          style={{ color: primaryColor }}
        >
          지금 바로 구매하기
          <i className="fa-solid fa-arrow-right ml-3" />
        </button>

        {/* Sub Text */}
        <p className="text-white/60 mt-6 text-sm font-medium">
          ✨ 오늘 주문 시 무료배송 + 특별 할인
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

  // 리뷰 섹션 렌더링 (나노바나나 스타일)
  const renderReviews = () => (
    <div className="bg-black py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Section Label */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <i key={star} className="fa-solid fa-star text-amber-400 text-xl" />
            ))}
          </div>
          <span
            className="inline-block px-5 py-2 rounded-full text-sm font-bold tracking-wide mb-6"
            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
          >
            REAL REVIEWS
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight break-keep">
            {section.title}
          </h2>
        </div>

        {/* Reviews - Big Cards */}
        {section.subContent && section.subContent.length > 0 && (
          <div className="space-y-6">
            {section.subContent.map((review, idx) => (
              <div
                key={idx}
                className="bg-slate-900 rounded-3xl p-6 border border-slate-800"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className="fa-solid fa-star text-amber-400 text-sm" />
                  ))}
                </div>
                <p className="text-white text-lg leading-relaxed mb-4">
                  "{review}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div>
                    <p className="text-white font-semibold">구매자 {String.fromCharCode(65 + idx)}</p>
                    <p className="text-slate-500 text-sm">실제 구매 후기</p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
                      인증됨
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <p className="text-slate-400 text-center mt-10 text-lg">
          {section.content}
        </p>
      </div>
    </div>
  );

  // 기본 렌더링 (알 수 없는 타입용) - 나노바나나 스타일
  const renderDefault = () => (
    <div className="bg-slate-900 py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-8">
          {section.title}
        </h2>
        <p className="text-slate-400 text-center text-lg mb-10">
          {section.content}
        </p>
        {section.subContent && (
          <div className="space-y-4">
            {section.subContent.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-2xl">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <i className="fa-solid fa-circle-check" style={{ color: primaryColor }} />
                </div>
                <span className="text-white font-medium">{item}</span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-10">
          {renderImage('aspect-[16/10]', 'rounded-3xl')}
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
