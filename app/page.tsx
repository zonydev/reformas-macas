'use client';

import React, { useReducer, useState } from 'react';
import { CategoryData, LineItem, Margins, CategoryKey } from '@/lib/types';
import { DEFAULT_MARGINS, CATEGORIES, getCategoryMetadata } from '@/lib/constants';
import { calculateEstimate, createEmptyLineItem, duplicateLineItem, updateLineTotal } from '@/lib/costing';
import { generateId } from '@/lib/utils';
import { CategorySection } from '@/components/CategorySection';
import { MarginsSection } from '@/components/MarginsSection';
import { SummaryPanel } from '@/components/SummaryPanel';

// Estado inicial
const initialCategories: CategoryData = {
  materiales: [],
  manoObra: [],
  maquinaria: [],
  costesIndirectos: [],
};

// Tipos de acciones para el reducer
type Action =
  | { type: 'ADD_ITEM'; category: CategoryKey }
  | { type: 'UPDATE_ITEM'; category: CategoryKey; id: string; item: LineItem }
  | { type: 'DELETE_ITEM'; category: CategoryKey; id: string }
  | { type: 'DUPLICATE_ITEM'; category: CategoryKey; id: string }
  | { type: 'RESET' };

// Reducer para manejar el estado de categorías
const categoriesReducer = (state: CategoryData, action: Action): CategoryData => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const metadata = getCategoryMetadata(action.category);
      const newItem = createEmptyLineItem(generateId(), metadata.defaultUnit);
      return {
        ...state,
        [action.category]: [...state[action.category], newItem],
      };
    }

    case 'UPDATE_ITEM': {
      return {
        ...state,
        [action.category]: state[action.category].map((item) =>
          item.id === action.id ? updateLineTotal(action.item) : item
        ),
      };
    }

    case 'DELETE_ITEM': {
      return {
        ...state,
        [action.category]: state[action.category].filter((item) => item.id !== action.id),
      };
    }

    case 'DUPLICATE_ITEM': {
      const itemToDuplicate = state[action.category].find((item) => item.id === action.id);
      if (!itemToDuplicate) return state;
      
      const duplicated = duplicateLineItem(itemToDuplicate, generateId());
      return {
        ...state,
        [action.category]: [...state[action.category], duplicated],
      };
    }

    case 'RESET': {
      return initialCategories;
    }

    default:
      return state;
  }
};

export default function Home() {
  const [categories, dispatch] = useReducer(categoriesReducer, initialCategories);
  const [margins, setMargins] = useState<Margins>(DEFAULT_MARGINS);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Calcular estimación en tiempo real
  const estimate = calculateEstimate(categories, margins);

  // Handler para exportar a Excel
  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categories,
          margins,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al generar el Excel');
      }

      // Descargar el archivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Nombre del archivo con fecha
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
      a.download = `escandallo-${dateStr}-${timeStr}.xlsx`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting:', error);
      setExportError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsExporting(false);
    }
  };

  // Handler para reset
  const handleReset = () => {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos?')) {
      dispatch({ type: 'RESET' });
      setMargins(DEFAULT_MARGINS);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Escandallo de Obra
              </h1>
              <p className="text-gray-600 mt-1">
                Gestión de costes y presupuestos para proyectos de reforma
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              🔄 Resetear
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal - Categorías */}
          <div className="lg:col-span-2 space-y-6">
            {CATEGORIES.map((cat) => (
              <CategorySection
                key={cat.key}
                categoryKey={cat.key}
                items={categories[cat.key]}
                onAddItem={() => dispatch({ type: 'ADD_ITEM', category: cat.key })}
                onUpdateItem={(id, item) =>
                  dispatch({ type: 'UPDATE_ITEM', category: cat.key, id, item })
                }
                onDeleteItem={(id) =>
                  dispatch({ type: 'DELETE_ITEM', category: cat.key, id })
                }
                onDuplicateItem={(id) =>
                  dispatch({ type: 'DUPLICATE_ITEM', category: cat.key, id })
                }
              />
            ))}

            {/* Sección de márgenes */}
            <MarginsSection margins={margins} onUpdate={setMargins} />

            {/* Botón de exportación */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Generar Excel
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Exporta el escandallo completo a un archivo Excel con 5 hojas: General, Materiales, Mano de Obra, Maquinaria y Costes Indirectos.
              </p>
              
              {exportError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                  <strong>Error: </strong>{exportError}
                </div>
              )}

              <button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generando Excel...
                  </span>
                ) : (
                  '📊 Generar y Descargar Excel'
                )}
              </button>
            </div>
          </div>

          {/* Columna lateral - Resumen */}
          <div className="lg:col-span-1">
            <SummaryPanel estimate={estimate} margins={margins} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Escandallo de Obra - Aplicación interna para gestión de reformas
          </p>
        </div>
      </footer>
    </div>
  );
}
