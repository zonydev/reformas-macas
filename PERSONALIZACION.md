# 🎨 Guía de Personalización

## Cambios rápidos y fáciles

### 1. Cambiar colores del tema

Edita `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // Cambia estos valores para tu color primario
        500: '#3b82f6',  // Color principal
        600: '#2563eb',  // Hover
        700: '#1d4ed8',  // Pressed
      },
    },
  },
}
```

### 2. Cambiar colores de categorías

Edita `lib/constants.ts`:

```typescript
export const CATEGORIES: CategoryMetadata[] = [
  {
    key: 'materiales',
    color: 'blue',    // Cambia a: green, red, purple, indigo, etc.
    // ...
  },
];
```

### 3. Añadir más unidades predefinidas

Edita `lib/constants.ts`:

```typescript
export const COMMON_UNITS: Record<CategoryKey, string[]> = {
  materiales: ['m²', 'm³', 'm', 'ud', 'kg', 'l', 'saco', 'pallet'],
  // Añade más unidades específicas de tu negocio
};
```

### 4. Cambiar márgenes por defecto

Edita `lib/constants.ts`:

```typescript
export const DEFAULT_MARGINS = {
  margenMaterialesPct: 15,    // Tu margen típico
  margenManoObraPct: 10,      // Tu margen típico
  gastosGeneralesPct: 13,     // Tu GG típico
  beneficioPct: 6,            // Tu beneficio típico
};
```

### 5. Cambiar textos de la UI

Edita `app/page.tsx`:

```typescript
<h1 className="text-3xl font-bold text-gray-900">
  Tu Empresa - Escandallos  {/* Personaliza aquí */}
</h1>
```

## Mejoras intermedias

### 6. Añadir persistencia con localStorage

Edita `app/page.tsx`, añade después de la línea de useState de margins:

```typescript
// Cargar datos guardados al iniciar
useEffect(() => {
  const saved = localStorage.getItem('escandallo-data');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      // Restaurar state aquí (requiere refactorización)
    } catch (e) {
      console.error('Error cargando datos:', e);
    }
  }
}, []);

// Guardar automáticamente
useEffect(() => {
  localStorage.setItem('escandallo-data', JSON.stringify({
    categories,
    margins,
  }));
}, [categories, margins]);
```

### 7. Añadir logo de empresa

Crea `public/logo.png` y edita `app/page.tsx`:

```typescript
<div className="flex items-center gap-4">
  <img src="/logo.png" alt="Logo" className="h-12 w-12" />
  <h1>Tu Empresa</h1>
</div>
```

### 8. Añadir templates predefinidos

Crea `lib/templates.ts`:

```typescript
export const TEMPLATES = {
  bano: {
    name: 'Reforma de Baño',
    categories: {
      materiales: [
        { concepto: 'Azulejos', unidad: 'm²', cantidad: 20, precioUnitario: 35 },
        // ...
      ],
    },
    margins: DEFAULT_MARGINS,
  },
  cocina: {
    name: 'Reforma de Cocina',
    // ...
  },
};
```

Luego añade botones en la UI para cargar templates.

### 9. Añadir campo de notas/observaciones

Edita `lib/types.ts`:

```typescript
export interface LineItem {
  id: string;
  concepto: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  totalLinea: number;
  notas?: string;  // Nuevo campo
}
```

Actualiza `components/LineItemForm.tsx` para mostrar un textarea.

### 10. Añadir campo de cliente/proyecto

Edita `app/page.tsx`, añade nuevo state:

```typescript
const [projectInfo, setProjectInfo] = useState({
  cliente: '',
  proyecto: '',
  fecha: new Date().toISOString().split('T')[0],
});
```

Añade inputs al principio de la página y pasa estos datos a la exportación.

## Mejoras avanzadas

### 11. Añadir histórico de presupuestos

```typescript
// Estado para histórico
const [history, setHistory] = useState<SavedEstimate[]>([]);

// Al exportar, guardar en histórico
const handleExport = async () => {
  // ... código existente
  
  // Guardar en histórico
  const saved: SavedEstimate = {
    id: generateId(),
    timestamp: new Date(),
    categories,
    margins,
    estimate,
  };
  setHistory([saved, ...history]);
  localStorage.setItem('history', JSON.stringify([saved, ...history]));
};
```

### 12. Importar desde Excel/CSV

Crear `app/api/import/route.ts`:

