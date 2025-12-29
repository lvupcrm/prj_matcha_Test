
import React from 'react';
import { DetailPageData, ProductInfo } from '../types';
import SectionItem from './SectionItem';
import { EditorProvider, EditorToolbar, FloatingToolbar, BlockWrapper, useEditor } from './editor';

interface PreviewProps {
  pageData: DetailPageData;
  productInfo: ProductInfo;
  onReset: () => void;
  onExportHTML: () => void;
  onExportPNG?: () => void;
}

// 내부 프리뷰 컨텐츠 (에디터 컨텍스트 내부)
const PreviewContent: React.FC<{
  pageData: DetailPageData;
  productInfo: ProductInfo;
  onReset: () => void;
  onExportHTML: () => void;
  onExportPNG?: () => void;
}> = ({ pageData, productInfo, onReset, onExportHTML, onExportPNG }) => {
  const { sections, brandColors, baseImage } = pageData;
  const { state, isEditMode } = useEditor();

  // 에디터 테마 또는 원본 브랜드 컬러 사용
  const primaryColor = state.colorTheme?.primary || brandColors?.primary || '#4CAF50';
  const secondaryColor = state.colorTheme?.secondary || brandColors?.secondary || '#81C784';
  const isDailyLife = productInfo.wellnessData?.goal === 'daily-life';

  return (
    <div className="min-h-screen bg-white">
      {/* 에디터 툴바 */}
      <EditorToolbar
        onExportHTML={onExportHTML}
        onExportPNG={onExportPNG}
        onReset={onReset}
      />

      {/* 플로팅 텍스트 툴바 (편집 모드에서만) */}
      {isEditMode && <FloatingToolbar />}

      {/* 프리뷰 컨테이너 - 모바일 퍼스트 (좁은 폭) */}
      <main
        id="preview-content"
        className={`max-w-lg mx-auto bg-white pt-20 ${isEditMode ? 'pl-12' : ''}`}
      >
        {/* 섹션 목록 */}
        {sections.map((section, index) => (
          <BlockWrapper key={index} id={`block-${index}`}>
            <SectionItem
              section={section}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              baseImage={baseImage}
              index={index}
              isDailyLife={isDailyLife}
            />
          </BlockWrapper>
        ))}

        {/* 푸터 */}
        <BlockWrapper id={`block-${sections.length}`}>
          <footer className="py-12 px-4 bg-slate-900 text-center">
            <div className="max-w-lg mx-auto">
              {/* 브랜드 로고 */}
              <div
                className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                <i className="fa-solid fa-leaf text-white text-xl" />
              </div>

              {/* 제품명 */}
              <h3 className="text-white font-bold text-lg mb-2">
                {productInfo.name}
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                {productInfo.category}
              </p>

              {/* 최종 CTA */}
              <button
                className="w-full max-w-xs px-8 py-4 text-white font-bold rounded-xl transition-all hover:brightness-110 active:scale-[0.98] shadow-lg mb-6"
                style={{ backgroundColor: primaryColor }}
              >
                지금 바로 구매하기
              </button>

              {/* 신뢰 배지 */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <i className="fa-solid fa-shield-check" />
                  <span>안전결제</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <i className="fa-solid fa-truck-fast" />
                  <span>빠른배송</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <i className="fa-solid fa-rotate-left" />
                  <span>교환/환불</span>
                </div>
              </div>

              {/* 크레딧 */}
              <div className="pt-6 border-t border-slate-800">
                <p className="text-slate-500 text-xs">
                  Powered by <span className="font-semibold">NanoDetail AI</span>
                </p>
                <p className="text-slate-600 text-xs mt-1">
                  Generated with Gemini
                </p>
              </div>
            </div>
          </footer>
        </BlockWrapper>
      </main>

      {/* 플로팅 버튼 (미리보기 모드에서만) */}
      {!isEditMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 no-print">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-arrow-up" />
          </button>
        </div>
      )}

      {/* 프린트 스타일 */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

// 메인 Preview 컴포넌트 (EditorProvider로 래핑)
const Preview: React.FC<PreviewProps> = (props) => {
  // 초기 테마를 브랜드 컬러로 설정
  const initialTheme = {
    id: 'brand',
    name: '브랜드 컬러',
    primary: props.pageData.brandColors?.primary || '#4CAF50',
    secondary: props.pageData.brandColors?.secondary || '#81C784'
  };

  return (
    <EditorProvider>
      <PreviewContent {...props} />
    </EditorProvider>
  );
};

export default Preview;
