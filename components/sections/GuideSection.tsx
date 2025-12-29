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
    <div className="bg-black py-20 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div
          className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-10 blur-[100px]"
          style={{ backgroundColor: primaryColor }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10 blur-[80px]"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Section Label */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <i className="fa-solid fa-user-doctor text-2xl" style={{ color: primaryColor }} />
          </div>
          <span
            className="inline-block px-5 py-2 rounded-full text-sm font-bold tracking-wide mb-6"
            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
          >
            EXPERT GUIDE
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight break-keep">
            {title}
          </h2>
        </div>

        {/* Expert Card */}
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-slate-800">
          {/* Expert Profile */}
          <div className="flex items-center gap-5 mb-8 pb-6 border-b border-slate-800">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{ backgroundColor: primaryColor }}
            >
              <i className="fa-solid fa-user-tie text-white text-3xl" />
            </div>
            <div className="flex-1">
              {isEditable && editingField === 'expertName' ? (
                <input
                  type="text"
                  value={expertName}
                  onChange={(e) => onUpdate?.({ expertName: e.target.value })}
                  onBlur={() => setEditingField(null)}
                  className="text-2xl font-black text-white bg-transparent border-b-2 border-dashed focus:outline-none w-full"
                  style={{ borderColor: primaryColor }}
                  autoFocus
                />
              ) : (
                <h3
                  className="text-2xl font-black text-white"
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
                  className="text-base font-medium bg-transparent border-b-2 border-dashed focus:outline-none w-full mt-1"
                  style={{ color: primaryColor, borderColor: primaryColor }}
                  autoFocus
                />
              ) : (
                <p
                  className="text-base font-semibold mt-1"
                  style={{ color: primaryColor }}
                  onDoubleClick={() => isEditable && setEditingField('expertTitle')}
                >
                  {expertTitle}
                </p>
              )}
            </div>
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <i className="fa-solid fa-certificate text-lg" style={{ color: primaryColor }} />
              </div>
              <span className="text-xs text-slate-500">인증됨</span>
            </div>
          </div>

          {/* Expert Tips */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <i className="fa-solid fa-lightbulb text-amber-400 text-lg" />
              </div>
              <span className="text-lg font-bold text-white">전문가 추천 팁</span>
            </div>
            <div className="space-y-4">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-black"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {index + 1}
                  </div>
                  {isEditable && editingTipIndex === index ? (
                    <div className="flex-1 flex items-center gap-3">
                      <input
                        type="text"
                        value={tip}
                        onChange={(e) => handleTipEdit(index, e.target.value)}
                        onBlur={() => setEditingTipIndex(null)}
                        className="flex-1 text-white bg-transparent border-b-2 border-dashed focus:outline-none"
                        style={{ borderColor: primaryColor }}
                        autoFocus
                      />
                      <button
                        onClick={() => handleDeleteTip(index)}
                        className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30"
                      >
                        <i className="fa-solid fa-times text-sm" />
                      </button>
                    </div>
                  ) : (
                    <p
                      className="flex-1 text-white font-medium leading-relaxed"
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
                  className="w-full py-4 border-2 border-dashed rounded-2xl text-base font-bold transition-all hover:bg-slate-800/50"
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
        </div>

        {/* Recommendation Box */}
        <div
          className="relative rounded-3xl p-8 border-2 overflow-hidden"
          style={{
            borderColor: primaryColor,
            background: `linear-gradient(135deg, ${primaryColor}15 0%, transparent 100%)`
          }}
        >
          {/* Quote Icon */}
          <div
            className="absolute -top-4 left-8 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            <i className="fa-solid fa-quote-left text-white text-sm" />
          </div>

          {/* Recommendation Text */}
          {isEditable ? (
            <textarea
              value={recommendation}
              onChange={(e) => onUpdate?.({ recommendation: e.target.value })}
              className="w-full text-white text-xl leading-relaxed italic bg-transparent focus:outline-none resize-none pt-4"
              rows={3}
            />
          ) : (
            <p className="text-white text-xl md:text-2xl leading-relaxed italic pt-4">
              "{recommendation}"
            </p>
          )}

          {/* Expert Signature */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-700/50">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: primaryColor }}
            >
              <i className="fa-solid fa-signature text-white text-sm" />
            </div>
            <span className="text-slate-400 font-medium">- {expertName}</span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <div className="flex items-center gap-2 px-5 py-3 bg-slate-900/80 rounded-full border border-slate-800">
            <i className="fa-solid fa-shield-check" style={{ color: primaryColor }} />
            <span className="text-white text-sm font-medium">검증된 전문가</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 bg-slate-900/80 rounded-full border border-slate-800">
            <i className="fa-solid fa-medal" style={{ color: primaryColor }} />
            <span className="text-white text-sm font-medium">실전 경험 10년+</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 bg-slate-900/80 rounded-full border border-slate-800">
            <i className="fa-solid fa-award" style={{ color: primaryColor }} />
            <span className="text-white text-sm font-medium">공인 자격 보유</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideSection;
