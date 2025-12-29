import React, { ReactNode, useEffect } from 'react';
import { BlockHeight, BlockPadding } from '../../types';
import { useEditor } from './EditorProvider';

interface BlockWrapperProps {
  id: string;
  children: ReactNode;
  backgroundColor?: string;
}

// 높이 매핑
const heightMap: Record<BlockHeight, string> = {
  auto: 'h-auto',
  small: 'min-h-[200px]',
  medium: 'min-h-[400px]',
  large: 'min-h-[600px]',
  custom: 'h-auto'
};

// 패딩 매핑
const paddingMap: Record<BlockPadding, string> = {
  none: 'p-0',
  small: 'p-2',
  medium: 'p-4',
  large: 'p-8'
};

// 기본 스타일
const defaultStyle = {
  height: 'auto' as BlockHeight,
  backgroundColor: '#ffffff',
  padding: 'medium' as BlockPadding
};

const BlockWrapper: React.FC<BlockWrapperProps> = ({ id, children, backgroundColor }) => {
  const { state, selectBlock, updateBlockStyle, isEditMode } = useEditor();
  const block = state.blocks.find(b => b.id === id);
  const isSelected = state.selectedBlockId === id;

  // 블록이 없으면 자동 생성
  useEffect(() => {
    if (!block) {
      updateBlockStyle(id, { backgroundColor: backgroundColor || '#ffffff' });
    }
  }, [id, block, updateBlockStyle, backgroundColor]);

  // 현재 스타일 (블록이 없으면 기본값 사용)
  const currentStyle = block?.style || defaultStyle;

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.stopPropagation();
    selectBlock(id);
  };

  const handleHeightChange = (height: BlockHeight) => {
    updateBlockStyle(id, { height });
  };

  const handlePaddingChange = (padding: BlockPadding) => {
    updateBlockStyle(id, { padding });
  };

  const handleBackgroundChange = (color: string) => {
    updateBlockStyle(id, { backgroundColor: color });
  };

  if (!isEditMode) {
    return <div style={{ backgroundColor }}>{children}</div>;
  }

  return (
    <div
      className={`relative group transition-all duration-200 ${
        isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
      }`}
      onClick={handleClick}
      style={{ backgroundColor: currentStyle.backgroundColor || backgroundColor || '#ffffff' }}
    >
      {/* 드래그 핸들 */}
      <div
        className={`absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing ${
          isSelected ? 'opacity-100' : ''
        }`}
      >
        <div className="w-8 h-8 bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600">
          <i className="fa-solid fa-grip-vertical" />
        </div>
      </div>

      {/* 블록 툴바 (선택 시 표시) */}
      {isSelected && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-2 flex items-center gap-2">
            {/* 높이 조절 */}
            <div className="flex items-center gap-1 px-2 border-r border-slate-200">
              <span className="text-xs text-slate-400 mr-1">높이</span>
              {(['auto', 'small', 'medium', 'large'] as BlockHeight[]).map((h) => (
                <button
                  key={h}
                  onClick={(e) => { e.stopPropagation(); handleHeightChange(h); }}
                  className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                    currentStyle.height === h
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'hover:bg-slate-100 text-slate-500'
                  }`}
                  title={h}
                >
                  {h === 'auto' ? 'A' : h === 'small' ? 'S' : h === 'medium' ? 'M' : 'L'}
                </button>
              ))}
            </div>

            {/* 패딩 조절 */}
            <div className="flex items-center gap-1 px-2 border-r border-slate-200">
              <span className="text-xs text-slate-400 mr-1">여백</span>
              {(['none', 'small', 'medium', 'large'] as BlockPadding[]).map((p) => (
                <button
                  key={p}
                  onClick={(e) => { e.stopPropagation(); handlePaddingChange(p); }}
                  className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                    currentStyle.padding === p
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'hover:bg-slate-100 text-slate-500'
                  }`}
                  title={p}
                >
                  {p === 'none' ? '0' : p === 'small' ? 'S' : p === 'medium' ? 'M' : 'L'}
                </button>
              ))}
            </div>

            {/* 배경색 선택 */}
            <div className="flex items-center gap-1 px-2">
              <span className="text-xs text-slate-400 mr-1">배경</span>
              {['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', state.colorTheme.primary + '10', state.colorTheme.primary + '20'].map((color) => (
                <button
                  key={color}
                  onClick={(e) => { e.stopPropagation(); handleBackgroundChange(color); }}
                  className={`w-6 h-6 rounded-md border-2 transition-all ${
                    currentStyle.backgroundColor === color
                      ? 'border-indigo-500 scale-110'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 블록 인디케이터 */}
      <div
        className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } bg-slate-900/70 text-white`}
      >
        블록 {id.split('-')[1]}
      </div>

      {/* 컨텐츠 */}
      <div className={`${heightMap[currentStyle.height]} ${paddingMap[currentStyle.padding]}`}>
        {children}
      </div>
    </div>
  );
};

export default BlockWrapper;
