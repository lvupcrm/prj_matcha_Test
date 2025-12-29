import React, { useState } from 'react';
import { ColorTheme, PRESET_THEMES } from '../../types';
import { useEditor } from './EditorProvider';

interface ColorThemePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ColorThemePanel: React.FC<ColorThemePanelProps> = ({ isOpen, onClose }) => {
  const { state, updateTheme } = useEditor();
  const [customPrimary, setCustomPrimary] = useState(state.colorTheme.primary);
  const [customSecondary, setCustomSecondary] = useState(state.colorTheme.secondary);
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

  const handlePresetSelect = (theme: ColorTheme) => {
    updateTheme(theme);
    setCustomPrimary(theme.primary);
    setCustomSecondary(theme.secondary);
  };

  const handleCustomApply = () => {
    updateTheme({
      id: 'custom',
      name: '커스텀',
      primary: customPrimary,
      secondary: customSecondary
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">컬러 테마 설정</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('preset')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'preset'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            프리셋 테마
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'custom'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            커스텀 컬러
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'preset' ? (
            <div className="grid grid-cols-2 gap-3">
              {PRESET_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handlePresetSelect(theme)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    state.colorTheme.id === theme.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-6 h-6 rounded-full shadow-inner"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full shadow-inner"
                      style={{ backgroundColor: theme.secondary }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{theme.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  메인 컬러
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={customPrimary}
                      onChange={(e) => setCustomPrimary(e.target.value)}
                      className="w-14 h-14 rounded-xl cursor-pointer border-0 p-0"
                    />
                    <div
                      className="absolute inset-1 rounded-lg pointer-events-none border-2 border-white shadow-sm"
                      style={{ backgroundColor: customPrimary }}
                    />
                  </div>
                  <input
                    type="text"
                    value={customPrimary}
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                    placeholder="#4CAF50"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  보조 컬러
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={customSecondary}
                      onChange={(e) => setCustomSecondary(e.target.value)}
                      className="w-14 h-14 rounded-xl cursor-pointer border-0 p-0"
                    />
                    <div
                      className="absolute inset-1 rounded-lg pointer-events-none border-2 border-white shadow-sm"
                      style={{ backgroundColor: customSecondary }}
                    />
                  </div>
                  <input
                    type="text"
                    value={customSecondary}
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                    placeholder="#81C784"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-xl bg-slate-50">
                <span className="text-xs text-slate-500 block mb-2">미리보기</span>
                <div className="flex items-center gap-3">
                  <button
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: customPrimary }}
                  >
                    메인 버튼
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: customSecondary }}
                  >
                    보조 버튼
                  </button>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={handleCustomApply}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                커스텀 컬러 적용
              </button>
            </div>
          )}
        </div>

        {/* Current Theme Display */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <span className="text-sm text-slate-600">현재 테마</span>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full shadow-inner border border-white"
                style={{ backgroundColor: state.colorTheme.primary }}
              />
              <div
                className="w-6 h-6 rounded-full shadow-inner border border-white"
                style={{ backgroundColor: state.colorTheme.secondary }}
              />
              <span className="text-sm font-medium text-slate-700 ml-1">
                {state.colorTheme.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorThemePanel;
