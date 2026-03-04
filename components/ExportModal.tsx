'use client';

import React, { useState } from 'react';
import { ExportOptions } from '@/lib/types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => Promise<void>;
  isLoading: boolean;
}

export function ExportModal({ isOpen, onClose, onExport, isLoading }: ExportModalProps) {
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [duracionValor, setDuracionValor] = useState<string>('');
  const [duracionUnidad, setDuracionUnidad] = useState<'dias' | 'semanas'>('dias');
  const [nombreArchivo, setNombreArchivo] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      setError(null);

      // Validación: nombre de archivo es obligatorio
      if (!nombreArchivo.trim()) {
        setError('El nombre del archivo es obligatorio');
        return;
      }

      // Validación: caracteres no permitidos en nombres de archivo
      const invalidChars = /[\/\\:*?"<>|]/;
      if (invalidChars.test(nombreArchivo)) {
        setError('El nombre del archivo contiene caracteres no permitidos (/ \\ : * ? " < > |)');
        return;
      }

      // Validación cruzada de duración
      if ((duracionValor && !duracionUnidad) || (!duracionValor && duracionUnidad)) {
        setError('Si especificas duración, debes indicar tanto el valor como la unidad');
        return;
      }

      // Preparar opciones
      const options: ExportOptions = {
        nombreArchivo: nombreArchivo.trim(),
      };

      if (fechaInicio) {
        options.fechaInicio = new Date(fechaInicio);
      }

      if (duracionValor) {
        options.duracionValor = parseInt(duracionValor, 10);
        options.duracionUnidad = duracionUnidad;
      }

      await onExport(options);

      // Limpiar formulario si la exportación fue exitosa
      setFechaInicio('');
      setDuracionValor('');
      setDuracionUnidad('dias');
      setNombreArchivo('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">
            Generar y Descargar Excel
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
          {/* Nombre del archivo - OBLIGATORIO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📄 Nombre del archivo <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Reforma vivienda García"
              value={nombreArchivo}
              onChange={(e) => setNombreArchivo(e.target.value)}
              disabled={isLoading}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Acepta ñ, tildes y caracteres españoles. Se agregará automáticamente .xlsx
            </p>
          </div>

          {/* Fecha de inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Fecha de inicio estimada (opcional)
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Duración */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ⏱️ Duración estimada <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                placeholder="Ej: 10, 3"
                value={duracionValor}
                onChange={(e) => setDuracionValor(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <select
                value={duracionUnidad}
                onChange={(e) => setDuracionUnidad(e.target.value as 'dias' | 'semanas')}
                disabled={isLoading}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="dias">Días</option>
                <option value="semanas">Semanas</option>
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              La fecha de finalización se calculará si indicas fecha de inicio y duración
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-xs text-blue-700">
              <strong>ℹ️ Nota:</strong> Los campos marcados con <span className="text-red-600">*</span> son obligatorios.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">
                <strong>❌ Error:</strong> {error}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generando...
              </>
            ) : (
              <>📊 Generar Excel</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