```typescript
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');
  
  // Parsear con ExcelJS
  // Mapear a estructura de CategoryData
  // Validar con Zod
  // Retornar datos
}
```

### 13. Añadir modo de vista previa antes de exportar

Crear componente `PreviewModal.tsx`:

```typescript
export const PreviewModal: React.FC<{
  estimate: EstimateResult;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ estimate, onConfirm, onCancel }) => {
  return (
    <div className="modal">
      {/* Mostrar vista previa de todas las hojas */}
      <div>
        <h2>Hoja General</h2>
        {/* Renderizar preview */}
      </div>
      <button onClick={onConfirm}>Confirmar y Descargar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
};
```

### 14. Añadir modos de cálculo alternativos

Edita `lib/costing.ts`:

```typescript
export type CostingMode = 'standard' | 'simplified' | 'detailed';

export const calculateEstimate = (
  categories: CategoryData,
  margins: Margins,
  mode: CostingMode = 'standard'
): EstimateResult => {
  switch (mode) {
    case 'standard':
      // Lógica actual
    case 'simplified':
      // Márgenes aplicados globalmente
    case 'detailed':
      // Márgenes por concepto individual
  }
};
```

### 15. Añadir gráficos visuales

Instalar biblioteca de gráficos:

```bash
npm install recharts
```

Crear componente `CostChart.tsx`:

```typescript
import { PieChart, Pie, Cell } from 'recharts';

export const CostChart: React.FC<{ estimate: EstimateResult }> = ({ estimate }) => {
  const data = [
    { name: 'Materiales', value: estimate.subtotals.materiales },
    { name: 'Mano Obra', value: estimate.subtotals.manoObra },
    { name: 'Maquinaria', value: estimate.subtotals.maquinaria },
    { name: 'C. Indirectos', value: estimate.subtotals.costesIndirectos },
  ];
  
  return <PieChart data={data} />;
};
```

### 16. Añadir autenticación básica

Instalar NextAuth:

```bash
npm install next-auth
```

Configurar en `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      authorize: async (credentials) => {
        // Validar credenciales
        if (credentials?.username === 'admin' && credentials?.password === 'secret') {
          return { id: '1', name: 'Admin' };
        }
        return null;
      }
    })
  ]
};
```

### 17. Añadir base de datos (MongoDB/Postgres)

Si decides añadir persistencia server-side:

1. Instalar Prisma:
```bash
npm install prisma @prisma/client
npx prisma init
```

2. Definir schema en `prisma/schema.prisma`:
```prisma
model Estimate {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  data      Json
  margins   Json
}
```

3. Crear endpoints CRUD en `app/api/estimates/`

### 18. Añadir multi-idioma

Instalar next-intl:

```bash
npm install next-intl
```

Configurar i18n en `next.config.js` y crear archivos de traducción.

### 19. Añadir exportación a PDF

Instalar jsPDF:

```bash
npm install jspdf jspdf-autotable
```

Crear `app/api/export-pdf/route.ts` similar al de Excel.

### 20. PWA - Aplicación instalable

Instalar next-pwa:

```bash
npm install next-pwa
```

Configurar en `next.config.js` y añadir `manifest.json`.

## 🎯 Roadmap sugerido

### Fase 1 (1-2 horas)
- ✅ Cambiar colores y textos
- ✅ Añadir logo
- ✅ Configurar márgenes por defecto

### Fase 2 (2-4 horas)
- ✅ Añadir localStorage
- ✅ Crear templates
- ✅ Campo de cliente/proyecto

### Fase 3 (4-8 horas)
- ✅ Histórico de presupuestos
- ✅ Importar Excel/CSV
- ✅ Vista previa antes de exportar

### Fase 4 (8+ horas)
- ✅ Gráficos visuales
- ✅ Autenticación
- ✅ Base de datos
- ✅ Exportación PDF

## 💡 Tips de desarrollo

1. **Trabajar en ramas**: Usa git branches para nuevas features
2. **Testear cambios**: Prueba en desarrollo antes de desplegar
3. **Backup de datos**: Si añades localStorage, añade export/import de configuración
4. **Documentar cambios**: Actualiza README con nuevas funcionalidades
5. **Mantener tipado**: Actualiza types.ts cuando añadas campos

---

**¿Necesitas ayuda?** Consulta la documentación de Next.js: https://nextjs.org/docs
