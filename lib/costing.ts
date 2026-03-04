/**
 * Funciones de cálculo de costes para el escandallo
 * 
 * LÓGICA DE CÁLCULO:
 * 
 * 1. Subtotales por categoría: suma de (cantidad × precio unitario) de cada línea
 * 
 * 2. Coste Directo = Materiales + Mano de Obra + Maquinaria + Costes Indirectos
 *    (NOTA: "Otros" se calcula aparte y se suma al final sin márgenes)
 * 
 * 3. Aplicación de márgenes (solo sobre Coste Directo):
 *    - Margen Materiales: se aplica SOLO sobre el subtotal de Materiales
 *    - Margen Mano de Obra: se aplica SOLO sobre el subtotal de Mano de Obra
 *    - Gastos Generales: se aplica sobre el Coste Directo (base amplia)
 *    - Beneficio: se aplica sobre (Coste Directo + Gastos Generales)
 * 
 * 4. Coste Total = Coste Directo + Otros (sin márgenes)
 * 
 * 5. Presupuesto Final = Coste Total + todos los incrementos
 * 
 * Esta lógica modular permite entender qué margen se aplica a qué partida.
 */

import { CategoryData, EstimateResult, LineItem, Margins, Subtotals } from './types';
import { round2 } from './utils';

/**
 * Calcula el total de una línea individual
 */
export const calculateLineTotal = (cantidad: number, precioUnitario: number): number => {
  return round2(cantidad * precioUnitario);
};

/**
 * Calcula el subtotal de una lista de líneas
 */
export const calculateCategorySubtotal = (items: LineItem[]): number => {
  const total = items.reduce((sum, item) => sum + item.totalLinea, 0);
  return round2(total);
};

/**
 * Calcula todos los subtotales por categoría
 */
export const calculateSubtotals = (categories: CategoryData): Subtotals => {
  const materiales = calculateCategorySubtotal(categories.materiales);
  const manoObra = calculateCategorySubtotal(categories.manoObra);
  const maquinaria = calculateCategorySubtotal(categories.maquinaria);
  const costesIndirectos = calculateCategorySubtotal(categories.costesIndirectos);
  const otros = calculateCategorySubtotal(categories.otros);
  
  // Coste directo = suma de las 4 categorías originales (no incluye "otros" para márgenes)
  const costeDirecto = round2(materiales + manoObra + maquinaria + costesIndirectos);
  
  return {
    materiales,
    manoObra,
    maquinaria,
    costesIndirectos,
    otros,
    costeDirecto,
  };
};

/**
 * Calcula el resultado completo de la estimación incluyendo márgenes
 */
export const calculateEstimate = (
  categories: CategoryData,
  margins: Margins
): EstimateResult => {
  // 1. Calcular subtotales
  const subtotals = calculateSubtotals(categories);
  
  // 2. Calcular incrementos por márgenes
  
  // Margen sobre materiales (solo afecta a materiales)
  const incrementoMateriales = round2(
    (subtotals.materiales * margins.margenMaterialesPct) / 100
  );
  
  // Margen sobre mano de obra (solo afecta a mano de obra)
  const incrementoManoObra = round2(
    (subtotals.manoObra * margins.margenManoObraPct) / 100
  );
  
  // Gastos generales: aplicado sobre el coste directo
  const gastosGenerales = round2(
    (subtotals.costeDirecto * margins.gastosGeneralesPct) / 100
  );
  
  // Base para beneficio: coste directo + gastos generales
  const baseParaBeneficio = round2(subtotals.costeDirecto + gastosGenerales);
  
  // Beneficio: aplicado sobre (coste directo + gastos generales)
  const beneficio = round2(
    (baseParaBeneficio * margins.beneficioPct) / 100
  );
  
  // 3. Calcular totales finales
  // Coste total INCLUYE "otros" pero "otros" no recibe márgenes
  const costeTotal = round2(subtotals.costeDirecto + subtotals.otros);
  
  const presupuestoFinal = round2(
    costeTotal + 
    incrementoMateriales + 
    incrementoManoObra + 
    gastosGenerales + 
    beneficio
  );
  
  return {
    subtotals,
    incrementoMateriales,
    incrementoManoObra,
    gastosGenerales,
    beneficio,
    costeTotal,
    presupuestoFinal,
  };
};

/**
 * Crea una línea vacía con valores por defecto
 */
export const createEmptyLineItem = (id: string, defaultUnit: string = 'ud'): LineItem => {
  return {
    id,
    concepto: '',
    unidad: defaultUnit,
    cantidad: 0,
    precioUnitario: 0,
    totalLinea: 0,
  };
};

/**
 * Actualiza el total de una línea basándose en cantidad y precio
 */
export const updateLineTotal = (item: Partial<LineItem>): LineItem => {
  const cantidad = item.cantidad ?? 0;
  const precioUnitario = item.precioUnitario ?? 0;
  const totalLinea = calculateLineTotal(cantidad, precioUnitario);
  
  return {
    id: item.id ?? '',
    concepto: item.concepto ?? '',
    unidad: item.unidad ?? 'ud',
    cantidad,
    precioUnitario,
    totalLinea,
  };
};

/**
 * Duplica una línea con nuevo ID
 */
export const duplicateLineItem = (item: LineItem, newId: string): LineItem => {
  return {
    ...item,
    id: newId,
  };
};
