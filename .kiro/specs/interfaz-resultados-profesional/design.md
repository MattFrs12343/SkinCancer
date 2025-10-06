# Design Document

## Overview

Este documento describe el diseño completo para la nueva interfaz de resultados del análisis dermatológico, transformándola en un dashboard médico profesional y moderno. El diseño se inspira en sistemas médicos avanzados, utilizando un enfoque de tarjetas (cards), visualizaciones gráficas elegantes y una experiencia de usuario intuitiva.

La nueva interfaz reemplazará completamente la presentación actual de resultados, organizando la información en un dashboard tipo grid con tarjetas especializadas, gráficos interactivos y un sistema de navegación por pestañas que permite diferentes niveles de detalle.

## Architecture

### Component Structure

```
ResultsDashboard/
├── DashboardHeader/
│   ├── PatientInfo
│   ├── AnalysisMetadata
│   └── ViewToggle
├── MetricsGrid/
│   ├── RiskOverviewCard
│   ├── ProbabilityCard
│   ├── ConfidenceCard
│   └── DiagnosisCard
├── DetailedView/
│   ├── DiagnosisComparison
│   ├── VisualAnalysis
│   └── TrendAnalysis (future)
├── RecommendationsPanel/
│   ├── UrgentActions
│   ├── FollowUpCare
│   └── PreventiveMeasures
└── InteractiveElements/
    ├── ExpandableCards
    ├── HoverEffects
    └── AnimatedTransitions
```

### Layout System

**Desktop Layout (1200px+):**
- Grid de 4 columnas para métricas principales
- Panel lateral para recomendaciones
- Vista expandida para análisis detallado

**Tablet Layout (768px - 1199px):**
- Grid de 2 columnas adaptativo
- Recomendaciones debajo de métricas
- Navegación por pestañas optimizada

**Mobile Layout (< 768px):**
- Columna única con scroll vertical
- Tarjetas apiladas con priorización
- Navegación por swipe entre secciones

## Components and Interfaces

### 1. DashboardHeader Component

**Props Interface:**
```typescript
interface DashboardHeaderProps {
  patientId?: string;
  analysisDate: Date;
  processingTime: number;
  imageMetadata: ImageMetadata;
  currentView: 'summary' | 'detailed' | 'comparison';
  onViewChange: (view: string) => void;
}
```

**Features:**
- Información del análisis con timestamp
- Toggle entre vistas (Resumen/Detallado/Comparativo)
- Indicador de estado de conexión
- Botón para nuevo análisis

### 2. MetricsGrid Component

**Tarjetas Principales:**

