# 🚀 Inicio Rápido

## Requisitos previos

Asegúrate de tener instalado Node.js 18 o superior:
```bash
node --version
```

Si no lo tienes, descárgalo desde: https://nodejs.org/

## Pasos para ejecutar

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar en desarrollo
```bash
npm run dev
```

### 3. Abrir en el navegador
```
http://localhost:3000
```

## Uso de la aplicación

### Flujo básico:

1. **Añadir conceptos**: Haz clic en "+ Añadir Concepto" en cada categoría
   - Rellena: Concepto, Unidad, Cantidad, Precio Unitario
   - El total se calcula automáticamente

2. **Editar valores**: Modifica directamente en los campos
   - Los totales se actualizan en tiempo real

3. **Duplicar/Eliminar**: Usa los botones de cada línea

4. **Configurar márgenes**: 
   - Desplázate a "Márgenes y Beneficio"
   - Introduce los porcentajes deseados (0-100)
   - El resumen se actualiza automáticamente

5. **Revisar resumen**: 
   - Panel lateral derecho muestra todos los totales
   - Presupuesto final incluye todos los márgenes

6. **Exportar Excel**:
   - Haz clic en "📊 Generar y Descargar Excel"
   - El archivo se descarga automáticamente
   - Nombre: `escandallo-YYYY-MM-DD-HHMM.xlsx`

### Características útiles:

- **Reset**: Botón arriba a la derecha para empezar de cero
- **Duplicar**: Copia rápida de líneas comunes
- **Unidades predefinidas**: Dropdown con unidades típicas por categoría
- **Validación automática**: No permite números negativos o inválidos

## Solución de problemas

### El servidor no arranca
```bash
# Elimina node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Error de puerto ocupado
Si el puerto 3000 está en uso:
```bash
npm run dev -- -p 3001
```

### Errores de TypeScript
```bash
# Verifica la configuración
npm run lint
```

## Despliegue en Vercel

```bash
# Instala Vercel CLI (una vez)
npm i -g vercel

# Deploy
vercel
```

O conecta tu repo de GitHub en: https://vercel.com

---

**¿Problemas?** Revisa el [README.md](README.md) completo para más detalles.
