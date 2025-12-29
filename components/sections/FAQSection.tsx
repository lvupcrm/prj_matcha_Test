import React, { useState } from 'react';
import { FAQItem } from '../../types';

interface FAQSectionProps {
  title: string;
  items: FAQItem[];
  primaryColor: string;
  secondaryColor?: string;
  isEditable?: boolean;
  onUpdate?: (items: FAQItem[]) => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({
  title,
  items,
  primaryColor,
  secondaryColor = '#81C784',
  isEditable = false,
  onUpdate
}) => {
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  const handleQuestionEdit = (id: string, newQuestion: string) => {
    if (!onUpdate) return;
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, question: newQuestion } : item
    );
    onUpdate(updatedItems);
  };

  const handleAnswerEdit = (id: string, newAnswer: string) => {
    if (!onUpdate) return;
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, answer: newAnswer } : item
    );
    onUpdate(updatedItems);
  };

  const handleAddItem = () => {
    if (!onUpdate) return;
    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      question: '새로운 질문을 입력하세요',
      answer: '답변을 입력하세요'
    };
    onUpdate([...items, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    if (!onUpdate) return;
    onUpdate(items.filter(item => item.id !== id));
  };

  return (
    <div className="bg-gradient-to-b from-black to-slate-900 py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Section Label */}
        <div className="text-center mb-12">
          <span
            className="inline-block px-5 py-2 rounded-full text-sm font-bold tracking-wide mb-6"
            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
          >
            FAQ
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight break-keep">
            {title}
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="bg-slate-800/50 rounded-3xl border border-slate-700/50 overflow-hidden transition-all duration-300"
              style={{
                borderColor: openItemId === item.id ? primaryColor : undefined,
                boxShadow: openItemId === item.id ? `0 8px 32px ${primaryColor}30` : undefined
              }}
            >
              {/* Question */}
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  {/* Number Badge */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg font-black"
                    style={{
                      backgroundColor: openItemId === item.id ? primaryColor : `${primaryColor}20`,
                      color: openItemId === item.id ? 'white' : primaryColor
                    }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  {isEditable && editingItemId === item.id ? (
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => handleQuestionEdit(item.id, e.target.value)}
                      onBlur={() => setEditingItemId(null)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 text-white font-bold text-lg bg-transparent border-b-2 border-dashed focus:outline-none"
                      style={{ borderColor: primaryColor }}
                      autoFocus
                    />
                  ) : (
                    <span
                      className="flex-1 text-white font-bold text-lg"
                      onDoubleClick={() => isEditable && setEditingItemId(item.id)}
                    >
                      {item.question}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {isEditable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                    >
                      <i className="fa-solid fa-times text-sm" />
                    </button>
                  )}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openItemId === item.id ? 'rotate-180' : ''
                    }`}
                    style={{
                      backgroundColor: openItemId === item.id ? 'white' : `${primaryColor}20`,
                      color: openItemId === item.id ? primaryColor : primaryColor
                    }}
                  >
                    <i className="fa-solid fa-chevron-down" />
                  </div>
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openItemId === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <div
                    className="w-full h-[1px] mb-5"
                    style={{ backgroundColor: `${primaryColor}30` }}
                  />
                  {isEditable ? (
                    <textarea
                      value={item.answer}
                      onChange={(e) => handleAnswerEdit(item.id, e.target.value)}
                      className="w-full text-slate-300 text-base leading-relaxed bg-slate-900/50 rounded-xl p-4 border border-slate-700 focus:outline-none focus:border-opacity-50 resize-none"
                      style={{ borderColor: primaryColor }}
                      rows={3}
                    />
                  ) : (
                    <p className="text-slate-300 text-base leading-relaxed pl-14">
                      {item.answer}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button (Editable Mode) */}
        {isEditable && (
          <button
            onClick={handleAddItem}
            className="mt-6 w-full py-4 border-2 border-dashed rounded-2xl text-base font-bold transition-all hover:bg-slate-800/50"
            style={{
              borderColor: `${primaryColor}50`,
              color: primaryColor
            }}
          >
            <i className="fa-solid fa-plus mr-2" />
            질문 추가하기
          </button>
        )}

        {/* Help Text */}
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 rounded-full border border-slate-700/50">
            <i className="fa-solid fa-headset text-slate-400" />
            <span className="text-slate-400 text-sm">
              더 궁금한 점이 있으신가요? <span className="text-white font-semibold">고객센터</span>로 문의해주세요
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
