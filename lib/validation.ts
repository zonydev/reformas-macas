/**
 * Validación de datos con Zod
 */

import { z } from 'zod';

// Schema para una línea de concepto
export const lineItemSchema = z.object({
  id: z.string().min(1),
  concepto: z.string().min(1, 'El concepto es obligatorio'),
  unidad: z.string(),
  cantidad: z.number().min(0, 'La cantidad no puede ser negativa').finite(),
  precioUnitario: z.number().min(0, 'El precio no puede ser negativo').finite(),
  totalLinea: z.number().finite(),
});

// Schema para márgenes
export const marginsSchema = z.object({
  margenMaterialesPct: z.number().min(0).max(100).finite(),
  margenManoObraPct: z.number().min(0).max(100).finite(),
  gastosGeneralesPct: z.number().min(0).max(100).finite(),
  beneficioPct: z.number().min(0).max(100).finite(),
});

// Schema para opciones de exportación
export const exportOptionsSchema = z.object({
  fechaInicio: z.string().datetime().optional(), // ISO 8601 string
  duracionValor: z.number().int().positive().optional(),
  duracionUnidad: z.enum(['dias', 'semanas']).optional(),
  nombreArchivo: z.string()
    .min(1, 'El nombre del archivo es obligatorio')
    .max(200, 'El nombre del archivo no puede exceder 200 caracteres')
    .refine(
      (val) => {
        // Sanitizar caracteres no permitidos en nombres de archivo
        // Permitir UTF-8 (ñ, tildes) pero no caracteres del sistema de archivos
        const invalidChars = /[\/\\:*?"<>|]/;
        return !invalidChars.test(val);
      },
      { message: 'El nombre del archivo contiene caracteres no permitidos (/ \\ : * ? " < > |)' }
    ),
}).refine(
  (data) => {
    // Validación cruzada: si valor tiene duración, debe tener unidad
    if (data.duracionValor && !data.duracionUnidad) return false;
    if (!data.duracionValor && data.duracionUnidad) return false;
    return true;
  },
  { message: 'La duración debe incluir valor y unidad, o ninguno de los dos' }
);

// Schema para datos de categoría
export const categoryDataSchema = z.object({
  materiales: z.array(lineItemSchema),
  manoObra: z.array(lineItemSchema),
  maquinaria: z.array(lineItemSchema),
  costesIndirectos: z.array(lineItemSchema),
  otros: z.array(lineItemSchema),
});

// Schema completo para el input de estimación
export const estimateInputSchema = z.object({
  categories: categoryDataSchema,
  margins: marginsSchema,
  exportOptions: exportOptionsSchema.optional(),
});

// Función de validación que retorna errores legibles
export const validateEstimateInput = (data: unknown) => {
  const result = estimateInputSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors.map((err: any) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    return { valid: false, errors };
  }

  return { valid: true, data: result.data, errors: [] };
};
