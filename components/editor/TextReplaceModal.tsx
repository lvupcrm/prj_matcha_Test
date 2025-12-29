import React, { useState } from 'react';

interface TextReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplace: (find: string, replace: string, replaceAll: boolean) => void;
}

const TextReplaceModal: React.FC<TextReplaceModalProps> = ({ isOpen, onClose, onReplace }) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!findText) return;

    setIsSearching(true);

    // DOM에서 텍스트 찾기
    const previewContent = document.getElementById('preview-content');
    if (previewContent) {
      const text = previewContent.innerText;
      const regex = new RegExp(findText, 'gi');
      const matches = text.match(regex);
      setMatchCount(matches ? matches.length : 0);
    }

    setIsSearching(false);
  };

  const handleReplace = (replaceAll: boolean) => {
    if (!findText) return;
    onReplace(findText, replaceText, replaceAll);
    if (replaceAll) {
      setMatchCount(0);
    } else {
      handleSearch(); // 재검색하여 남은 개수 업데이트
    }
  };

  const handleClose = () => {
    setFindText('');
    setReplaceText('');
    setMatchCount(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-magnifying-glass-arrow-right text-indigo-500" />
            텍스트 찾기 및 바꾸기
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Find Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              찾을 텍스트
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="찾을 단어나 문장 입력"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleSearch}
                disabled={!findText || isSearching}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                {isSearching ? (
                  <i className="fa-solid fa-spinner fa-spin" />
                ) : (
                  '검색'
                )}
              </button>
            </div>
            {matchCount > 0 && (
              <p className="text-xs text-emerald-600 mt-2">
                <i className="fa-solid fa-check-circle mr-1" />
                {matchCount}개의 일치하는 항목을 찾았습니다.
              </p>
            )}
            {findText && matchCount === 0 && !isSearching && (
              <p className="text-xs text-amber-600 mt-2">
                <i className="fa-solid fa-exclamation-triangle mr-1" />
                일치하는 항목이 없습니다.
              </p>
            )}
          </div>

          {/* Replace Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              바꿀 텍스트
            </label>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="새로운 단어나 문장 입력"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Preview */}
          {findText && replaceText && (
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 block mb-2">미리보기</span>
              <div className="text-sm">
                <span className="text-red-500 line-through">{findText}</span>
                <i className="fa-solid fa-arrow-right mx-2 text-slate-400 text-xs" />
                <span className="text-emerald-600 font-medium">{replaceText}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-white transition-colors"
          >
            취소
          </button>
          <button
            onClick={() => handleReplace(false)}
            disabled={!findText || matchCount === 0}
            className="flex-1 py-2.5 bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            하나 바꾸기
          </button>
          <button
            onClick={() => handleReplace(true)}
            disabled={!findText || matchCount === 0}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            모두 바꾸기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextReplaceModal;
