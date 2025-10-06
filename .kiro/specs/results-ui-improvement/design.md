# Design Document

## Overview

Este documento describe el diseño mejorado para la interfaz de resultados del análisis dermatológico con IA. El objetivo es crear una experiencia más profesional, confiable y amigable que mantenga la precisión médica mientras mejora significativamente la usabilidad y el atractivo visual.

### Design Principles

1. **Medical Trust**: La interfaz debe inspirar confianza médica a través de un diseño limpio y profesional
2. **Progressive Disclosure**: Información organizada en capas, mostrando lo más importante primero
3. **Visual Hierarchy**: Clara diferenciación entre información crítica, importante y complementaria
4. **Accessibility**: Cumplimiento con estándares de accesibilidad médica y WCAG 2.1
5. **Responsive Design**: Experiencia óptima en todos los dispositivos
6. **Dark Mode Excellence**: Diseño nativo para modo oscuro, no solo adaptación

## Architecture

### Component Structure

```
ResultsInterface/
├── ResultsHeader/
│   ├── AnalysisStatus
│   ├── ProcessingTime
│   └── ConfidenceIndicator
├── PrimaryResult/
│   ├── MainDiagnosis
│   ├── RiskAssessment
│   └── ProbabilityVisualization
├── DetailedAnalysis/
│   ├── LesionComparison
│   ├── ExpandableDetails
│   └── TechnicalMetrics
├── Recommendations/
│   ├── UrgencyBased
│   ├── GeneralCare
│   └── FollowUpActions
└── ActionPanel/
    ├── NewAnalysisButton
    ├── SaveResults
    └── ShareWithDoctor
```

### Information Architecture

1. **Level 1 (Critical)**: Diagnóstico principal, nivel de riesgo, acciones inmediatas
2. **Level 2 (Important)**: Análisis detallado, comparación de lesiones, recomendaciones
3. **Level 3 (Supplementary)**: Información técnica, disclaimers, opciones avanzadas

## Components and Interfaces

### 1. Enhanced Results Header

**Purpose**: Proporcionar contexto inmediato y estado del análisis

**Design Features**:
- Status badge con animación sutil
- Tiempo de procesamiento con icono de reloj
- Indicador de confianza con barra de progreso elegante
- Breadcrumb visual del proceso completado

**Visual Elements**:
```css
.results-header {
  background: linear-gradient(135deg, var(--white) 0%, var(--gray-50) 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(0,0,0,0.08);
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

[data-theme='dark'] .results-header {
  background: linear-gradient(135deg, var(--gray-50) 0%, rgba(30, 41, 59, 0.8) 100%);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
```

### 2. Primary Result Card

**Purpose**: Mostrar el diagnóstico principal de manera clara y profesional

**Design Features**:
- Card principal con elevación sutil
- Icono médico grande y profesional
- Nombre de la lesión con tipografía jerárquica
- Probabilidad con visualización circular mejorada
- Indicador de riesgo con colores médicos apropiados

**Risk Color Palette**:
```css
:root {
  --risk-high: #dc2626;
  --risk-high-bg: rgba(220, 38, 38, 0.1);
  --risk-medium: #f59e0b;
  --risk-medium-bg: rgba(245, 158, 11, 0.1);
  --risk-low: #059669;
  --risk-low-bg: rgba(5, 150, 105, 0.1);
}

[data-theme='dark'] {
  --risk-high: #f87171;
  --risk-high-bg: rgba(248, 113, 113, 0.2);
  --risk-medium: #fbbf24;
  --risk-medium-bg: rgba(251, 191, 36, 0.2);
  --risk-low: #34d399;
  --risk-low-bg: rgba(52, 211, 153, 0.2);
}
```

### 3. Enhanced Probability Visualization

**Purpose**: Mostrar probabilidades de manera intuitiva y profesional

**Design Features**:
- Circular progress con gradientes suaves
- Animación de entrada elegante (0.8s ease-out)
- Números grandes y legibles
- Contexto visual con iconos médicos
- Comparación visual entre diferentes probabilidades

**Animation Specifications**:
```css
@keyframes probabilityReveal {
  0% { 
    stroke-dasharray: 0 100;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% { 
    stroke-dasharray: var(--percentage) 100;
    opacity: 1;
  }
}
```

### 4. Improved Detailed Analysis Section

**Purpose**: Organizar información técnica de manera accesible

**Design Features**:
- Cards expandibles con transiciones suaves
- Comparación lado a lado de lesiones
- Filtros visuales para diferentes tipos
- Información técnica en tooltips
- Gráficos de barras horizontales para comparación

**Layout Pattern**:
```
┌─────────────────────────────────────────┐
│ [Icon] Lesion Name           [85%] ████ │
│        Description                      │
│        [Expand] [Details]               │
└─────────────────────────────────────────┘
```

### 5. Smart Recommendations System

**Purpose**: Presentar recomendaciones de manera accionable y clara

