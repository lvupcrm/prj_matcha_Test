import React, { useState } from 'react';

interface GuideSectionProps {
  title: string;
  expertName: string;
  expertTitle: string;
  tips: string[];
  recommendation: string;
  primaryColor: string;
  secondaryColor?: string;
  isEditable?: boolean;
  onUpdate?: (data: {
    expertName?: string;
    expertTitle?: string;
    tips?: string[];
    recommendation?: string;
  }) => void;
}

const GuideSection: React.FC<GuideSectionProps> = ({
  title,
  expertName,
  expertTitle,
  tips,
  recommendation,
  primaryColor,
  secondaryColor = '#81C784',
  isEditable = false,
  onUpdate
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingTipIndex, setEditingTipIndex] = useState<number | null>(null);

  const handleTipEdit = (index: number, newTip: string) => {
    if (!onUpdate) return;
    const updatedTips = [...tips];
    updatedTips[index] = newTip;
    onUpdate({ tips: updatedTips });
  };

  const handleAddTip = () => {
    if (!onUpdate) return;
    onUpdate({ tips: [...tips, '새로운 팁을 입력하세요'] });
  };

  const handleDeleteTip = (index: number) => {
    if (!onUpdate) return;
    onUpdate({ tips: tips.filter((_, i) => i !== index) });
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-lg mx-auto">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-8 h-[2px]" style={{ backgroundColor: secondaryColor }} />
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: primaryColor }}
          >
            Expert Guide
          </span>
          <span className="w-8 h-[2px]" style={{ backgroundColor: secondaryColor }} />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8 break-keep leading-snug">
          {title}
        </h2>

        {/* Expert Card */}
        <div
          className="bg-gradient-to-br rounded-3xl p-6 mb-6 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}10 0%, ${secondaryColor}20 100%)`
          }}
        >
          {/* Expert Profile */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              <i className="fa-solid fa-user-tie text-white text-2xl" />
            </div>
            <div className="flex-1">
              {isEditable && editingField === 'expertName' ? (
                <input
                  type="text"
                  value={expertName}
                  onChange={(e) => onUpdate?.({ expertName: e.target.value })}
                  onBlur={() => setEditingField(null)}
                  className="text-lg font-bold text-slate-900 bg-transparent border-b-2 border-dashed focus:outline-none w-full"
                  style={{ borderColor: primaryColor }}
                  autoFocus
                />
              ) : (
                <h3
                  className="text-lg font-bold text-slate-900"
                  onDoubleClick={() => isEditable && setEditingField('expertName')}
                >
                  {expertName}
                </h3>
              )}
              {isEditable && editingField === 'expertTitle' ? (
                <input
                  type="text"
                  value={expertTitle}
                  onChange={(e) => onUpdate?.({ expertTitle: e.target.value })}
                  onBlur={() => setEditingField(null)}
                  className="text-sm bg-transparent border-b-2 border-dashed focus:outline-none w-full"
                  style={{ color: primaryColor, borderColor: primaryColor }}
                  autoFocus
                />
              ) : (
                <p
                  className="text-sm font-medium"
                  style={{ color: primaryColor }}
                  onDoubleClick={() => isEditable && setEditingField('expertTitle')}
                >
                  {expertTitle}
                </p>
              )}
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <i className="fa-solid fa-certificate" style={{ color: primaryColor }} />
            </div>
          </div>

          {/* Expert Tips */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <i className="fa-solid fa-lightbulb text-amber-500" />
              <span className="text-sm font-bold text-slate-700">전문가 팁</span>
            </div>
            {tips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                  style={{ backgroundColor: primaryColor }}
                >
                  {index + 1}
                </div>
                {isEditable && editingTipIndex === index ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => handleTipEdit(index, e.target.value)}
                      onBlur={() => setEditingTipIndex(null)}
                      className="flex-1 text-sm text-slate-700 bg-transparent border-b-2 border-dashed focus:outline-none"
                      style={{ borderColor: primaryColor }}
                      autoFocus
                    />
                    <button
                      onClick={() => handleDeleteTip(index)}
                      className="w-6 h-6 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100"
                    >
                      <i className="fa-solid fa-times text-xs" />
                    </button>
                  </div>
                ) : (
                  <p
                    className="flex-1 text-sm text-slate-700 leading-relaxed"
                    onDoubleClick={() => isEditable && setEditingTipIndex(index)}
                  >
                    {tip}
                  </p>
                )}
              </div>
            ))}

            {/* Add Tip Button */}
            {isEditable && (
              <button
                onClick={handleAddTip}
                className="w-full py-3 border-2 border-dashed rounded-xl text-sm font-medium transition-all hover:bg-white"
                style={{
                  borderColor: `${primaryColor}50`,
                  color: primaryColor
                }}
              >
                <i className="fa-solid fa-plus mr-2" />
                팁 추가하기
              </button>
            )}
          </div>
        </div>

        {/* Recommendation Box */}
        <div
          className="relative rounded-2xl p-5 border-2"
          style={{
            borderColor: primaryColor,
            backgroundColor: `${primaryColor}05`
          }}
        >
          {/* Quote Icon */}
          <div
            className="absolute -top-3 left-5 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            <i className="fa-solid fa-quote-left text-white text-xs" />
          </div>

          {/* Recommendation Text */}
          {isEditable ? (
            <textarea
              value={recommendation}
              onChange={(e) => onUpdate?.({ recommendation: e.target.value })}
              className="w-full text-slate-700 text-sm leading-relaxed italic bg-transparent focus:outline-none resize-none"
              rows={3}
            />
          ) : (
            <p className="text-slate-700 text-sm leading-relaxed italic pt-2">
              "{recommendation}"
            </p>
          )}

          {/* Expert Signature */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-xs text-slate-500">- {expertName}</span>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <i className="fa-solid fa-shield-check" style={{ color: primaryColor }} />
            <span>검증된 전문가</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <i className="fa-solid fa-medal" style={{ color: primaryColor }} />
            <span>실전 경험 10년+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideSection;
