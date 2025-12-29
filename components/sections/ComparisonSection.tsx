import React, { useState } from 'react';
import { ComparisonItem } from '../../types';

interface ComparisonSectionProps {
  title: string;
  ourProductName: string;
  competitorName: string;
  items: ComparisonItem[];
  primaryColor: string;
  secondaryColor?: string;
  isEditable?: boolean;
  onUpdate?: (data: {
    ourProductName?: string;
    competitorName?: string;
    items?: ComparisonItem[];
  }) => void;
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  title,
  ourProductName,
  competitorName,
  items,
  primaryColor,
  secondaryColor = '#81C784',
  isEditable = false,
  onUpdate
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [editingItemField, setEditingItemField] = useState<'feature' | 'our' | 'competitor' | null>(null);

  const renderValue = (value: string | boolean, isOurs: boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center mx-auto"
          style={{ backgroundColor: isOurs ? primaryColor : '#E5E7EB' }}
        >
          <i className={`fa-solid fa-check text-sm ${isOurs ? 'text-white' : 'text-slate-400'}`} />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto bg-slate-100">
          <i className="fa-solid fa-xmark text-sm text-slate-400" />
        </div>
      );
    }
    return (
      <span className={`text-sm ${isOurs ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
        {value}
      </span>
    );
  };

  const handleItemUpdate = (index: number, field: keyof ComparisonItem, value: string | boolean) => {
    if (!onUpdate) return;
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    onUpdate({ items: updatedItems });
  };

  const handleAddItem = () => {
    if (!onUpdate) return;
    onUpdate({
      items: [...items, { feature: '새 기능', ourProduct: true, competitor: false }]
    });
  };

  const handleDeleteItem = (index: number) => {
    if (!onUpdate) return;
    onUpdate({ items: items.filter((_, i) => i !== index) });
  };

  const toggleValue = (index: number, field: 'ourProduct' | 'competitor') => {
    if (!onUpdate || !isEditable) return;
    const currentValue = items[index][field];
    // Toggle between true/false/string
    if (typeof currentValue === 'boolean') {
      handleItemUpdate(index, field, !currentValue);
    }
  };

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-lg mx-auto">
        {/* Section Label */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-8 h-[2px]" style={{ backgroundColor: secondaryColor }} />
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: primaryColor }}
          >
            Comparison
          </span>
          <span className="w-8 h-[2px]" style={{ backgroundColor: secondaryColor }} />
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8 break-keep leading-snug">
          {title}
        </h2>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
          {/* Table Header */}
          <div className="grid grid-cols-3 border-b border-slate-100">
            <div className="p-4 text-center">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                기능
              </span>
            </div>
            <div
              className="p-4 text-center"
              style={{ backgroundColor: `${primaryColor}10` }}
            >
              {isEditable && editingField === 'ourProductName' ? (
                <input
                  type="text"
                  value={ourProductName}
                  onChange={(e) => onUpdate?.({ ourProductName: e.target.value })}
                  onBlur={() => setEditingField(null)}
                  className="text-sm font-bold text-center bg-transparent border-b-2 border-dashed focus:outline-none w-full"
                  style={{ color: primaryColor, borderColor: primaryColor }}
                  autoFocus
                />
              ) : (
                <div
                  className="flex flex-col items-center gap-1"
                  onDoubleClick={() => isEditable && setEditingField('ourProductName')}
                >
                  <i
                    className="fa-solid fa-crown text-sm"
                    style={{ color: primaryColor }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ color: primaryColor }}
                  >
                    {ourProductName}
                  </span>
                </div>
              )}
            </div>
            <div className="p-4 text-center bg-slate-50">
              {isEditable && editingField === 'competitorName' ? (
                <input
                  type="text"
                  value={competitorName}
                  onChange={(e) => onUpdate?.({ competitorName: e.target.value })}
                  onBlur={() => setEditingField(null)}
                  className="text-sm font-medium text-slate-500 text-center bg-transparent border-b-2 border-dashed border-slate-300 focus:outline-none w-full"
                  autoFocus
                />
              ) : (
                <span
                  className="text-sm font-medium text-slate-500"
                  onDoubleClick={() => isEditable && setEditingField('competitorName')}
                >
                  {competitorName}
                </span>
              )}
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 items-center hover:bg-slate-50 transition-colors"
              >
                {/* Feature Name */}
                <div className="p-4">
                  {isEditable && editingItemIndex === index && editingItemField === 'feature' ? (
                    <input
                      type="text"
                      value={item.feature}
                      onChange={(e) => handleItemUpdate(index, 'feature', e.target.value)}
                      onBlur={() => {
                        setEditingItemIndex(null);
                        setEditingItemField(null);
                      }}
                      className="text-sm text-slate-700 bg-transparent border-b-2 border-dashed focus:outline-none w-full"
                      style={{ borderColor: primaryColor }}
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm text-slate-700 font-medium"
                        onDoubleClick={() => {
                          if (isEditable) {
                            setEditingItemIndex(index);
                            setEditingItemField('feature');
                          }
                        }}
                      >
                        {item.feature}
                      </span>
                      {isEditable && (
                        <button
                          onClick={() => handleDeleteItem(index)}
                          className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-all"
                        >
                          <i className="fa-solid fa-times text-xs" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Our Product Value */}
                <div
                  className="p-4 text-center cursor-pointer"
                  style={{ backgroundColor: `${primaryColor}05` }}
                  onClick={() => toggleValue(index, 'ourProduct')}
                >
                  {renderValue(item.ourProduct, true)}
                </div>

                {/* Competitor Value */}
                <div
                  className="p-4 text-center bg-slate-50/50 cursor-pointer"
                  onClick={() => toggleValue(index, 'competitor')}
                >
                  {renderValue(item.competitor, false)}
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Button */}
          {isEditable && (
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={handleAddItem}
                className="w-full py-2 border-2 border-dashed rounded-lg text-sm font-medium transition-all hover:bg-slate-50"
                style={{
                  borderColor: `${primaryColor}50`,
                  color: primaryColor
                }}
              >
                <i className="fa-solid fa-plus mr-2" />
                비교 항목 추가
              </button>
            </div>
          )}
        </div>

        {/* Summary Badge */}
        <div
          className="mt-6 p-4 rounded-xl text-center"
          style={{ backgroundColor: `${primaryColor}10` }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <i className="fa-solid fa-check-double" style={{ color: primaryColor }} />
            <span className="font-bold text-slate-800">
              {ourProductName}이 더 나은 이유
            </span>
          </div>
          <p className="text-sm text-slate-600">
            {items.filter(item => {
              const ourValue = item.ourProduct;
              const theirValue = item.competitor;
              if (typeof ourValue === 'boolean' && typeof theirValue === 'boolean') {
                return ourValue && !theirValue;
              }
              return false;
            }).length}개 항목에서 경쟁 제품 대비 우위
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-slate-400 mt-4">
          * 2024년 기준 공개 사양 비교
        </p>
      </div>
    </div>
  );
};

export default ComparisonSection;
