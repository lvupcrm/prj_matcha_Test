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
    <div className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-lg mx-auto">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-8 h-[2px]" style={{ backgroundColor: secondaryColor }} />
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: primaryColor }}
          >
            FAQ
          </span>
          <span className="w-8 h-[2px]" style={{ backgroundColor: secondaryColor }} />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8 break-keep leading-snug">
          {title}
        </h2>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200"
              style={{
                borderColor: openItemId === item.id ? primaryColor : undefined,
                boxShadow: openItemId === item.id ? `0 4px 12px ${primaryColor}20` : undefined
              }}
            >
              {/* Question */}
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left"
              >
                {isEditable && editingItemId === item.id ? (
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => handleQuestionEdit(item.id, e.target.value)}
                    onBlur={() => setEditingItemId(null)}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 text-slate-800 font-semibold text-sm bg-transparent border-b-2 border-dashed focus:outline-none"
                    style={{ borderColor: primaryColor }}
                    autoFocus
                  />
                ) : (
                  <span
                    className="flex-1 text-slate-800 font-semibold text-sm pr-4"
                    onDoubleClick={() => isEditable && setEditingItemId(item.id)}
                  >
                    {item.question}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  {isEditable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="w-6 h-6 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                      <i className="fa-solid fa-times text-xs" />
                    </button>
                  )}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      openItemId === item.id ? 'rotate-180' : ''
                    }`}
                    style={{
                      backgroundColor: openItemId === item.id ? primaryColor : `${primaryColor}15`,
                      color: openItemId === item.id ? 'white' : primaryColor
                    }}
                  >
                    <i className="fa-solid fa-chevron-down text-xs" />
                  </div>
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openItemId === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-5">
                  <div
                    className="w-full h-[1px] mb-4"
                    style={{ backgroundColor: `${primaryColor}20` }}
                  />
                  {isEditable ? (
                    <textarea
                      value={item.answer}
                      onChange={(e) => handleAnswerEdit(item.id, e.target.value)}
                      className="w-full text-slate-600 text-sm leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-200 focus:outline-none focus:border-opacity-50 resize-none"
                      style={{ borderColor: primaryColor }}
                      rows={3}
                    />
                  ) : (
                    <p className="text-slate-600 text-sm leading-relaxed">
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
            className="mt-4 w-full py-3 border-2 border-dashed rounded-xl text-sm font-medium transition-all hover:bg-slate-50"
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
        <p className="text-center text-xs text-slate-400 mt-6">
          더 궁금한 점이 있으신가요? 고객센터로 문의해주세요.
        </p>
      </div>
    </div>
  );
};

export default FAQSection;
