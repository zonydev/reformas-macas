# ✅ Lista de Verificación

## Pre-instalación

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm o yarn disponible (`npm --version`)

## Instalación

```bash
cd "/Users/zonydev/Documents/Proyectos Reforma"
npm install
```

- [ ] Instalación completada sin errores
- [ ] Carpeta `node_modules/` creada

## Ejecución

```bash
npm run dev
```

- [ ] Servidor arranca sin errores
- [ ] Mensaje: `Ready on http://localhost:3000`
- [ ] Navegador abre automáticamente o manual en http://localhost:3000

## Pruebas de funcionalidad

### 1. UI básica
- [ ] Página carga correctamente
- [ ] Se ven 4 secciones de categorías con colores diferentes
  - [ ] Materiales (azul)
  - [ ] Mano de Obra (verde)
  - [ ] Maquinaria (naranja)
  - [ ] Costes Indirectos (morado)
- [ ] Panel de resumen visible en la derecha
- [ ] Sección de márgenes visible

### 2. Añadir conceptos
- [ ] Botón "+ Añadir Concepto" funciona en cada categoría
- [ ] Aparece formulario con campos:
  - [ ] Concepto (texto)
  - [ ] Unidad (dropdown)
  - [ ] Cantidad (número)
  - [ ] Precio/Ud (número)
  - [ ] Total (calculado automáticamente)

### 3. Cálculos en tiempo real
- [ ] Al cambiar cantidad o precio, el total se actualiza
- [ ] Subtotal de categoría se actualiza
- [ ] Panel de resumen se actualiza
- [ ] Presupuesto final cambia

### 4. Acciones sobre líneas
- [ ] Botón "Duplicar" crea una copia de la línea
- [ ] Botón "Eliminar" borra la línea
- [ ] Confirmación al eliminar (opcional)

### 5. Márgenes
- [ ] Campos de porcentaje funcionan
- [ ] Valores entre 0-100
- [ ] Panel de resumen muestra incrementos
- [ ] Presupuesto final incluye márgenes

### 6. Exportación Excel
- [ ] Botón "Generar y Descargar Excel" visible
- [ ] Al hacer clic:
  - [ ] Aparece spinner "Generando Excel..."
  - [ ] Archivo se descarga automáticamente
  - [ ] Nombre: `escandallo-YYYY-MM-DD-HHMM.xlsx`
- [ ] Abrir Excel y verificar:
  - [ ] 5 hojas presentes
  - [ ] Hoja "General" con resumen
  - [ ] Hojas por categoría con datos
  - [ ] Formato correcto (moneda EUR, bordes, etc.)

### 7. Reset
- [ ] Botón "🔄 Resetear" visible arriba a la derecha
- [ ] Al hacer clic aparece confirmación
- [ ] Todos los datos se borran

## Casos de prueba específicos

### Test 1: Cálculo básico sin márgenes
1. Añadir en Materiales:
   - Cemento, 10 sacos, 15€/ud
2. Panel resumen debe mostrar:
   - Materiales: 150€
   - Coste directo: 150€
   - Presupuesto final: 150€

### Test 2: Cálculo con márgenes
1. Mantener el Test 1
2. Añadir margen materiales: 20%
3. Panel resumen debe mostrar:
   - Materiales: 150€
   - Margen Materiales (20%): +30€
   - Presupuesto final: 180€

### Test 3: Múltiples categorías
1. Añadir en Materiales: 100€
2. Añadir en Mano Obra: 200€
3. Añadir en Maquinaria: 50€
4. Coste directo debe ser: 350€

### Test 4: Exportación con datos completos
1. Añadir al menos 2 líneas en cada categoría
2. Configurar todos los márgenes > 0
3. Exportar a Excel
4. Verificar que todas las hojas tienen datos

## Errores comunes y soluciones

### Error: "Cannot find module 'react'"
**Solución**: Ejecutar `npm install`

### Error: "Port 3000 is already in use"
**Solución**: 
```bash
npm run dev -- -p 3001
```

### Error: Excel no se descarga
**Solución**: 
- Verificar consola del navegador (F12)
- Revisar terminal del servidor
- Verificar que hay datos en al menos una categoría

### Warnings de TypeScript
**Solución**: 
```bash
npm run lint
```

## Verificación de producción

```bash
npm run build
npm start
```

- [ ] Build completa sin errores
- [ ] Servidor producción arranca
- [ ] Funcionalidad igual que en desarrollo

## Checklist final

- [ ] ✅ Instalación completa
- [ ] ✅ UI renderiza correctamente
- [ ] ✅ Cálculos funcionan en tiempo real
- [ ] ✅ Exportación genera Excel válido
- [ ] ✅ No hay errores en consola
- [ ] ✅ Todas las acciones funcionan (añadir, editar, duplicar, eliminar)
- [ ] ✅ Reset funciona

## 🎉 ¡Listo para usar!

Si todos los checks están marcados, la aplicación está funcionando correctamente.

---

**Nota**: Si encuentras algún problema, revisa:
1. [README.md](README.md) - Documentación completa
2. [INICIO-RAPIDO.md](INICIO-RAPIDO.md) - Guía de inicio
3. Consola del navegador (F12) para errores JavaScript
4. Terminal para errores del servidor