#### RiskOverviewCard
- **Visual:** Gauge circular con colores dinámicos
- **Data:** Riesgo general (Alto/Medio/Bajo)
- **Colors:** 
  - Alto: Gradiente rojo (#EF4444 → #DC2626)
  - Medio: Gradiente amarillo (#F59E0B → #D97706)
  - Bajo: Gradiente verde (#10B981 → #059669)
- **Animation:** Carga progresiva del gauge (0-100%)

#### ProbabilityCard
- **Visual:** Gráfico circular animado (donut chart)
- **Data:** Probabilidad del diagnóstico más probable
- **Features:** 
  - Animación de carga de 2 segundos
  - Tooltip con información adicional
  - Indicador de confianza

#### ConfidenceCard
- **Visual:** Barra de progreso con segmentos
- **Data:** Nivel de confianza del modelo IA
- **Features:**
  - Segmentación visual (0-60% Bajo, 60-80% Medio, 80-100% Alto)
  - Indicador numérico prominente

#### DiagnosisCard
- **Visual:** Icono médico + información textual
- **Data:** Diagnóstico más probable con descripción
- **Features:**
  - Icono dinámico según tipo de lesión
  - Código de color según severidad
  - Botón de expansión para detalles

### 3. DetailedView Component

#### DiagnosisComparison
```typescript
interface DiagnosisItem {
  type: string;
  probability: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  characteristics: string[];
  recommendations: string[];
}
```

**Features:**
- Lista ordenada por probabilidad
- Gráficos de barras horizontales
- Tarjetas expandibles con detalles
- Comparación visual lado a lado

#### VisualAnalysis
- **Heatmap:** Áreas de interés en la imagen (si disponible)
- **Annotations:** Marcadores sobre características detectadas
- **Zoom:** Funcionalidad de zoom y pan en la imagen
- **Overlay:** Superposición de información contextual

### 4. RecommendationsPanel Component

#### Estructura de Recomendaciones:
```typescript
interface Recommendation {
  id: string;
  category: 'urgent' | 'followup' | 'preventive';
  title: string;
  description: string;
  icon: string;
  priority: number;
  timeframe: string;
}
```

**Categorías Visuales:**
- **Urgentes:** Fondo rojo, icono de alerta
- **Seguimiento:** Fondo amarillo, icono de calendario
- **Preventivas:** Fondo azul, icono de escudo

## Data Models

### AnalysisResult Interface
```typescript
interface AnalysisResult {
  id: string;
  timestamp: Date;
  processingTime: number;
  confidence: number;
  
  // Resultado principal
  primaryDiagnosis: {
    type: string;
    probability: number;
    riskLevel: 'low' | 'medium' | 'high';
    description: string;
  };
  
  // Análisis detallado
  detailedAnalysis: {
    lesionProbabilities: Record<string, number>;
    riskAssessment: {
      overallRisk: 'low' | 'medium' | 'high';
      cancerProbability: number;
      benignProbability: number;
    };
    characteristics: string[];
  };
  
  // Recomendaciones
  recommendations: Recommendation[];
  
  // Metadatos
  imageMetadata: {
    filename: string;
    size: number;
    dimensions: { width: number; height: number };
    quality: number;
  };
}
```

### Theme Configuration
```typescript
interface DashboardTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: {
      light: string;
      dark: string;
    };
    cards: {
      light: string;
      dark: string;
    };
    risk: {
      high: { bg: string; border: string; text: string };
      medium: { bg: string; border: string; text: string };
      low: { bg: string; border: string; text: string };
    };
  };
  
  spacing: {
    cardPadding: string;
    gridGap: string;
    sectionMargin: string;
  };
  
  animations: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: string;
  };
}
```

## Error Handling

### Error States
1. **Loading State:** Skeleton cards con animación de shimmer
2. **Network Error:** Tarjeta de error con botón de reintento
3. **Data Error:** Mensaje de error específico con fallback
4. **Partial Data:** Mostrar datos disponibles con indicadores de datos faltantes

### Error Recovery
- Auto-retry para errores de red
- Fallback a datos cached cuando sea posible
- Mensajes de error user-friendly
- Opciones de contacto para soporte técnico

## Testing Strategy

### Unit Tests
- Componentes individuales con diferentes props
- Funciones de cálculo y formateo de datos
- Hooks personalizados para manejo de estado
- Utilidades de transformación de datos

### Integration Tests
- Flujo completo de carga de resultados
- Interacciones entre componentes
- Navegación entre vistas
- Responsive behavior en diferentes breakpoints

### Visual Regression Tests
- Screenshots de diferentes estados
- Comparación de temas claro/oscuro
- Verificación de animaciones
- Consistencia cross-browser

### Accessibility Tests
- Navegación por teclado
- Screen reader compatibility
- Contraste de colores
- ARIA labels y roles

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading:** Componentes de vista detallada
2. **Memoization:** Cálculos complejos y renderizado de gráficos
3. **Virtual Scrolling:** Para listas largas de diagnósticos
4. **Image Optimization:** Compresión y lazy loading de imágenes médicas

### Bundle Splitting
- Separar librerías de gráficos en chunks independientes
- Code splitting por rutas/vistas
- Preload de componentes críticos

### Caching Strategy
- Cache de resultados de análisis en localStorage
- Service Worker para assets estáticos
- Optimistic updates para mejor UX

## Accessibility Features

### WCAG 2.1 AA Compliance
- Contraste mínimo 4.5:1 para texto normal
- Contraste mínimo 3:1 para texto grande
- Navegación completa por teclado
- Focus indicators visibles

### Screen Reader Support
- Semantic HTML structure
- ARIA labels descriptivos
- Live regions para actualizaciones dinámicas
- Alternative text para gráficos

### Motor Accessibility
- Targets mínimos de 44px para elementos interactivos
- Tiempo suficiente para leer contenido
- Opciones para pausar animaciones
- Navegación simplificada

## Animation and Transitions

### Micro-interactions
- Hover effects sutiles en tarjetas (elevación, sombra)
- Loading states con skeleton screens
- Progress indicators animados
- Smooth transitions entre vistas

### Performance Guidelines
- Usar transform y opacity para animaciones
- Evitar animaciones de layout properties
- Respetar prefers-reduced-motion
- Duración máxima de 300ms para micro-interactions

### Animation Library
Utilizar Framer Motion para:
- Transiciones entre componentes
- Animaciones de entrada/salida
- Gestos y drag interactions
- Orchestrated animations

## Responsive Design Breakpoints

```css
/* Mobile First Approach */
.dashboard {
  /* Base: Mobile (320px+) */
  grid-template-columns: 1fr;
  gap: 1rem;
  
  /* Tablet (768px+) */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  /* Desktop (1024px+) */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
  
  /* Large Desktop (1440px+) */
  @media (min-width: 1440px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 2.5rem;
  }
}
```

## Integration Points

### Existing Components
- Mantener compatibilidad con `useImageAnalysis` hook
- Integrar con sistema de temas existente (`useTheme`)
- Utilizar componentes UI base existentes donde sea apropiado
- Preservar funcionalidad de `ConnectionStatus`

### API Integration
- Adaptar respuestas del backend a nuevas interfaces
- Mantener backward compatibility
- Implementar transformadores de datos si es necesario
- Optimizar requests para nuevos requerimientos de datos

### State Management
- Integrar con estado global existente
- Implementar estado local para interacciones del dashboard
- Cache management para resultados históricos
- Optimistic updates para mejor UX