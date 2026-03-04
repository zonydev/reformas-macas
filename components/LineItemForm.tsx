'use client';

import React from 'react';
import { LineItem } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface LineItemFormProps {
  item: LineItem;
  unitsOptions: string[];
  onUpdate: (item: LineItem) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const LineItemForm: React.FC<LineItemFormProps> = ({
  item,
  unitsOptions,
  onUpdate,
  onDelete,
  onDuplicate,
}) => {
  const handleChange = (field: keyof LineItem, value: string | number) => {
    const updated = { ...item, [field]: value };
    
    // Recalcular total si cambia cantidad o precio
    if (field === 'cantidad' || field === 'precioUnitario') {
      updated.totalLinea = updated.cantidad * updated.precioUnitario;
    }
    
    onUpdate(updated);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Concepto */}
        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Concepto
          </label>
          <input
            type="text"
            value={item.concepto}
            onChange={(e) => handleChange('concepto', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Descripción del concepto"
          />
        </div>

        {/* Unidad */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unidad
          </label>
          <select
            value={item.unidad}
            onChange={(e) => handleChange('unidad', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {unitsOptions.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        {/* Cantidad */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad
          </label>
          <input
            type="number"
            value={item.cantidad}
            onChange={(e) => handleChange('cantidad', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Precio Unitario */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio/Ud (€)
          </label>
          <input
            type="number"
            value={item.precioUnitario}
            onChange={(e) =>
              handleChange('precioUnitario', parseFloat(e.target.value) || 0)
            }
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Total (calculado) */}
        <div className="md:col-span-2 flex items-end">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-right font-semibold">
              {formatCurrency(item.totalLinea)}
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-2 mt-3 justify-end">
        <button
          onClick={onDuplicate}
          className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
          title="Duplicar línea"
        >
          Duplicar
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          title="Eliminar línea"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
