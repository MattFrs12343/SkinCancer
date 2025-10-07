# Documento de Requisitos - Remover Recomendaciones Personalizadas

## Introducción

Esta especificación define la eliminación completa del sistema de recomendaciones personalizadas de la aplicación OncoDerma. El objetivo es simplificar la interfaz de usuario y eliminar la funcionalidad que genera recomendaciones automáticas basadas en el análisis de IA, manteniendo únicamente los resultados del análisis médico sin sugerencias adicionales.

## Requisitos

### Requisito 1 - Eliminación del Componente de Recomendaciones

**Historia de Usuario:** Como usuario de OncoDerma, quiero que se elimine la sección de recomendaciones personalizadas de los resultados, para tener una interfaz más simple y enfocada únicamente en los resultados del análisis.

#### Criterios de Aceptación

1. CUANDO se muestran los resultados del análisis ENTONCES el sistema NO DEBERÁ mostrar el componente SmartRecommendationsSystem
2. CUANDO se accede a la página de análisis ENTONCES el sistema NO DEBERÁ renderizar ninguna sección de recomendaciones personalizadas
3. CUANDO se completa un análisis ENTONCES el sistema DEBERÁ mostrar únicamente el resultado principal y análisis detallado sin recomendaciones
4. CUANDO se navega por los resultados ENTONCES el sistema NO DEBERÁ incluir pestañas o secciones relacionadas con recomendaciones

### Requisito 2 - Limpieza de Código y Archivos

**Historia de Usuario:** Como desarrollador del sistema, quiero eliminar todo el código relacionado con recomendaciones personalizadas, para mantener el código limpio y sin funcionalidades no utilizadas.

#### Criterios de Aceptación

1. CUANDO se revise el código ENTONCES el sistema NO DEBERÁ contener el archivo SmartRecommendationsSystem.jsx
2. CUANDO se revise el código ENTONCES el sistema NO DEBERÁ contener el archivo UrgencyBasedRecommendations.jsx
3. CUANDO se revisen las importaciones ENTONCES el sistema NO DEBERÁ incluir referencias a componentes de recomendaciones eliminados
4. CUANDO se revisen las utilidades ENTONCES el sistema NO DEBERÁ contener funciones de generación de recomendaciones en dashboardUtils.js
5. CUANDO se revisen las constantes ENTONCES el sistema NO DEBERÁ incluir configuraciones relacionadas con recomendaciones en dashboardConstants.js

### Requisito 3 - Actualización de la Interfaz de Resultados

**Historia de Usuario:** Como usuario, quiero que la interfaz de resultados se mantenga funcional y bien estructurada después de eliminar las recomendaciones, para seguir teniendo una buena experiencia de usuario.

#### Criterios de Aceptación

1. CUANDO se muestran los resultados ENTONCES el sistema DEBERÁ mantener el PrimaryResultCard funcionando correctamente
2. CUANDO se accede al análisis detallado ENTONCES el sistema DEBERÁ mantener el EnhancedDetailedAnalysis sin referencias a recomendaciones
3. CUANDO se visualizan las tarjetas de comparación ENTONCES el sistema DEBERÁ eliminar las secciones de recomendaciones de LesionComparisonCard
4. CUANDO se navega por los resultados ENTONCES el sistema DEBERÁ mantener la funcionalidad de "Nuevo Análisis" y "Guardar Resultado"

### Requisito 4 - Eliminación de Referencias en Constantes

**Historia de Usuario:** Como desarrollador, quiero que se eliminen todas las referencias a recomendaciones en los archivos de constantes y configuración, para evitar datos innecesarios en el sistema.

#### Criterios de Aceptación

1. CUANDO se revise constants.js ENTONCES el sistema NO DEBERÁ incluir propiedades "recommendations" en SKIN_LESION_TYPES
2. CUANDO se revise dashboardConstants.js ENTONCES el sistema NO DEBERÁ incluir la pestaña "recomendaciones" en DASHBOARD_TABS
3. CUANDO se procesen los datos ENTONCES el sistema NO DEBERÁ generar ni almacenar información de recomendaciones
4. CUANDO se muestren los tipos de lesiones ENTONCES el sistema NO DEBERÁ incluir listas de recomendaciones específicas

### Requisito 5 - Actualización de Textos y Descripciones

**Historia de Usuario:** Como usuario, quiero que se actualicen los textos que hacen referencia a recomendaciones, para que la aplicación sea consistente con la funcionalidad disponible.

#### Criterios de Aceptación

1. CUANDO se muestre la página Home ENTONCES el sistema NO DEBERÁ mencionar "recomendaciones" en las descripciones de funcionalidades
2. CUANDO se muestre la página de análisis ENTONCES el sistema NO DEBERÁ incluir texto sobre "recomendaciones profesionales"
3. CUANDO se muestren tooltips o ayudas ENTONCES el sistema NO DEBERÁ hacer referencia a funcionalidades de recomendaciones eliminadas
4. CUANDO se presente información al usuario ENTONCES el sistema DEBERÁ usar textos actualizados que reflejen la funcionalidad real

### Requisito 6 - Mantenimiento de Funcionalidad Core

**Historia de Usuario:** Como usuario de OncoDerma, quiero que todas las funcionalidades principales de análisis sigan funcionando correctamente después de eliminar las recomendaciones, para mantener la utilidad de la aplicación.

#### Criterios de Aceptación

1. CUANDO se suba una imagen ENTONCES el sistema DEBERÁ procesar y mostrar resultados normalmente
2. CUANDO se muestren los resultados ENTONCES el sistema DEBERÁ mantener la visualización de porcentajes y análisis detallado
3. CUANDO se navegue por las pestañas de resultados ENTONCES el sistema DEBERÁ funcionar correctamente con "Resumen" y "Detalles"
4. CUANDO se use la aplicación ENTONCES el sistema DEBERÁ mantener toda la funcionalidad de autenticación, navegación y análisis intacta

### Requisito 7 - Validación de Eliminación Completa

**Historia de Usuario:** Como desarrollador, quiero asegurarme de que no queden referencias residuales al sistema de recomendaciones, para evitar errores o funcionalidades rotas.

#### Criterios de Aceptación

1. CUANDO se compile la aplicación ENTONCES el sistema NO DEBERÁ mostrar errores relacionados con componentes de recomendaciones eliminados
2. CUANDO se ejecuten las pruebas ENTONCES el sistema NO DEBERÁ fallar por referencias a funcionalidades de recomendaciones
3. CUANDO se revise el código ENTONCES el sistema NO DEBERÁ contener comentarios o código comentado relacionado con recomendaciones
4. CUANDO se analice el bundle ENTONCES el sistema NO DEBERÁ incluir código no utilizado relacionado con recomendaciones eliminadas