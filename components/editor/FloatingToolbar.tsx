import React, { useState, useEffect, useRef } from 'react';
import { TextStyle } from '../../types';
import { useEditor } from './EditorProvider';

interface FloatingToolbarProps {
  onStyleChange?: (style: Partial<TextStyle>) => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ onStyleChange }) => {
  const { state, isEditMode } = useEditor();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<TextStyle>({
    fontSize: 'base',
    color: '#1e293b',
    alignment: 'left',
    fontWeight: 'normal'
  });
  const toolbarRef = useRef<HTMLDivElement>(null);

  // 텍스트 선택 감지
  useEffect(() => {
    if (!isEditMode) {
      setVisible(false);
      return;
    }

    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        });
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, [isEditMode]);

  // 클릭 외부 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        // 선택이 없으면 숨기기
        const selection = window.getSelection();
        if (!selection || selection.toString().trim().length === 0) {
          setVisible(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStyleChange = (key: keyof TextStyle, value: string) => {
    const newStyle = { ...currentStyle, [key]: value };
    setCurrentStyle(newStyle);
    onStyleChange?.({ [key]: value });
  };

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  if (!visible || !isEditMode) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[100] transform -translate-x-1/2 -translate-y-full"
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <div className="bg-slate-900 rounded-xl shadow-xl p-2 flex items-center gap-1">
        {/* 폰트 크기 */}
        <div className="flex items-center gap-1 px-2 border-r border-slate-700">
          {(['xs', 'sm', 'base', 'lg', 'xl', '2xl'] as TextStyle['fontSize'][]).map((size) => (
            <button
              key={size}
              onClick={() => {
                handleStyleChange('fontSize', size);
                const sizeMap: Record<string, string> = {
                  xs: '0.75rem', sm: '0.875rem', base: '1rem',
                  lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem'
                };
                applyFormatting('fontSize', sizeMap[size] ? '7' : '3');
              }}
              className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                currentStyle.fontSize === size
                  ? 'bg-white text-slate-900'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title={size}
            >
              {size === 'xs' ? 'XS' : size === 'sm' ? 'S' : size === 'base' ? 'M' : size === 'lg' ? 'L' : size === 'xl' ? 'XL' : '2X'}
            </button>
          ))}
        </div>

        {/* 글자 굵기 */}
        <div className="flex items-center gap-1 px-2 border-r border-slate-700">
          <button
            onClick={() => {
              handleStyleChange('fontWeight', 'normal');
              applyFormatting('removeFormat');
            }}
            className={`w-7 h-7 rounded-md text-sm transition-colors ${
              currentStyle.fontWeight === 'normal'
                ? 'bg-white text-slate-900'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            title="일반"
          >
            N
          </button>
          <button
            onClick={() => {
              handleStyleChange('fontWeight', 'medium');
              applyFormatting('bold');
            }}
            className={`w-7 h-7 rounded-md text-sm font-medium transition-colors ${
              currentStyle.fontWeight === 'medium'
                ? 'bg-white text-slate-900'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            title="중간"
          >
            M
          </button>
          <button
            onClick={() => {
              handleStyleChange('fontWeight', 'bold');
              applyFormatting('bold');
            }}
            className={`w-7 h-7 rounded-md text-sm font-bold transition-colors ${
              currentStyle.fontWeight === 'bold'
                ? 'bg-white text-slate-900'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            title="굵게"
          >
            B
          </button>
        </div>

        {/* 정렬 */}
        <div className="flex items-center gap-1 px-2 border-r border-slate-700">
          <button
            onClick={() => {
              handleStyleChange('alignment', 'left');
              applyFormatting('justifyLeft');
            }}
            className={`w-7 h-7 rounded-md transition-colors ${
              currentStyle.alignment === 'left'
                ? 'bg-white text-slate-900'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            title="왼쪽 정렬"
          >
            <i className="fa-solid fa-align-left text-xs" />
          </button>
          <button
            onClick={() => {
              handleStyleChange('alignment', 'center');
              applyFormatting('justifyCenter');
            }}
            className={`w-7 h-7 rounded-md transition-colors ${
              currentStyle.alignment === 'center'
                ? 'bg-white text-slate-900'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            title="가운데 정렬"
          >
            <i className="fa-solid fa-align-center text-xs" />
          </button>
          <button
            onClick={() => {
              handleStyleChange('alignment', 'right');
              applyFormatting('justifyRight');
            }}
            className={`w-7 h-7 rounded-md transition-colors ${
              currentStyle.alignment === 'right'
                ? 'bg-white text-slate-900'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
            title="오른쪽 정렬"
          >
            <i className="fa-solid fa-align-right text-xs" />
          </button>
        </div>

        {/* 색상 */}
        <div className="flex items-center gap-1 px-2">
          {['#1e293b', '#ef4444', '#22c55e', '#3b82f6', '#eab308', state.colorTheme.primary].map((color) => (
            <button
              key={color}
              onClick={() => {
                handleStyleChange('color', color);
                applyFormatting('foreColor', color);
              }}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                currentStyle.color === color
                  ? 'border-white scale-110'
                  : 'border-transparent hover:border-slate-500'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* 화살표 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full">
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-900" />
      </div>
    </div>
  );
};

export default FloatingToolbar;
