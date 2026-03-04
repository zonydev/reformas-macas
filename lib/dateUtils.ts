/**
 * Utilidades para manejo de fechas
 */

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Calcula la fecha de finalización a partir de una fecha de inicio y duración
 * @param startDate Fecha de inicio
 * @param valor Cantidad de días o semanas
 * @param unidad Unidad de tiempo ('dias' o 'semanas')
 * @returns Fecha de finalización calculada
 */
export const calculateEndDate = (
  startDate: Date,
  valor: number,
  unidad: 'dias' | 'semanas'
): Date => {
  const endDate = new Date(startDate);

  if (unidad === 'dias') {
    endDate.setDate(endDate.getDate() + valor);
  } else if (unidad === 'semanas') {
    endDate.setDate(endDate.getDate() + valor * 7);
  }

  return endDate;
};

/**
 * Formatea una fecha al formato español DD/MM/YYYY
 * @param date Fecha a formatear
 * @returns Fecha formateada como string
 */
export const formatDateEs = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: es });
};

/**
 * Formatea una duración en texto legible
 * @param valor Cantidad de días o semanas
 * @param unidad Unidad de tiempo
 * @returns String de duración formateado
 */
export const formatDuration = (valor: number, unidad: 'dias' | 'semanas'): string => {
  const unitLabel = unidad === 'dias' ? 'día' : 'semana';
  const plural = valor > 1 ? 's' : '';
  return `${valor} ${unitLabel}${plural}`;
};
