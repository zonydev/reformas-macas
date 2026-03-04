# 📁 Estructura del Proyecto

```
Proyectos Reforma/
│
├── 📄 package.json              # Dependencias y scripts del proyecto
├── 📄 tsconfig.json             # Configuración de TypeScript
├── 📄 next.config.js            # Configuración de Next.js
├── 📄 tailwind.config.ts        # Configuración de Tailwind CSS
├── 📄 postcss.config.js         # Configuración de PostCSS
├── 📄 .eslintrc.json            # Configuración de ESLint
├── 📄 .gitignore                # Archivos a ignorar en Git
│
├── 📄 README.md                 # Documentación completa del proyecto
├── 📄 INICIO-RAPIDO.md          # Guía de inicio rápido
├── 📄 EJEMPLO-DATOS.js          # Datos de ejemplo para pruebas
│
├── 📁 app/                      # App Router de Next.js
│   ├── 📄 layout.tsx            # Layout principal de la app
│   ├── 📄 page.tsx              # ⭐ Página principal (estado y lógica)
│   ├── 📄 globals.css           # Estilos globales con Tailwind
│   │
│   └── 📁 api/                  # API Routes
│       └── 📁 export/
│           └── 📄 route.ts      # ⭐ Endpoint para exportar Excel
│
├── 📁 components/               # Componentes React reutilizables
│   ├── 📄 CategorySection.tsx   # Sección de categoría con color
│   ├── 📄 LineItemForm.tsx      # Formulario por línea/concepto
│   ├── 📄 MarginsSection.tsx    # Formulario de márgenes
│   └── 📄 SummaryPanel.tsx      # Panel de resumen sticky
│
└── 📁 lib/                      # Lógica de negocio y utilidades
    ├── 📄 types.ts              # ⭐ Tipos TypeScript principales
    ├── 📄 constants.ts          # Configuración de categorías
    ├── 📄 utils.ts              # Funciones auxiliares
    ├── 📄 validation.ts         # Validación con Zod
    └── 📄 costing.ts            # ⭐ Lógica de cálculo de costes
```

## 🎯 Archivos clave por función

### 🔧 Configuración
- `package.json` - Define todas las dependencias
- `tsconfig.json` - TypeScript en modo estricto
- `tailwind.config.ts` - Tema personalizado con colores

### 📊 Lógica de negocio
- `lib/types.ts` - Tipos centrales (LineItem, CategoryData, Margins, etc.)
- `lib/costing.ts` - Cálculos de subtotales, márgenes y presupuesto
- `lib/validation.ts` - Validación de datos antes de exportar

### 🎨 Interfaz de usuario
- `app/page.tsx` - Componente principal con useReducer
- `components/CategorySection.tsx` - Card de cada categoría
- `components/LineItemForm.tsx` - Formulario de línea individual
- `components/MarginsSection.tsx` - Inputs de porcentajes
- `components/SummaryPanel.tsx` - Resumen en tiempo real

### 📤 Exportación
- `app/api/export/route.ts` - Genera Excel con ExcelJS

## 🔄 Flujo de datos

```
┌─────────────────────────────────────────────────────┐
│                   app/page.tsx                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  useReducer (categories)                     │  │
│  │  useState (margins)                          │  │
│  │  calculateEstimate() → EstimateResult        │  │
│  └──────────────────────────────────────────────┘  │
│           │                              │          │
│           ↓                              ↓          │
│  ┌────────────────┐           ┌──────────────────┐ │
│  │ CategorySection │           │  SummaryPanel    │ │
│  │  ↓              │           │  (mostrar total) │ │
│  │ LineItemForm   │           └──────────────────┘ │
│  └────────────────┘                                │
│           │                                         │
│           ↓ (dispatch)                              │
│  ┌──────────────────────────────────────────────┐  │
│  │  Acción: ADD/UPDATE/DELETE/DUPLICATE         │  │
│  │  → actualiza state → recalcula automático    │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Botón "Exportar" → POST /api/export        │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│            app/api/export/route.ts                  │
│  1. Validar con Zod                                 │
│  2. Calcular estimación (lib/costing.ts)            │
│  3. Generar Excel con ExcelJS (5 hojas)             │
│  4. Retornar buffer del archivo                     │
└─────────────────────────────────────────────────────┘
                          ↓
                  📥 Descarga .xlsx
```

## 🧩 Componentes por responsabilidad

### Estado global (app/page.tsx)
- ✅ Gestiona `categories` con useReducer
- ✅ Gestiona `margins` con useState
- ✅ Calcula `estimate` en tiempo real
- ✅ Maneja exportación a Excel

### Componentes de presentación
- `CategorySection` → Renderiza una categoría completa
- `LineItemForm` → Formulario de una línea
- `MarginsSection` → Inputs de márgenes
- `SummaryPanel` → Vista del resumen

### Lógica pura (lib/)
- `costing.ts` → Funciones de cálculo sin efectos
- `validation.ts` → Validación con Zod
- `utils.ts` → Formateo y helpers generales

## 📦 Dependencias principales

### Producción
```json
{
  "next": "^14.2.3",           // Framework
  "react": "^18.3.1",          // UI
  "exceljs": "^4.4.0",         // Generación Excel
  "date-fns": "^3.6.0",        // Fechas
  "zod": "^3.23.8"             // Validación
}
```

### Desarrollo
```json
{
  "typescript": "^5.4.5",      // Lenguaje
  "tailwindcss": "^3.4.3",     // CSS
  "@types/*": "..."            // Tipos
}
```

## 🚀 Scripts disponibles

```bash
npm run dev      # Servidor desarrollo (puerto 3000)
npm run build    # Compilar para producción
npm start        # Servidor producción
npm run lint     # Verificar código con ESLint
```

## 💡 Decisiones de arquitectura

### ¿Por qué useReducer?
- Gestión de estado complejo con múltiples categorías
- Acciones predecibles y tipadas
- Fácil de escalar

### ¿Por qué API Route para Excel?
- ExcelJS requiere Node.js (no funciona 100% en navegador)
- Servidor garantiza generación consistente
- Mejor manejo de errores

### ¿Por qué sin estado persistente?
- Requisito del proyecto
- Simplifica arquitectura
- Sin costes de infraestructura
- Se puede añadir localStorage fácilmente

---

**Tip**: Empieza explorando [app/page.tsx](app/page.tsx) para entender el flujo principal.
