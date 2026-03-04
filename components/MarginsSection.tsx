'use client';

import React from 'react';
import { Margins } from '@/lib/types';

interface MarginsSectionProps {
  margins: Margins;
  onUpdate: (margins: Margins) => void;
}

export const MarginsSection: React.FC<MarginsSectionProps> = ({
  margins,
  onUpdate,
}) => {
  const handleChange = (field: keyof Margins, value: string) => {
    const numValue = parseFloat(value) || 0;
    onUpdate({
      ...margins,
      [field]: Math.max(0, Math.min(100, numValue)), // Limitar entre 0-100
    });
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold text-indigo-800 mb-4">Márgenes y Beneficio</h2>
      <p className="text-sm text-gray-600 mb-4">
        Define los porcentajes de margen que se aplicarán a cada categoría y conceptos generales
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Margen Materiales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Margen sobre Materiales (%)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={margins.margenMaterialesPct}
              onChange={(e) => handleChange('margenMaterialesPct', e.target.value)}
              min="0"
              max="100"
              step="0.1"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <span className="text-gray-600 font-medium">%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Se aplica solo al subtotal de materiales
          </p>
        </div>

        {/* Margen Mano de Obra */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Margen sobre Mano de Obra (%)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={margins.margenManoObraPct}
              onChange={(e) => handleChange('margenManoObraPct', e.target.value)}
              min="0"
              max="100"
              step="0.1"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <span className="text-gray-600 font-medium">%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Se aplica solo al subtotal de mano de obra
          </p>
        </div>

        {/* Gastos Generales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gastos Generales (%)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={margins.gastosGeneralesPct}
              onChange={(e) => handleChange('gastosGeneralesPct', e.target.value)}
              min="0"
              max="100"
              step="0.1"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <span className="text-gray-600 font-medium">%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Se aplica sobre el coste directo total
          </p>
        </div>

        {/* Beneficio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beneficio Industrial (%)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={margins.beneficioPct}
              onChange={(e) => handleChange('beneficioPct', e.target.value)}
              min="0"
              max="100"
              step="0.1"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <span className="text-gray-600 font-medium">%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Se aplica sobre (coste directo + gastos generales)
          </p>
        </div>
      </div>
    </div>
  );
};
