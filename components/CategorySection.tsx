'use client';

import React from 'react';
import { LineItem, CategoryKey } from '@/lib/types';
import { COMMON_UNITS, getCategoryMetadata } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { LineItemForm } from './LineItemForm';

interface CategorySectionProps {
  categoryKey: CategoryKey;
  items: LineItem[];
  onAddItem: () => void;
  onUpdateItem: (id: string, item: LineItem) => void;
  onDeleteItem: (id: string) => void;
  onDuplicateItem: (id: string) => void;
}

const COLOR_CLASSES: Record<string, { bg: string; border: string; text: string }> = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
  },
};

export const CategorySection: React.FC<CategorySectionProps> = ({
  categoryKey,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onDuplicateItem,
}) => {
  const metadata = getCategoryMetadata(categoryKey);
  const unitsOptions = COMMON_UNITS[categoryKey];
  const colorClasses = COLOR_CLASSES[metadata.color];

  const subtotal = items.reduce((sum, item) => sum + item.totalLinea, 0);

  return (
    <div
      className={`border-2 ${colorClasses.border} rounded-lg overflow-hidden shadow-md`}
    >
      {/* Header */}
      <div className={`${colorClasses.bg} px-6 py-4 border-b ${colorClasses.border}`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className={`text-xl font-bold ${colorClasses.text}`}>
              {metadata.label}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{metadata.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Subtotal</div>
            <div className={`text-2xl font-bold ${colorClasses.text}`}>
              {formatCurrency(subtotal)}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 bg-white">
        {/* Lista de líneas */}
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay conceptos añadidos. Haz clic en "Añadir Concepto" para empezar.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <LineItemForm
                key={item.id}
                item={item}
                unitsOptions={unitsOptions}
                onUpdate={(updatedItem) => onUpdateItem(item.id, updatedItem)}
                onDelete={() => onDeleteItem(item.id)}
                onDuplicate={() => onDuplicateItem(item.id)}
              />
            ))}
          </div>
        )}

        {/* Botón añadir */}
        <div className="mt-4">
          <button
            onClick={onAddItem}
            className={`w-full py-3 px-4 border-2 border-dashed ${colorClasses.border} ${colorClasses.text} rounded-lg hover:${colorClasses.bg} font-medium transition-colors`}
          >
            + Añadir Concepto
          </button>
        </div>
      </div>
    </div>
  );
};
