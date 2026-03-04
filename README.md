# Escandallo de Obra - App de Reformas

Aplicación web interna para gestión de escandallos de obra con exportación a Excel, desarrollada con Next.js 14, TypeScript y Tailwind CSS.

## 📋 Descripción

Esta aplicación permite a equipos de reforma crear escandallos detallados de obra organizados por categorías, aplicar márgenes personalizados y exportar el resultado a un archivo Excel (.xlsx) de 5 hojas con cálculos automáticos.

### Características principales

- ✅ **Sin backend ni base de datos**: Todo funciona en memoria del cliente
- ✅ **Sin autenticación**: Uso interno inmediato
- ✅ **4 categorías de gasto**: Materiales, Mano de Obra, Maquinaria, Costes Indirectos
- ✅ **CRUD completo**: Añadir, editar, duplicar y eliminar líneas
- ✅ **Cálculos en tiempo real**: Subtotales y presupuesto actualizados automáticamente
- ✅ **Márgenes personalizables**: Por categoría y conceptos generales
- ✅ **Exportación Excel**: 5 hojas con formato profesional
- ✅ **Validación de datos**: Con Zod antes de exportar
- ✅ **UI moderna**: Con Tailwind CSS y componentes reutilizables
- ✅ **TypeScript estricto**: Tipado completo en toda la app

## 🚀 Instalación y Ejecución

### Requisitos previos

- Node.js 18+ 
- npm o yarn

### Pasos

1. **Instalar dependencias:**

```bash
npm install
```

2. **Ejecutar en modo desarrollo:**

```bash
npm run dev
```

3. **Abrir en el navegador:**

```
http://localhost:3000
```

4. **Compilar para producción:**

```bash
npm run build
npm start
```

## 📦 Dependencias principales

- **next**: ^14.2.3 - Framework React con App Router
- **react** / **react-dom**: ^18.3.1
- **typescript**: ^5.4.5
- **tailwindcss**: ^3.4.3 - Estilos CSS utility-first
- **exceljs**: ^4.4.0 - Generación de archivos Excel (MIT, gratuito)
- **date-fns**: ^3.6.0 - Formateo de fechas
- **zod**: ^3.23.8 - Validación de esquemas

## 🏗️ Arquitectura

```
Proyectos Reforma/
├── app/
│   ├── api/
│   │   └── export/
│   │       └── route.ts          # API Route para exportar Excel
│   ├── layout.tsx                # Layout raíz
│   ├── page.tsx                  # Página principal con estado
│   └── globals.css               # Estilos globales Tailwind
├── components/
│   ├── CategorySection.tsx       # Sección de categoría con líneas
│   ├── LineItemForm.tsx          # Formulario por línea/concepto
│   ├── MarginsSection.tsx        # Formulario de márgenes
│   └── SummaryPanel.tsx          # Panel de resumen sticky
├── lib/
│   ├── types.ts                  # Tipos TypeScript principales
│   ├── constants.ts              # Configuración de categorías
│   ├── utils.ts                  # Utilidades generales
│   ├── validation.ts             # Validación con Zod
│   └── costing.ts                # Lógica de cálculo de costes
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

### Flujo de datos

1. **Estado en cliente**: `useReducer` en [app/page.tsx](app/page.tsx) gestiona las categorías y sus líneas
2. **Cálculos**: Funciones puras en [lib/costing.ts](lib/costing.ts) procesan datos y generan estimaciones
3. **Validación**: [lib/validation.ts](lib/validation.ts) con Zod valida antes de exportar
4. **Exportación**: POST a `/api/export` genera Excel con ExcelJS y devuelve el archivo

## 💰 Lógica de Cálculo

### Base de cálculo

La aplicación implementa la siguiente lógica de cálculo (documentada en [lib/costing.ts](lib/costing.ts)):

#### 1. Subtotales por categoría
```
Subtotal = Σ(cantidad × precioUnitario) para cada línea
```

#### 2. Coste Directo
```
Coste Directo = Materiales + Mano de Obra + Maquinaria + Costes Indirectos
```

#### 3. Aplicación de márgenes

Los márgenes se aplican de forma modular para claridad:

- **Margen Materiales**: Se aplica **solo** sobre el subtotal de Materiales
  ```
  Incremento Materiales = Subtotal Materiales × (margenMaterialesPct / 100)
  ```

- **Margen Mano de Obra**: Se aplica **solo** sobre el subtotal de Mano de Obra
  ```
  Incremento Mano Obra = Subtotal Mano Obra × (margenManoObraPct / 100)
  ```

- **Gastos Generales**: Se aplican sobre el **Coste Directo total**
  ```
  Gastos Generales = Coste Directo × (gastosGeneralesPct / 100)
  ```

- **Beneficio Industrial**: Se aplica sobre **(Coste Directo + Gastos Generales)**
  ```
  Base Beneficio = Coste Directo + Gastos Generales
  Beneficio = Base Beneficio × (beneficioPct / 100)
  ```

#### 4. Presupuesto Final
```
Presupuesto Final = Coste Directo 
                  + Incremento Materiales 
                  + Incremento Mano Obra 
                  + Gastos Generales 
                  + Beneficio