**Design Features**:
- Categorización por urgencia con iconos distintivos
- Cards de acción con call-to-action claros
- Timeline visual para seguimiento
- Integración con calendario (futuro)
- Información contextual expandible

**Urgency Levels**:
- **Urgent** (🚨): Rojo, acción inmediata requerida
- **Priority** (⏰): Amarillo, acción en días/semanas
- **Routine** (📅): Verde, seguimiento regular
- **Informational** (💡): Azul, información general

### 6. Enhanced Dark Mode Design

**Purpose**: Proporcionar experiencia nativa en modo oscuro

**Design Features**:
- Paleta de colores específica para modo oscuro
- Contraste optimizado para legibilidad médica
- Gradientes sutiles que no cansen la vista
- Iconos adaptados para mejor visibilidad
- Sombras y elevaciones ajustadas

## Data Models

### AnalysisResult Interface
```typescript
interface EnhancedAnalysisResult {
  id: string;
  timestamp: Date;
  processingTime: number;
  confidence: number;
  primaryDiagnosis: {
    type: string;
    probability: number;
    riskLevel: 'low' | 'medium' | 'high';
    urgency: 'routine' | 'priority' | 'urgent';
  };
  detailedAnalysis: {
    lesionProbabilities: Record<string, number>;
    technicalMetrics: TechnicalMetrics;
    visualFeatures: VisualFeatures;
  };
  recommendations: {
    immediate: Recommendation[];
    followUp: Recommendation[];
    general: Recommendation[];
  };
  metadata: {
    modelVersion: string;
    imageQuality: number;
    processingFlags: string[];
  };
}
```

### UI State Management
```typescript
interface ResultsUIState {
  viewMode: 'summary' | 'detailed' | 'comparison';
  expandedSections: Set<string>;
  selectedLesion: string | null;
  animationState: 'idle' | 'entering' | 'complete';
  darkMode: boolean;
}
```

## Error Handling

### Error States Design

1. **Network Errors**: Card con retry elegante y explicación clara
2. **Processing Errors**: Mensaje contextual con pasos de solución
3. **Invalid Results**: Fallback graceful con opción de reanalizar
4. **Timeout Errors**: Indicador de progreso con opción de cancelar

### Error UI Components
```jsx
<ErrorCard
  type="network"
  message="No se pudo conectar con el servidor"
  action="retry"
  severity="medium"
/>
```

## Testing Strategy

### Visual Testing
- Snapshot testing para componentes clave
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Responsive testing en múltiples dispositivos
- Dark/light mode consistency testing

### Accessibility Testing
- Screen reader compatibility
- Keyboard navigation testing
- Color contrast validation (WCAG AA)
- Focus management testing

### Performance Testing
- Animation performance profiling
- Large dataset rendering tests
- Memory usage monitoring
- Bundle size optimization

### User Experience Testing
- A/B testing para diferentes layouts
- Heat mapping de interacciones
- Time-to-comprehension metrics
- Medical professional feedback sessions

## Implementation Phases

### Phase 1: Core Visual Improvements
- Enhanced color palette and typography
- Improved card designs and layouts
- Better spacing and visual hierarchy
- Basic dark mode improvements

### Phase 2: Interactive Enhancements
- Smooth animations and transitions
- Expandable sections and details
- Improved navigation between views
- Enhanced mobile responsiveness

### Phase 3: Advanced Features
- Smart recommendations system
- Advanced data visualizations
- Accessibility improvements
- Performance optimizations

### Phase 4: Polish and Refinement
- Micro-interactions and feedback
- Advanced dark mode features
- Professional medical iconography
- Final UX optimizations

## Design Tokens

### Spacing Scale
```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
}
```

### Typography Scale
```css
:root {
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 30px;
  --text-4xl: 36px;
}
```

### Border Radius Scale
```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;
}
```

### Shadow Scale
```css
:root {
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.1);
}

[data-theme='dark'] {
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.2);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.3);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.4);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.5);
}
```

## Accessibility Considerations

### Color and Contrast
- Minimum contrast ratio of 4.5:1 for normal text
- Minimum contrast ratio of 3:1 for large text
- Color is not the only means of conveying information
- High contrast mode support

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order throughout the interface
- Visible focus indicators
- Escape key closes modals and expanded sections

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Live regions for dynamic content updates
- Alternative text for all images and icons

### Motor Accessibility
- Minimum touch target size of 44px
- Adequate spacing between interactive elements
- No time-based interactions required
- Support for various input methods

## Performance Considerations

### Loading Strategy
- Progressive loading of detailed analysis
- Lazy loading of non-critical components
- Optimized image loading for medical imagery
- Skeleton screens during loading states

### Animation Performance
- Hardware-accelerated animations using transform and opacity
- Reduced motion support for accessibility
- 60fps target for all animations
- Efficient re-rendering strategies

### Bundle Optimization
- Code splitting for results components
- Tree shaking of unused utilities
- Optimized asset loading
- Efficient CSS delivery