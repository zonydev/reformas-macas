/**
 * Utilidades generales de la aplicación
 */

/**
 * Genera un ID único simple basado en timestamp y random
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Formatea un número como moneda en EUR
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formatea un porcentaje
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

/**
 * Formatea un número con decimales
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

/**
 * Redondea a 2 decimales para evitar errores de precisión
 */
export const round2 = (value: number): number => {
  return Math.round(value * 100) / 100;
};

/**
 * Valida que un número es válido (no NaN, no negativo)
 */
export const isValidNumber = (value: number): boolean => {
  return !isNaN(value) && isFinite(value) && value >= 0;
};

/**
 * Parsea un string a número de forma segura
 */
export const parseNumber = (value: string): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};
