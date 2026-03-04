/**
 * Tipos principales para el escandallo de obra
 */

// Categorías disponibles en el escandallo
export type CategoryKey = 'materiales' | 'manoObra' | 'maquinaria' | 'costesIndirectos' | 'otros';

// Línea de concepto individual
export interface LineItem {
  id: string;
  concepto: string;
  unidad: string; // m2, ud, hora, día, saco, etc.
  cantidad: number;
  precioUnitario: number;
  totalLinea: number; // calculado: cantidad * precioUnitario
}

// Márgenes opcionales (porcentajes)
export interface Margins {
  margenMaterialesPct: number; // Aplicado solo a materiales
  margenManoObraPct: number; // Aplicado solo a mano de obra
  gastosGeneralesPct: number; // Aplicado sobre coste directo
  beneficioPct: number; // Aplicado sobre coste directo + GG
}

// Opciones de exportación a Excel
export interface ExportOptions {
  nombreArchivo: string; // Nombre personalizado del archivo Excel (obligatorio)
  fechaInicio?: Date; // Fecha de inicio estimada del proyecto
  duracionValor?: number; // Cantidad de días o semanas
  duracionUnidad?: 'dias' | 'semanas'; // Unidad de la duración
}

// Estructura de datos por categoría
export interface CategoryData {
  materiales: LineItem[];
  manoObra: LineItem[];
  maquinaria: LineItem[];
  costesIndirectos: LineItem[];
  otros: LineItem[]; // Gastos sin margen aplicado
}

// Input para cálculo de estimación
export interface EstimateInput {
  categories: CategoryData;
  margins: Margins;
  exportOptions?: ExportOptions; // Opciones opcionales para exportación
}

// Subtotales por categoría antes de márgenes
export interface Subtotals {
  materiales: number;
  manoObra: number;
  maquinaria: number;
  costesIndirectos: number;
  otros: number; // Gastos sin márgenes
  costeDirecto: number; // Suma de las 4 primeras categorías (base para márgenes)
}

// Resultado del cálculo de estimación
export interface EstimateResult {
  subtotals: Subtotals;
  
  // Incrementos por márgenes
  incrementoMateriales: number; // margenMaterialesPct aplicado a subtotal materiales
  incrementoManoObra: number; // margenManoObraPct aplicado a subtotal mano de obra
  gastosGenerales: number; // gastosGeneralesPct aplicado a coste directo
  beneficio: number; // beneficioPct aplicado a (coste directo + GG)
  
  // Totales finales
  costeTotal: number; // Suma de todos los subtotales sin márgenes
  presupuestoFinal: number; // Coste total + todos los incrementos
}

// Metadata de categorías para UI
export interface CategoryMetadata {
  key: CategoryKey;
  label: string;
  description: string;
  color: string; // TailwindCSS color class
  defaultUnit: string;
}

// Estado de validación
export interface ValidationError {
  category?: CategoryKey;
  lineId?: string;
  field?: string;
  message: string;
}
