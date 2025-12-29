import React, { useState } from 'react';

interface PNGExporterProps {
  elementId: string;
  filename: string;
}

/**
 * PNG 내보내기 유틸리티
 * html2canvas를 사용하여 DOM 요소를 PNG로 변환
 */
export const exportToPNG = async (elementId: string, filename: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // html2canvas 동적 로드
  const html2canvas = (await import('html2canvas')).default;

  // 캔버스 생성
  const canvas = await html2canvas(element, {
    scale: 2, // 고해상도
    useCORS: true, // CORS 이미지 허용
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    // 스크롤 위치 무시
    scrollX: 0,
    scrollY: -window.scrollY,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
  });

  // PNG로 다운로드
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
};

/**
 * PNG 내보내기 버튼 컴포넌트
 */
const PNGExporter: React.FC<PNGExporterProps> = ({ elementId, filename }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      await exportToPNG(elementId, filename);
    } catch (err) {
      console.error('PNG export failed:', err);
      setError('PNG 내보내기에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <>
            <i className="fa-solid fa-spinner fa-spin" />
            내보내는 중...
          </>
        ) : (
          <>
            <i className="fa-solid fa-image" />
            PNG 다운로드
          </>
        )}
      </button>

      {error && (
        <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 whitespace-nowrap">
          <i className="fa-solid fa-exclamation-triangle mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default PNGExporter;
