# EntreSesiones · Referencia funcional para rehabilitación neuropsicológica

**Fecha:** 10/10/2026  
**Benchmark:** NeuronUP (estructura de catálogo, generadores, fichas, planificación y resultados). No se incorporan sus contenidos, imágenes, interfaz, nombres de ejercicios, juegos ni materiales propietarios.

## Arquitectura de actividades

| Modalidad | Estado | Operación |
| --- | --- | --- |
| Ficha | Implementada | Estímulos originales, cerrados y editables, nivel y ayudas por separado, salida imprimible |
| Generador | Implementado para 13 dominios | Variantes paramétricas originales, evitando memorización de respuestas; revisión clínica obligatoria |
| Cuaderno de 7 días | Implementado | 14 actividades de 13 dominios, sin prescripción rígida de dosis |
| Ficha focal | Implementada | 2 tareas y 1 transferencia funcional del dominio elegido |
| Ejercicio individual | Implementado | Una tarea desarrollada |
| Juegos interactivos por fases | **Pendiente** | No simular juegos con fichas ni prometer autocorrección |
| Programas longitudinales con recomendaciones | Parcial | Guardado y seguimiento disponibles; falta vincular dificultad adaptativa automática a protocolos comparables |
| Fotografías de fichas completadas | Disponible en seguimiento | OCR local con revisión profesional y almacenamiento protegido |
| Fotografías reales como estímulos | Parcial | Inserción manual validada; no generar imágenes inexistentes desde el texto del modelo |

## Taxonomía objetivo

Orientación temporal, espacial y personal; atención selectiva, sostenida, alternante y dividida; memoria episódica, prospectiva y de trabajo; funciones ejecutivas (planificación, inhibición, flexibilidad, monitorización); lenguaje (comprensión, denominación, fluidez); visuoespacial; praxias; gnosias; cálculo funcional; cognición social; velocidad de procesamiento; cognición funcional.

Clasificar cada actividad por:
- proceso primario y demandas secundarias;
- tarea y consigna reproducibles, estímulos visibles y solución de referencia verificable;
- modalidad (ficha, generador y, cuando exista, juego digital);
- demanda cognitiva **distinta** de intensidad de ayudas;
- formato visual, verbal, lógico o funcional;
- tiempo solo cuando esté justificado, tolerancia y accesibilidad;
- tipo de respuesta, observaciones cualitativas y transferibilidad.

## Niveles

La versión actual ofrece **tres bandas de demanda**, no cinco niveles psicométricamente calibrados:
- Inicial: operaciones explícitas y baja carga.
- Intermedio: aumento de elementos, distractores o regla adicional.
- Avanzado: multietapa, interferencia, planificación bajo restricciones o actualización cuando la función lo permita.

**No deben equipararse los niveles con gravedad diagnóstica.** Los apoyos se seleccionan de forma independiente. La próxima iteración debe permitir fases operacionales por familia con reglas y pruebas automatizadas que demuestren un aumento real de demanda, no meras etiquetas.

## Reglas de calidad innegociables

1. Evitar infantilización y tareas de dificultad impropia del paciente.
2. No copiar reactivos psicométricos, juegos o interfaces de terceros.
3. Verificar soluciones con pruebas deterministas: trayectos transitables, recuentos, cifras y horarios compatibles, distractores explícitos, instrucciones completas.
4. No mostrar respuestas en el cuaderno del paciente; mantener claves de corrección en la vista profesional cuando se desarrolle su separación completa.
5. No atribuir validez diagnóstica, normas o efecto terapéutico a puntuaciones ad hoc.
6. Contraste, tamaño legible, márgenes, aire y espacio suficiente de respuesta en PDF.
7. Datos personales, fotografías y OCR bajo autenticación y supervisión profesional.
8. Revisión clínica obligatoria antes de publicar o asignar. Las recomendaciones de progreso requieren condiciones de ejecución comparables.

## Próximas iteraciones propuestas

1. **Catálogo por subfunciones y etiquetado clínico** con buscador, filtros, historial por paciente y objetivos.
2. **Biblioteca multimedia original**: fotografía, escenas realistas, mapas de calles, matrices, relojes, rutas y calendarios que sean recursos verdaderamente manipulables e imprimibles.
3. **Juegos digitales propios** con niveles y reglas de adaptación transparentes, modalidades pulsar/arrastrar, accesibilidad y registro de errores.
4. **Corrector profesional** separado del documento del paciente, con claves estructuradas y captura de fotografías manuscritas.
5. **Programador semanal clínico** con pesos por subfunción, fatiga, tolerancia y objetivos ecológicos, manteniendo el formato semanal.
6. **Auditoría de catálogo y carga** sobre miles de semillas y series de semanas para detectar repeticiones, inconsistencias lógicas y material excesivamente elemental.
7. **Panel descriptivo longitudinal** con parámetros comparables, ayudas recibidas y transferencia; sin inferir mejora clínica a partir de un único puntaje.

## Fuentes metodológicas del benchmark

- https://neuronup.com/producto/actividades-de-neuronup/
- https://neuronup.com/producto/tipos-de-actividades-de-neuronup-generadores-juegos-fichas/
- https://neuronup.com/producto/sesiones-de-neuronup/
- https://neuronup.com/producto/resultados-de-neuronup/