```

### Justificación de la base de cálculo

Se eligió aplicar los Gastos Generales sobre el **Coste Directo** (todas las categorías) porque:
- Los gastos generales (seguros, administración, etc.) afectan a toda la obra, no solo a una categoría
- Es estándar en la industria de construcción

El Beneficio se aplica sobre **(Coste Directo + Gastos Generales)** porque:
- El beneficio debe incluir la recuperación de todos los costes
- Refleja la estructura típica de presupuestos de obra

## 📊 Estructura del Excel generado

El archivo exportado contiene **5 hojas**:

### 1. **General**
- Resumen de subtotales por categoría
- Coste directo total
- Desglose de márgenes con porcentajes e importes
- Coste total vs Presupuesto final

### 2-5. **Materiales, Mano de Obra, Maquinaria, Costes Indirectos**
Cada hoja contiene:
- Tabla con columnas: Concepto | Unidad | Cantidad | Precio Unitario | Total
- Subtotal al final
- Formato profesional con bordes y alineaciones
- Cabeceras con fondo gris

### Formato aplicado
- Cabeceras en negrita con fondo
- Columnas de importes con formato moneda EUR
- Columnas de porcentajes con formato `%`
- Anchos de columna ajustados
- Bordes en todas las celdas de datos

### Nombre del archivo
```
escandallo-YYYY-MM-DD-HHMM.xlsx
```
Ejemplo: `escandallo-2026-03-04-1430.xlsx`

## 🧪 Validación

Antes de exportar, la aplicación valida:
- ✅ Todos los campos obligatorios están completos
- ✅ Los números son válidos (no NaN, no negativos)
- ✅ Los porcentajes están entre 0-100
- ✅ Las estructuras de datos son correctas

Si hay errores, se bloquea la exportación y se muestra un mensaje claro.

## 🎨 Características de UI/UX

- **Diseño por tarjetas**: Cada categoría tiene su propia tarjeta con color distintivo
- **Formularios inline**: Edición directa sin modales (más rápido)
- **Cálculos en tiempo real**: Los totales se actualizan instantáneamente
- **Panel de resumen sticky**: Visible siempre en la barra lateral
- **Botones de acción**: Duplicar y eliminar en cada línea
- **Validación visual**: Estados de error claros
- **Responsive**: Funciona en desktop y tablet
- **Accesibilidad**: Labels en todos los inputs, navegación por teclado

## 🔧 Extensibilidad

### Añadir una nueva categoría

1. Editar [lib/constants.ts](lib/constants.ts) y añadir metadata:
```typescript
{
  key: 'nuevaCategoria',
  label: 'Nueva Categoría',
  description: 'Descripción',
  color: 'indigo',
  defaultUnit: 'ud',
}
```

2. Actualizar el tipo `CategoryKey` en [lib/types.ts](lib/types.ts):
```typescript
type CategoryKey = 'materiales' | 'manoObra' | 'maquinaria' | 'costesIndirectos' | 'nuevaCategoria';
```

3. Actualizar interfaces `CategoryData` y el cálculo en [lib/costing.ts](lib/costing.ts)

### Añadir persistencia (localStorage)

Implementar en [app/page.tsx](app/page.tsx):
```typescript
// Al cargar
useEffect(() => {
  const saved = localStorage.getItem('escandallo');
  if (saved) {
    // cargar estado
  }
}, []);

// Al guardar
useEffect(() => {
  localStorage.setItem('escandallo', JSON.stringify({ categories, margins }));
}, [categories, margins]);
```

## 🚢 Despliegue en Vercel

1. **Conectar repositorio a Vercel**
2. **Configurar el proyecto:**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. **Variables de entorno**: No necesarias
4. **Deploy**

La app es completamente estática en cuanto a lógica (sin DB), pero usa API Routes para la generación de Excel.

## 🎯 Decisiones técnicas

### ¿Por qué ExcelJS?
- **Licencia MIT**: 100% gratuita, sin restricciones
- **Completa**: Permite formato avanzado (estilos, bordes, fórmulas)
- **Bien mantenida**: Actualizada regularmente
- **Sin dependencias externas**: No requiere servicios de terceros

### ¿Por qué useReducer?
- Gestión de estado complejo con múltiples categorías
- Acciones tipadas y predecibles
- Facilita testing y debugging
- Escalable para añadir más funcionalidad

### ¿Por qué Zod?
- Validación robusta con TypeScript
- Mensajes de error claros
- Integración perfecta con tipos TS
- Schema reutilizable en cliente y servidor

### ¿Por qué sin DB?
- Requisito explícito: app interna sin persistencia
- Simplifica despliegue y mantenimiento
- Sin costes adicionales
- Datos sensibles nunca salen del navegador

## 📝 Notas adicionales

### Limitaciones conocidas
- Los datos se pierden al recargar la página (se puede añadir localStorage fácilmente)
- No hay colaboración en tiempo real (diseñado para uso individual)
- Excel generado en servidor (no puede ser muy pesado, pero el límite es alto)

### Próximas mejoras sugeridas
- [ ] Persistencia opcional con localStorage
- [ ] Importar datos desde CSV/Excel existente
- [ ] Templates predefinidos por tipo de obra
- [ ] Histórico de presupuestos exportados (con localStorage)
- [ ] Modo de vista previa del Excel antes de descargar
- [ ] Copia de seguridad automática

## 📄 Licencia

Este proyecto usa dependencias con licencias abiertas (MIT, Apache 2.0).

---

**Desarrollado para equipos de reforma** | Next.js 14 + TypeScript + Tailwind CSS
