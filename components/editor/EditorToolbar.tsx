import React, { useState } from 'react';
import { useEditor } from './EditorProvider';
import ColorThemePanel from './ColorThemePanel';
import TextReplaceModal from './TextReplaceModal';

interface EditorToolbarProps {
  onExportHTML?: () => void;
  onExportPNG?: () => void;
  onReset?: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onExportHTML,
  onExportPNG,
  onReset
}) => {
  const { state, setMode, isEditMode } = useEditor();
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);

  const handleTextReplace = (find: string, replace: string, replaceAll: boolean) => {
    const previewContent = document.getElementById('preview-content');
    if (!previewContent) return;

    const walker = document.createTreeWalker(
      previewContent,
      NodeFilter.SHOW_TEXT,
      null
    );

    const nodesToUpdate: { node: Text; newText: string }[] = [];
    let node: Text | null;
    let replacedCount = 0;

    while ((node = walker.nextNode() as Text | null)) {
      if (node.textContent) {
        const regex = replaceAll ? new RegExp(find, 'gi') : new RegExp(find, 'i');
        if (regex.test(node.textContent)) {
          if (replaceAll) {
            nodesToUpdate.push({
              node,
              newText: node.textContent.replace(new RegExp(find, 'gi'), replace)
            });
          } else if (replacedCount === 0) {
            nodesToUpdate.push({
              node,
              newText: node.textContent.replace(regex, replace)
            });
            replacedCount++;
          }
        }
      }
    }

    nodesToUpdate.forEach(({ node, newText }) => {
      node.textContent = newText;
    });
  };

  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-2 flex items-center gap-2">
          {/* 편집/미리보기 토글 */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setMode('view')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !isEditMode
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <i className="fa-solid fa-eye mr-2" />
              미리보기
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isEditMode
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <i className="fa-solid fa-pen-to-square mr-2" />
              편집 모드
            </button>
          </div>

          <div className="w-px h-8 bg-slate-200" />

          {/* 에디터 도구들 (편집 모드에서만) */}
          {isEditMode && (
            <>
              <button
                onClick={() => setShowColorPanel(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                title="컬러 테마"
              >
                <div className="flex items-center gap-1">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: state.colorTheme.primary }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm -ml-2"
                    style={{ backgroundColor: state.colorTheme.secondary }}
                  />
                </div>
                <span className="text-sm text-slate-600">테마</span>
              </button>

              <button
                onClick={() => setShowReplaceModal(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                title="텍스트 바꾸기"
              >
                <i className="fa-solid fa-magnifying-glass-arrow-right text-slate-500" />
                <span className="text-sm text-slate-600">바꾸기</span>
              </button>

              <div className="w-px h-8 bg-slate-200" />
            </>
          )}

          {/* 내보내기 도구들 */}
          <button
            onClick={onExportHTML}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            title="HTML로 내보내기"
          >
            <i className="fa-solid fa-code text-slate-500" />
            <span className="text-sm text-slate-600">HTML</span>
          </button>

          <button
            onClick={onExportPNG}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            title="PNG로 내보내기"
          >
            <i className="fa-solid fa-image text-slate-500" />
            <span className="text-sm text-slate-600">PNG</span>
          </button>

          <div className="w-px h-8 bg-slate-200" />

          {/* 처음으로 버튼 */}
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-500 transition-colors"
            title="처음으로"
          >
            <i className="fa-solid fa-rotate-left" />
            <span className="text-sm">처음으로</span>
          </button>
        </div>

        {/* 편집 모드 인디케이터 */}
        {isEditMode && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-medium shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              편집 모드 활성화
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ColorThemePanel
        isOpen={showColorPanel}
        onClose={() => setShowColorPanel(false)}
      />
      <TextReplaceModal
        isOpen={showReplaceModal}
        onClose={() => setShowReplaceModal(false)}
        onReplace={handleTextReplace}
      />
    </>
  );
};

export default EditorToolbar;
