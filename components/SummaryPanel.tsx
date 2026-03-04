'use client';

import React from 'react';
import { EstimateResult } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface SummaryPanelProps {
  estimate: EstimateResult;
  margins: { margenMaterialesPct: number; margenManoObraPct: number; gastosGeneralesPct: number; beneficioPct: number };
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ estimate, margins }) => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 border-2 border-gray-300 rounded-lg p-6 shadow-lg sticky top-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumen General</h2>

      {/* Subtotales por categoría */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-300">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Materiales:</span>
          <span className="font-semibold">{formatCurrency(estimate.subtotals.materiales)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Mano de Obra:</span>
          <span className="font-semibold">{formatCurrency(estimate.subtotals.manoObra)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Maquinaria:</span>
          <span className="font-semibold">{formatCurrency(estimate.subtotals.maquinaria)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Costes Indirectos:</span>
          <span className="font-semibold">{formatCurrency(estimate.subtotals.costesIndirectos)}</span>
        </div>
      </div>

      {/* Coste directo */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-300">
        <span className="font-semibold text-gray-700">Coste Directo:</span>
        <span className="text-xl font-bold text-gray-800">
          {formatCurrency(estimate.subtotals.costeDirecto)}
        </span>
      </div>

      {/* Incrementos por márgenes */}
      {(estimate.incrementoMateriales > 0 || 
        estimate.incrementoManoObra > 0 || 
        estimate.gastosGenerales > 0 || 
        estimate.beneficio > 0) && (
        <div className="space-y-2 mb-4 pb-4 border-b border-gray-300">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Incrementos:</h3>
          
          {estimate.incrementoMateriales > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Margen Materiales ({formatPercentage(margins.margenMaterialesPct)}):
              </span>
              <span className="font-semibold text-blue-600">
                +{formatCurrency(estimate.incrementoMateriales)}
              </span>
            </div>
          )}
          
          {estimate.incrementoManoObra > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Margen Mano Obra ({formatPercentage(margins.margenManoObraPct)}):
              </span>
              <span className="font-semibold text-green-600">
                +{formatCurrency(estimate.incrementoManoObra)}
              </span>
            </div>
          )}
          
          {estimate.gastosGenerales > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Gastos Generales ({formatPercentage(margins.gastosGeneralesPct)}):
              </span>
              <span className="font-semibold text-orange-600">
                +{formatCurrency(estimate.gastosGenerales)}
              </span>
            </div>
          )}
          
          {estimate.beneficio > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Beneficio ({formatPercentage(margins.beneficioPct)}):
              </span>
              <span className="font-semibold text-purple-600">
                +{formatCurrency(estimate.beneficio)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Presupuesto final */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Presupuesto Final:</span>
          <span className="text-3xl font-bold">
            {formatCurrency(estimate.presupuestoFinal)}
          </span>
        </div>
        {estimate.presupuestoFinal !== estimate.costeTotal && (
          <div className="text-xs text-primary-100 mt-2">
            Incremento total: {formatCurrency(estimate.presupuestoFinal - estimate.costeTotal)}
          </div>
        )}
      </div>
    </div>
  );
};
