# Documento de Diseño - Remover Recomendaciones Personalizadas

## Introducción

Este documento describe el diseño técnico para la eliminación completa del sistema de recomendaciones personalizadas de OncoDerma. La eliminación se realizará de manera sistemática para mantener la integridad del código y la funcionalidad core de la aplicación.

## Arquitectura

### Componentes Afectados

La eliminación impactará los siguientes componentes y archivos:

**Componentes a Eliminar:**
- `SmartRecommendationsSystem.jsx` - Componente principal de recomendaciones
- `UrgencyBasedRecommendations.jsx` - Sistema de recomendaciones por urgencia

**Componentes a Modificar:**
- `Analizar.jsx` - Remover importación y renderizado de SmartRecommendationsSystem
- `EnhancedDetailedAnalysis.jsx` - Eliminar secciones de recomendaciones
- `LesionComparisonCard.jsx` - Remover recomendaciones principales

**Archivos de Utilidades a Modificar:**
- `dashboardUtils.js` - Eliminar función generateRecommendations
- `dashboardConstants.js` - Remover pestaña de recomendaciones
- `constants.js` - Eliminar propiedades recommendations de SKIN_LESION_TYPES

**Archivos de Contenido a Actualizar:**
- `Home.jsx` - Actualizar descripciones sin mencionar recomendaciones
- `FAQ.jsx` - Revisar y actualizar referencias

## Componentes y Interfaces

### 1. Página de Análisis (Analizar.jsx)

**Cambios Requeridos:**
- Eliminar importación de `SmartRecommendationsSystem`
- Remover el bloque de renderizado del componente de recomendaciones
- Mantener la estructura de resultados con `PrimaryResultCard` y `EnhancedDetailedAnalysis`
- Actualizar textos descriptivos

**Estructura Resultante:**
```jsx
// Mantener solo estos componentes principales
<PrimaryResultCard />
<EnhancedDetailedAnalysis />
// Eliminar: <SmartRecommendationsSystem />
```

### 2. Análisis Detallado (EnhancedDetailedAnalysis.jsx)

**Modificaciones:**
- Eliminar sección de recomendaciones en las tarjetas de lesiones
- Mantener información médica esencial: descripción, características, urgencia
- Preservar funcionalidad de expansión y navegación por pestañas

### 3. Tarjetas de Comparación (LesionComparisonCard.jsx)

**Cambios:**
- Remover sección "RECOMENDACIONES PRINCIPALES"
- Eliminar renderizado condicional de `lesion.recommendations`
- Mantener información de características y descripción detallada

## Data Models

### Modificación de SKIN_LESION_TYPES

**Estructura Actual:**
```javascript
{
  type: 'melanoma',
  fullName: 'Melanoma',
  // ... otras propiedades
  recommendations: ['Consulta URGENTE', 'Biopsia', ...], // ELIMINAR
}
```

**Estructura Resultante:**
```javascript
{
  type: 'melanoma',
  fullName: 'Melanoma',
  // ... mantener otras propiedades
  // recommendations: ELIMINADO
}
```

### Actualización de dashboardUtils.js

**Funciones a Eliminar:**
- `generateRecommendations()` - Función completa
- Referencias a `recommendations` en `transformAnalysisResult()`
- Referencias a `recommendations` en `generateMockResult()`

**Funciones a Mantener:**
- `transformAnalysisResult()` - Sin generar recomendaciones
- `generateMockResult()` - Sin incluir recomendaciones
- Todas las demás utilidades de transformación de datos

## Error Handling

### Estrategia de Eliminación Segura

1. **Eliminación Gradual:**
   - Primero remover renderizado de componentes
   - Luego eliminar importaciones
   - Finalmente eliminar archivos de componentes

2. **Validación de Referencias:**
   - Verificar que no existan referencias residuales
   - Comprobar que la compilación sea exitosa
   - Validar que no se rompan otras funcionalidades

3. **Manejo de Datos Legacy:**
   - Los datos existentes que contengan recomendaciones serán ignorados
   - No se requiere migración de datos ya que las recomendaciones se generaban dinámicamente

## Testing Strategy

### Pruebas de Regresión

1. **Funcionalidad Core:**
   - Verificar que el análisis de imágenes funcione correctamente
   - Comprobar que los resultados se muestren apropiadamente
   - Validar navegación entre pestañas de resultados

2. **Interfaz de Usuario:**
   - Confirmar que no aparezcan secciones vacías o rotas
   - Verificar que el layout se mantenga coherente
   - Comprobar responsividad en diferentes dispositivos

3. **Compilación y Build:**
   - Verificar que no existan errores de compilación
   - Comprobar que el bundle se genere correctamente
   - Validar que no queden imports no utilizados

### Casos de Prueba Específicos

1. **Análisis Completo:**
   - Subir imagen → Procesar → Mostrar resultados
   - Verificar que solo aparezcan: resultado principal + análisis detallado
   - Confirmar ausencia de secciones de recomendaciones

2. **Navegación de Pestañas:**
   - Verificar pestañas "Resumen" y "Detalles" funcionan
   - Confirmar que no aparezca pestaña "Recomendaciones"
   - Validar transiciones suaves entre pestañas

3. **Responsive Design:**
   - Probar en móvil, tablet y desktop
   - Verificar que el layout se adapte correctamente
   - Confirmar que no queden espacios vacíos

## Implementación por Fases

### Fase 1: Preparación
- Identificar todas las referencias a recomendaciones
- Crear backup del código actual
- Planificar orden de eliminación

### Fase 2: Eliminación de Renderizado
- Remover componentes de la interfaz
- Actualizar imports en archivos principales
- Verificar que la aplicación compile

### Fase 3: Limpieza de Datos
- Eliminar funciones de generación de recomendaciones
- Actualizar constantes y configuraciones
- Remover propiedades no utilizadas

### Fase 4: Eliminación de Archivos
- Eliminar archivos de componentes no utilizados
- Limpiar imports residuales
- Verificar bundle final

### Fase 5: Validación Final
- Pruebas completas de funcionalidad
- Verificación de UI/UX
- Confirmación de eliminación completa

## Consideraciones de Mantenimiento

### Código Limpio
- Eliminar completamente archivos no utilizados
- No dejar código comentado relacionado con recomendaciones
- Mantener consistencia en naming y estructura

### Documentación
- Actualizar comentarios que hagan referencia a recomendaciones
- Revisar README si menciona esta funcionalidad
- Actualizar documentación técnica

### Futuras Extensiones
- El diseño permite re-agregar recomendaciones en el futuro si es necesario
- La estructura de datos core se mantiene intacta
- Los componentes principales permanecen modulares y extensibles