/**
 * EJEMPLO DE DATOS DE MUESTRA
 * 
 * Este archivo contiene un ejemplo de datos que puedes usar para probar la aplicación.
 * Copia y pega estos datos en la consola del navegador para cargar un ejemplo completo.
 * 
 * INSTRUCCIONES:
 * 1. Abre la aplicación en el navegador
 * 2. Abre la consola de desarrollador (F12)
 * 3. Copia y pega el código de abajo
 * 4. Los datos se cargarán automáticamente
 */

// EJEMPLO: Reforma de un baño completo

const ejemploReformaBano = {
  materiales: [
    {
      id: "1",
      concepto: "Azulejos porcelánicos 60x60",
      unidad: "m²",
      cantidad: 25,
      precioUnitario: 35.50,
      totalLinea: 887.50
    },
    {
      id: "2",
      concepto: "Plato de ducha resina 120x80",
      unidad: "ud",
      cantidad: 1,
      precioUnitario: 285.00,
      totalLinea: 285.00
    },
    {
      id: "3",
      concepto: "Mampara ducha cristal templado",
      unidad: "ud",
      cantidad: 1,
      precioUnitario: 420.00,
      totalLinea: 420.00
    },
    {
      id: "4",
      concepto: "Inodoro suspendido con cisterna",
      unidad: "ud",
      cantidad: 1,
      precioUnitario: 380.00,
      totalLinea: 380.00
    },
    {
      id: "5",
      concepto: "Lavabo sobre encimera + grifo",
      unidad: "ud",
      cantidad: 1,
      precioUnitario: 195.00,
      totalLinea: 195.00
    },
    {
      id: "6",
      concepto: "Mueble baño 80cm",
      unidad: "ud",
      cantidad: 1,
      precioUnitario: 340.00,
      totalLinea: 340.00
    },
    {
      id: "7",
      concepto: "Espejo con luz LED 80x60",
      unidad: "ud",
      cantidad: 1,
      precioUnitario: 145.00,
      totalLinea: 145.00
    },
    {
      id: "8",
      concepto: "Material eléctrico (cable, cajas, etc)",
      unidad: "global",
      cantidad: 1,
      precioUnitario: 180.00,
      totalLinea: 180.00
    },
    {
      id: "9",
      concepto: "Material fontanería (tubos, codos, etc)",
      unidad: "global",
      cantidad: 1,
      precioUnitario: 220.00,
      totalLinea: 220.00
    },
    {
      id: "10",
      concepto: "Cemento cola y material agarre",
      unidad: "global",
      cantidad: 1,
      precioUnitario: 95.00,
      totalLinea: 95.00
    }
  ],
  
  manoObra: [
    {
      id: "11",
      concepto: "Demolición baño existente",
      unidad: "día",
      cantidad: 1,
      precioUnitario: 280.00,
      totalLinea: 280.00
    },
    {
      id: "12",
      concepto: "Alicatado paredes y solado",
      unidad: "m²",
      cantidad: 35,
      precioUnitario: 28.00,
      totalLinea: 980.00
    },
    {
      id: "13",
      concepto: "Instalación sanitarios (inodoro, lavabo, ducha)",
      unidad: "día",
      cantidad: 1.5,
      precioUnitario: 320.00,
      totalLinea: 480.00
    },
    {
      id: "14",
      concepto: "Fontanería (instalación tuberías)",
      unidad: "día",
      cantidad: 2,
      precioUnitario: 280.00,
      totalLinea: 560.00
    },
    {
      id: "15",
      concepto: "Electricidad (instalación y punto luz)",
      unidad: "día",
      cantidad: 1,
      precioUnitario: 260.00,
      totalLinea: 260.00
    },
    {
      id: "16",
      concepto: "Montaje muebles y accesorios",
      unidad: "día",
      cantidad: 0.5,
      precioUnitario: 220.00,
      totalLinea: 110.00
    },
    {
      id: "17",
      concepto: "Pintura techo y puertas",
      unidad: "día",
      cantidad: 0.5,
      precioUnitario: 200.00,
      totalLinea: 100.00
    }
  ],
  
  maquinaria: [
    {
      id: "18",
      concepto: "Alquiler martillo percutor",
      unidad: "día",
      cantidad: 2,
      precioUnitario: 45.00,
      totalLinea: 90.00
    },
    {
      id: "19",
      concepto: "Alquiler radial eléctrica",
      unidad: "día",
      cantidad: 2,
      precioUnitario: 25.00,
      totalLinea: 50.00
    },
    {
      id: "20",
      concepto: "Contenedor escombros 5m³",
      unidad: "ud",
      cantidad: 1,
      precioUnitario: 180.00,
      totalLinea: 180.00
    }
  ],
  
  costesIndirectos: [
    {
      id: "21",
      concepto: "Transporte materiales",
      unidad: "global",
      cantidad: 1,
      precioUnitario: 120.00,
      totalLinea: 120.00
    },
    {
      id: "22",
      concepto: "Seguro de obra",
      unidad: "global",
      cantidad: 1,
      precioUnitario: 85.00,
      totalLinea: 85.00
    },
    {
      id: "23",
      concepto: "Limpieza final",
      unidad: "ud",
      cantidad: 1,
      precioUnitario: 95.00,
      totalLinea: 95.00
    },
    {
      id: "24",
      concepto: "Licencia de obras menor",
      unidad: "ud",
      cantidad: 1,
      precioUnitario: 150.00,
      totalLinea: 150.00
    }
  ],
  
  margenes: {
    margenMaterialesPct: 15,      // 15% sobre materiales
    margenManoObraPct: 10,         // 10% sobre mano de obra
    gastosGeneralesPct: 13,        // 13% gastos generales
    beneficioPct: 6                // 6% beneficio industrial
  }
};

// RESUMEN DEL EJEMPLO:
// - Materiales: 3,147.50 €
// - Mano de Obra: 2,770.00 €
// - Maquinaria: 320.00 €
// - Costes Indirectos: 450.00 €
// - COSTE DIRECTO: 6,687.50 €
// 
// Con márgenes:
// - Margen materiales (15%): +472.13 €
// - Margen mano obra (10%): +277.00 €
// - Gastos generales (13%): +869.38 €
// - Beneficio (6%): +454.07 €
// 
// PRESUPUESTO FINAL: ~8,760 €

console.log('Ejemplo de reforma de baño cargado');
console.log('Subtotales:', {
  materiales: '3,147.50 €',
  manoObra: '2,770.00 €',
  maquinaria: '320.00 €',
  costesIndirectos: '450.00 €'
});
console.log('Presupuesto estimado final: ~8,760 €');
