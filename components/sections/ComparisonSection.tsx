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
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
          style={{ backgroundColor: isOurs ? primaryColor : '#374151' }}
        >
          <i className={`fa-solid fa-check text-lg ${isOurs ? 'text-white' : 'text-slate-500'}`} />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto bg-slate-800">
          <i className="fa-solid fa-xmark text-lg text-slate-600" />
        </div>
      );
    }
    return (
      <span className={`text-base ${isOurs ? 'font-bold text-white' : 'text-slate-500'}`}>
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
    if (typeof currentValue === 'boolean') {
      handleItemUpdate(index, field, !currentValue);
    }
  };

  const advantageCount = items.filter(item => {
    const ourValue = item.ourProduct;
    const theirValue = item.competitor;
    if (typeof ourValue === 'boolean' && typeof theirValue === 'boolean') {
      return ourValue && !theirValue;
    }
    return false;
  }).length;

  return (
    <div className="bg-gradient-to-b from-slate-900 to-black py-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Section Label */}
        <div className="text-center mb-12">
          <span
            className="inline-block px-5 py-2 rounded-full text-sm font-bold tracking-wide mb-6"
            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
          >
            VS COMPARISON
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight break-keep">
            {title}
          </h2>
        </div>

        {/* Comparison Table */}
        <div className="bg-slate-900/80 rounded-3xl overflow-hidden border border-slate-800">
          {/* Table Header */}
          <div className="grid grid-cols-3 border-b border-slate-800">
            <div className="p-5 text-center border-r border-slate-800">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                기능
              </span>
            </div>
            <div
              className="p-5 text-center border-r border-slate-800"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              {isEditable && editingField === 'ourProductName' ? (
                <input
                  type="text"
                  value={ourProductName}
                  onChange={(e) => onUpdate?.({ ourProductName: e.target.value })}
                  onBlur={() => setEditingField(null)}
                  className="text-base font-black text-center bg-transparent border-b-2 border-dashed focus:outline-none w-full"
                  style={{ color: primaryColor, borderColor: primaryColor }}
                  autoFocus
                />
              ) : (
                <div
                  className="flex flex-col items-center gap-2"
                  onDoubleClick={() => isEditable && setEditingField('ourProductName')}
                >
                  <i
                    className="fa-solid fa-crown text-lg"
                    style={{ color: primaryColor }}
                  />
                  <span
                    className="text-base font-black"
                    style={{ color: primaryColor }}
                  >
                    {ourProductName}
                  </span>
                </div>
              )}
            </div>
            <div className="p-5 text-center bg-slate-800/50">
              {isEditable && editingField === 'competitorName' ? (
                <input
                  type="text"
                  value={competitorName}
                  onChange={(e) => onUpdate?.({ competitorName: e.target.value })}
                  onBlur={() => setEditingField(null)}
                  className="text-base font-medium text-slate-400 text-center bg-transparent border-b-2 border-dashed border-slate-600 focus:outline-none w-full"
                  autoFocus
                />
              ) : (
                <span
                  className="text-base font-medium text-slate-400"
                  onDoubleClick={() => isEditable && setEditingField('competitorName')}
                >
                  {competitorName}
                </span>
              )}
            </div>
          </div>

          {/* Table Body */}
          <div>
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-3 items-center border-b border-slate-800 last:border-b-0 hover:bg-slate-800/30 transition-colors"
              >
                {/* Feature Name */}
                <div className="p-5 border-r border-slate-800">
                  {isEditable && editingItemIndex === index && editingItemField === 'feature' ? (
                    <input
                      type="text"
                      value={item.feature}
                      onChange={(e) => handleItemUpdate(index, 'feature', e.target.value)}
                      onBlur={() => {
                        setEditingItemIndex(null);
                        setEditingItemField(null);
                      }}
                      className="text-base text-white bg-transparent border-b-2 border-dashed focus:outline-none w-full"
                      style={{ borderColor: primaryColor }}
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <span
                        className="text-base text-white font-semibold"
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
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-all"
                        >
                          <i className="fa-solid fa-times text-xs" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Our Product Value */}
                <div
                  className="p-5 text-center cursor-pointer border-r border-slate-800"
                  style={{ backgroundColor: `${primaryColor}08` }}
                  onClick={() => toggleValue(index, 'ourProduct')}
                >
                  {renderValue(item.ourProduct, true)}
                </div>

                {/* Competitor Value */}
                <div
                  className="p-5 text-center bg-slate-800/30 cursor-pointer"
                  onClick={() => toggleValue(index, 'competitor')}
                >
                  {renderValue(item.competitor, false)}
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Button */}
          {isEditable && (
            <div className="p-5 border-t border-slate-800">
              <button
                onClick={handleAddItem}
                className="w-full py-3 border-2 border-dashed rounded-xl text-base font-bold transition-all hover:bg-slate-800/50"
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
          className="mt-8 p-6 rounded-2xl text-center border"
          style={{
            backgroundColor: `${primaryColor}10`,
            borderColor: `${primaryColor}30`
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: primaryColor }}
            >
              <i className="fa-solid fa-trophy text-white text-xl" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white mb-2">
            {ourProductName}이 더 나은 이유
          </h3>
          <p className="text-slate-400">
            <span className="text-3xl font-black" style={{ color: primaryColor }}>{advantageCount}</span>
            <span className="text-lg ml-2">개 항목에서 경쟁 제품 대비 우위</span>
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-slate-600 mt-6">
          * 2024년 기준 공개 사양 비교
        </p>
      </div>
    </div>
  );
};

export default ComparisonSection;
