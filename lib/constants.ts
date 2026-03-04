/**
 * Constantes y configuración de categorías
 */

import { CategoryMetadata, CategoryKey } from './types';

export const CATEGORIES: CategoryMetadata[] = [
  {
    key: 'materiales',
    label: 'Materiales',
    description: 'Materiales de construcción y suministros',
    color: 'blue',
    defaultUnit: 'm²',
  },
  {
    key: 'manoObra',
    label: 'Mano de Obra',
    description: 'Costes de personal y profesionales',
    color: 'green',
    defaultUnit: 'hora',
  },
  {
    key: 'maquinaria',
    label: 'Maquinaria',
    description: 'Alquiler y uso de equipos',
    color: 'orange',
    defaultUnit: 'día',
  },
  {
    key: 'costesIndirectos',
    label: 'Costes Indirectos',
    description: 'Gastos generales de la obra',
    color: 'purple',
    defaultUnit: 'ud',
  },
  {
    key: 'otros',
    label: 'Otros',
    description: 'Gastos adicionales sin margen aplicado',
    color: 'red',
    defaultUnit: 'ud',
  },
];

// Helper para obtener metadata por key
export const getCategoryMetadata = (key: CategoryKey): CategoryMetadata => {
  const cat = CATEGORIES.find((c) => c.key === key);
  if (!cat) throw new Error(`Category ${key} not found`);
  return cat;
};

// Unidades comunes por categoría
export const COMMON_UNITS: Record<CategoryKey, string[]> = {
  materiales: ['m²', 'm³', 'm', 'ud', 'kg', 'l', 'saco'],
  manoObra: ['hora', 'día', 'mes', 'ud'],
  maquinaria: ['día', 'hora', 'semana', 'mes', 'ud'],
  costesIndirectos: ['ud', '%', 'global'],
  otros: ['ud', 'global', 'kg'],
};

// Valores por defecto para márgenes
export const DEFAULT_MARGINS = {
  margenMaterialesPct: 0,
  margenManoObraPct: 0,
  gastosGeneralesPct: 0,
  beneficioPct: 0,
};
