import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { format } from 'date-fns';
import { EstimateInput, CategoryKey, ExportOptions } from '@/lib/types';
import { calculateEstimate } from '@/lib/costing';
import { validateEstimateInput } from '@/lib/validation';
import { getCategoryMetadata } from '@/lib/constants';
import { calculateEndDate, formatDateEs, formatDuration } from '@/lib/dateUtils';

/**
 * Sanitiza el nombre del archivo manteniendo caracteres UTF-8 válidos (ñ, tildes)
 * pero eliminando caracteres no permitidos en sistemas de archivos
 */
function sanitizeFilename(filename: string): string {
  // Remover caracteres no permitidos en sistemas de archivos: / \ : * ? " < > |
  // Mantener caracteres UTF-8 como ñ, tildes, etc.
  return filename.replace(/[\/\\:*?"<>|]/g, '_').trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar input
    const validation = validateEstimateInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: validation.errors },
        { status: 400 }
      );
    }

    const input = body as EstimateInput;
    const estimate = calculateEstimate(input.categories, input.margins);
    const exportOptions = input.exportOptions as ExportOptions | undefined;

    // Calcular fecha de finalización si es necesario
    let fechaFinalizacion: Date | undefined;
    if (exportOptions?.fechaInicio && exportOptions?.duracionValor && exportOptions?.duracionUnidad) {
      fechaFinalizacion = calculateEndDate(
        new Date(exportOptions.fechaInicio),
        exportOptions.duracionValor,
        exportOptions.duracionUnidad
      );
    }

    // Crear workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Escandallo de Obra';
    workbook.created = new Date();

    // ========================================
    // HOJA 1: GENERAL
    // ========================================
    const generalSheet = workbook.addWorksheet('General');
    
    // Título
    generalSheet.getCell('A1').value = 'RESUMEN GENERAL DEL ESCANDALLO';
    generalSheet.getCell('A1').font = { size: 16, bold: true };
    generalSheet.mergeCells('A1:C1');
    
    // Fecha
    generalSheet.getCell('A2').value = 'Fecha:';
    generalSheet.getCell('B2').value = format(new Date(), 'dd/MM/yyyy HH:mm');
    
    // Información del proyecto (si se proporcionó)
    let projectInfoStartRow = 4;
    if (exportOptions?.fechaInicio || (exportOptions?.duracionValor && exportOptions?.duracionUnidad)) {
      generalSheet.addRow([]);
      const projectInfoRow = generalSheet.addRow(['INFORMACIÓN DEL PROYECTO']).font = { bold: true };
      projectInfoStartRow = generalSheet.lastRow?.number ?? 5;
      
      if (exportOptions?.fechaInicio) {
        generalSheet.addRow([
          'Fecha de inicio estimada:',
          formatDateEs(new Date(exportOptions.fechaInicio)),
        ]);
      }
      
      if (fechaFinalizacion) {
        generalSheet.addRow([
          'Fecha de finalización estimada:',
          formatDateEs(fechaFinalizacion),
        ]);
      }
      
      if (exportOptions?.duracionValor && exportOptions?.duracionUnidad) {
        generalSheet.addRow([
          'Duración estimada:',
          formatDuration(exportOptions.duracionValor, exportOptions.duracionUnidad),
        ]);
      }
      
      generalSheet.addRow([]);
    }
    
    generalSheet.addRow([]);
    
    // Subtotales por categoría
    generalSheet.addRow(['SUBTOTALES POR CATEGORÍA']).font = { bold: true, size: 12 };
    generalSheet.addRow(['Concepto', 'Importe', '']);
    
    const categoryRows = [
      ['Materiales', estimate.subtotals.materiales],
      ['Mano de Obra', estimate.subtotals.manoObra],
      ['Maquinaria', estimate.subtotals.maquinaria],
      ['Costes Indirectos', estimate.subtotals.costesIndirectos],
    ];
    
    categoryRows.forEach(([label, value]) => {
      generalSheet.addRow([label, value as number, '€']);
    });
    
    generalSheet.addRow(['COSTE DIRECTO TOTAL', estimate.subtotals.costeDirecto, '€']).font = { bold: true };
    
    generalSheet.addRow([]);
    
    // Márgenes e incrementos
    generalSheet.addRow(['MÁRGENES E INCREMENTOS']).font = { bold: true, size: 12 };
    generalSheet.addRow(['Concepto', 'Porcentaje', 'Importe']);
    
    const marginRows = [
      ['Margen sobre Materiales', input.margins.margenMaterialesPct, estimate.incrementoMateriales],
      ['Margen sobre Mano de Obra', input.margins.margenManoObraPct, estimate.incrementoManoObra],
      ['Gastos Generales (sobre coste directo)', input.margins.gastosGeneralesPct, estimate.gastosGenerales],
      ['Beneficio Industrial (sobre CD + GG)', input.margins.beneficioPct, estimate.beneficio],
    ];
    
    marginRows.forEach(([label, pct, value]) => {
      const row = generalSheet.addRow([label, (pct as number) / 100, value as number]);
      row.getCell(2).numFmt = '0.00%';
      row.getCell(3).numFmt = '#,##0.00 "€"';
    });
    
    generalSheet.addRow([]);
    
    // Totales finales
    generalSheet.addRow(['TOTALES']).font = { bold: true, size: 12 };
    generalSheet.addRow(['Coste Total (sin márgenes)', estimate.costeTotal, '€']);
    
    const finalRow = generalSheet.addRow(['PRESUPUESTO FINAL', estimate.presupuestoFinal, '€']);
    finalRow.font = { bold: true, size: 14 };
    finalRow.getCell(2).font = { bold: true, size: 14, color: { argb: 'FF2563EB' } };
    
    // Formato de columnas
    generalSheet.getColumn(1).width = 40;
    generalSheet.getColumn(2).width = 20;
    generalSheet.getColumn(2).alignment = { horizontal: 'right' };
    generalSheet.getColumn(3).width = 10;
    
    // ========================================
    // HOJAS 2-6: CATEGORÍAS
    // ========================================
    const categories: CategoryKey[] = ['materiales', 'manoObra', 'maquinaria', 'costesIndirectos', 'otros'];
    
    categories.forEach((categoryKey) => {
      const metadata = getCategoryMetadata(categoryKey);
      const items = input.categories[categoryKey];
      
      const sheet = workbook.addWorksheet(metadata.label);
      
      // Título
      sheet.getCell('A1').value = metadata.label.toUpperCase();
      sheet.getCell('A1').font = { size: 14, bold: true };
      sheet.mergeCells('A1:E1');
      
      sheet.getCell('A2').value = metadata.description;
      sheet.mergeCells('A2:E2');
      
      // Nota especial para "Otros"
      if (categoryKey === 'otros') {
        sheet.addRow([]);
        const noteRow = sheet.addRow(['⚠️ Nota: Esta categoría NO tiene margen aplicado']);
        noteRow.getCell(1).font = { italic: true, color: { argb: 'FFDC2626' } };
        const noteRowNum = sheet.lastRow?.number ?? 4;
        sheet.mergeCells(`A${noteRowNum}:E${noteRowNum}`);
      }
      
      sheet.addRow([]);
      
      // Cabecera
      const headerRow = sheet.addRow(['Concepto', 'Unidad', 'Cantidad', 'Precio Unitario', 'Total']);
      headerRow.font = { bold: true };
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE5E7EB' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
      
      // Datos
      items.forEach((item) => {
        const row = sheet.addRow([
          item.concepto,
          item.unidad,
          item.cantidad,
          item.precioUnitario,
          item.totalLinea,
        ]);
        
        row.getCell(3).numFmt = '0.00';
        row.getCell(4).numFmt = '#,##0.00 "€"';
        row.getCell(5).numFmt = '#,##0.00 "€"';
        
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      });
      
      // Fila de subtotal
      sheet.addRow([]);
      const subtotal = items.reduce((sum, item) => sum + item.totalLinea, 0);
      const subtotalRow = sheet.addRow(['', '', '', 'SUBTOTAL:', subtotal]);
      subtotalRow.font = { bold: true };
      subtotalRow.getCell(5).numFmt = '#,##0.00 "€"';
      subtotalRow.getCell(5).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFEF3C7' },
      };
      
      // Anchos de columna
      sheet.getColumn(1).width = 40;
      sheet.getColumn(2).width = 12;
      sheet.getColumn(3).width = 12;
      sheet.getColumn(4).width = 18;
      sheet.getColumn(5).width = 18;
      
      // Alineación
      sheet.getColumn(3).alignment = { horizontal: 'right' };
      sheet.getColumn(4).alignment = { horizontal: 'right' };
      sheet.getColumn(5).alignment = { horizontal: 'right' };
    });

    // Generar buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Validar que existe el nombre de archivo (ahora es obligatorio)
    if (!exportOptions?.nombreArchivo) {
      return NextResponse.json(
        { message: 'El nombre del archivo es obligatorio' },
        { status: 400 }
      );
    }

    // Sanitizar y preparar nombre del archivo manteniendo UTF-8
    const sanitizedName = sanitizeFilename(exportOptions.nombreArchivo);
    const filename = `${sanitizedName}.xlsx`;

    // Retornar archivo
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    });
  } catch (error) {
    console.error('Error generating Excel:', error);
    return NextResponse.json(
      { message: 'Error al generar el Excel', error: String(error) },
      { status: 500 }
    );
  }
}
