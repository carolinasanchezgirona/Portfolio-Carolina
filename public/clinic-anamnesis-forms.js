/* Banco original de entrevista clínica especializada, versión 2.0.
 * Uso profesional exclusivo. No constituye escala psicométrica, algoritmo diagnóstico
 * ni reproduce el texto de pruebas protegidas por derechos de autor.
 */
(() => {
  "use strict";
  const YES = ["Sí", "No", "Información insuficiente", "No explorado"];
  const FREQ = ["Nunca / no referido", "Ocasional", "Frecuente", "Persistente", "Fluctuante", "No explorado"];
  const IMPACT = ["Sin afectación relevante", "Leve", "Moderada", "Marcada", "No determinable"];
  const EVIDENCE = ["Referido por paciente", "Referido por informante", "Observado", "Documentado", "Fuentes concordantes", "Fuentes discordantes", "No corroborado"];
  const q=(key,label,help)=>({key,label,kind:"textarea",help:help||""});
  const short=(key,label,help)=>({key,label,kind:"text",help:help||""});
  const yes=(key,label,help)=>({key,label,kind:"select",options:YES,help:help||""});
  const pick=(key,label,options,help)=>({key,label,kind:"select",options,help:help||""});
  const checks=(key,label,options,help)=>({key,label,kind:"checks",options,help:help||""});
  const date=(key,label)=>({key,label,kind:"date"});
  const count=(key,label,min,max)=>({key,label,kind:"number",min,max,step:"1"});
  const section=(title,description,questions)=>({title,description,questions});
  const common=[
    section("01 · Identificación, demanda, fuentes y consentimiento",
      "Documenta quién informa, en qué fecha y con qué finalidad. La ficha no sustituye el consentimiento informado.",
      [
        q("motivo","Demanda exacta y pregunta clínica que debe responder la valoración"),
        pick("finalidad","Finalidad principal",["Diagnóstica clínica","Caracterización de perfil cognitivo","Seguimiento longitudinal","Planificación de apoyos/intervención","Orientación educativa","Segunda opinión","Otra"]),
        date("entrevista_fecha","Fecha de entrevista inicial"),
        short("solicitante","Quién solicita la valoración"),
        checks("fuentes","Fuentes utilizadas",["Persona evaluada","Familiar/cuidador","Pareja","Centro educativo","Profesional remitente","Informe sanitario previo","Documentación educativa","Observación directa","Otro"]),
        q("fuentes_detalle","Identificación, fechas, relación y frecuencia de contacto de cada informante"),
        pick("consentimiento","Consentimiento y condiciones de participación",["Documentado y válido","Pendiente de documentar","Requiere apoyo o evaluación adicional de capacidad","No aplicable al registro"]),
        checks("idiomas","Idiomas relevantes para la interpretación",["Castellano","Catalán","Otra lengua habitual","Bilingüismo/multilingüismo","Lengua de escolarización diferente","Interpretación/traducción requerida"]),
        short("idiomas_detalle","Lengua predominante y nivel funcional en cada lengua"),
        pick("educacion","Máximo nivel educativo",["Sin escolarización formal","Primaria","Secundaria","Bachillerato/FP","Universitario","Posgrado","No consta"]),
        checks("adaptaciones","Adaptaciones de evaluación necesarias",["Ninguna identificada","Visuales","Auditivas","Motoras","Lectura/escritura","Comunicación/lenguaje","Culturales/lingüísticas","Fatiga/pausas","Otras"]),
        pick("fuentes_concordancia","Grado de concordancia entre fuentes",["Concordantes","Diferencias puntuales","Discrepancia relevante","Una sola fuente","No valorado"]),
        q("fuentes_discrepancias","Describir discrepancias, ausencias de datos y límites de fiabilidad")
      ]),
    section("02 · Cronología y antecedentes transversales",
      "Distingue hechos documentados, relatos retrospectivos e hipótesis profesionales.",
      [
        pick("inicio_tipo","Patrón de inicio de las dificultades",["Desde el desarrollo temprano","Insidioso / progresivo","Agudo","Subagudo","Tras acontecimiento identificado","Variable/no claro"]),
        date("inicio_fecha","Fecha de inicio conocida (si procede)"),
        short("inicio_edad","Edad aproximada al inicio, si se conoce"),
        pick("curso_tipo","Curso clínico",["Estable","Progresivo","Fluctuante","Episódico","Mejora","No determinado"]),
        q("inicio","Secuencia temporal, ejemplos y acontecimientos relacionados"),
        checks("antecedentes_medicos","Antecedentes relevantes",["Neurológicos","Cardiovasculares/metabólicos","Psiquiátricos","Neurodesarrollo","Traumatismo craneoencefálico","Sensitivos","Enfermedad crónica","Ninguno referido","Sin datos"]),
        q("medicos","Enfermedades relevantes, hospitalizaciones, pruebas complementarias y fechas"),
        q("farmacos","Tratamientos actuales: indicación, dosis si constan, cambios y efectos percibidos"),
        yes("familiares_neuro","¿Antecedentes familiares neuropsiquiátricos o del neurodesarrollo relevantes?"),
        q("familiares","Parentesco, cuadro descrito, edad de inicio y fuente"),
        checks("interferentes","Factores potencialmente interferentes",["Alteraciones de sueño","Dolor","Fatiga","Ansiedad/depresión","Estrés sostenido","Sustancias","Medicación","Déficit sensorial","Idioma/cultura","Enfermedad intercurrente","Ninguno identificado"]),
        q("interferentes_detalle","Gravedad, temporalidad, repercusión y acciones a valorar"),
        yes("riesgo_actual","¿Se han identificado necesidades de seguridad que exijan valoración clínica adicional?"),
        q("riesgo_detalle","Solo si procede: descripción, evaluación realizada y coordinación pertinente")
      ]),
    section("03 · Funcionamiento y repercusión",
      "Ancla la repercusión al funcionamiento habitual y diferencia capacidad, desempeño y apoyos.",
      [
        pick("impacto_global","Repercusión global actual",IMPACT),
        checks("ambitos_afectados","Ámbitos potencialmente afectados",["Hogar","Estudios","Trabajo","Relaciones sociales","Autocuidado","Gestión de salud/medicación","Economía","Movilidad/transportes","Participación comunitaria","Ninguno referido"]),
        pick("autonomia_general","Autonomía funcional global",["Autónoma sin apoyos","Autónoma con compensaciones","Necesita ayuda parcial","Necesita supervisión frecuente","Dependencia importante","No evaluada"]),
        pick("comparacion_premorbida","Cambios respecto al nivel previo",["No aprecia cambio","Leve","Moderado","Marcado","No valorable"]),
        q("funcionamiento","Ejemplos concretos de tareas, frecuencia, contexto, apoyos y evolución"),
        checks("fortalezas_check","Recursos y factores protectores",["Estrategias compensatorias","Red familiar/social","Motivación","Adherencia","Apoyos educativos/laborales","Autoconocimiento","Rutina estable","Otros"]),
        q("fortalezas","Capacidades preservadas, intereses, preferencias y necesidades prioritarias"),
        pick("prioridad_apoyos","Necesidad de apoyos identificada",["No identificada","Explorar","Recomendable","Prioritaria/urgente","No determinable"])
      ]),
    section("04 · Integración y trazabilidad profesional",
      "Registro de evaluación; no asigna diagnósticos de forma automática. Utiliza pruebas con manual y baremos pertinentes.",
      [
        checks("evidencia_base","Tipo de evidencia que sostiene los hallazgos",EVIDENCE),
        q("observacion","Observación clínica, conducta durante la entrevista y condiciones de exploración"),
        q("pruebas","Pruebas, forma de administración, normas, puntuaciones interpretables y fechas; no copies ítems protegidos"),
        pick("comparabilidad_normas","Adecuación de baremos e interpretación",["Adecuada","Precauciones necesarias","No adecuada / no comparable","No se han aplicado pruebas"]),
        checks("limitaciones","Limitaciones de evaluación",["Fatiga/esfuerzo","Barreras lingüísticas/culturales","Ausencia de informante","Historia evolutiva incompleta","Validez de ejecución pendiente","Condiciones sensoriales/motoras","Baremos inadecuados","Posible sesgo de derivación","Ninguna identificada"]),
        q("validez","Validez del rendimiento y del informe de síntomas: procedimientos y reservas interpretativas"),
        q("diferencial","Hipótesis principales, alternativas y evidencia a favor/en contra; no concluir solo por la entrevista"),
        q("integracion","Integración clínica provisional, necesidades de valoración adicional y próximos pasos"),
        pick("resultado_estado","Estado de interpretación",["Anamnesis en recogida","Evidencia insuficiente para conclusión","Pendiente de pruebas","Integración completa pendiente de revisión profesional"]),
        q("coordinacion","Coordinación, derivaciones y comunicaciones realizadas o propuestas")
      ])
  ];
  const profiles={
    tea_adultos:{
      title:"TEA en adultos",
      subtitle:"Historia evolutiva, reciprocidad/comunicación, patrones restringidos/repetitivos, adaptación, enmascaramiento y diferencial.",
      sources:[
        ["NICE CG142 · Autismo en adultos","https://www.nice.org.uk/guidance/cg142/chapter/recommendations"],
        ["NICE QS51 · Valoración diagnóstica","https://www.nice.org.uk/guidance/QS51/chapter/quality-statement-1-diagnostic-assessment-by-an-autism-team"]
      ],
      sections:[
        section("TEA · Historia del desarrollo y corroboración",
          "Explora presencia temprana, contexto evolutivo y acceso a fuentes retrospectivas.",
          [
            checks("tea_informantes","Fuentes del desarrollo disponibles",["Progenitores","Hermanos/familia extensa","Informes escolares","Informes pediátricos","Autoinforme retrospectivo","Ninguna"]),
            pick("tea_hitos","Hitos evolutivos relevantes",["Sin incidencias referidas","Retraso en algún área","Desarrollo atípico sin retraso global","Desconocido"]),
            q("tea_hitos_detalle","Lenguaje, juego simbólico, motricidad, regulación, intereses y ejemplos tempranos"),
            yes("tea_inicio_temprano","¿Hay datos compatibles con manifestaciones durante el período del desarrollo?"),
            q("tea_inicio_evidencia","Edad aproximada, contexto y fuente que documenta las primeras manifestaciones"),
            yes("tea_cambio_contextual","¿La expresión clínica cambió con las demandas sociales posteriores?"),
            q("tea_historico_social","Vínculos, juego, pertenencia al grupo, comprensión de normas implícitas y posibles experiencias de rechazo"),
            checks("tea_contextos","Contextos documentados",["Familia","Escuela","Amistades","Pareja","Trabajo","Entornos digitales","Otros"]),
            pick("tea_calidad_historia","Calidad de evidencia evolutiva",["Corroborada por varias fuentes","Corroboración parcial","Solo recuerdo retrospectivo","No disponible"])
          ]),
        section("TEA · Comunicación e interacción social (A)",
          "Exploración orientada a criterios clínicos; cada respuesta necesita ejemplos y repercusión para su interpretación.",
          [
            yes("tea_a_rec","¿Se describen dificultades persistentes de reciprocidad socioemocional?"),
            q("tea_a_rec_ej","Ejemplos: iniciar/mantener conversaciones, intercambio de intereses, ajuste recíproco y contexto"),
            yes("tea_a_nonverbal","¿Se identifican diferencias persistentes en comunicación no verbal?"),
            checks("tea_a_nonverbal_areas","Áreas exploradas",["Mirada","Gestos","Expresión facial","Prosodia","Integración verbal-no verbal","Distancia interpersonal"]),
            q("tea_a_nonverbal_ej","Ejemplos observados y referidos, y sus posibles interpretaciones culturales"),
            yes("tea_a_rel","¿Se describen dificultades persistentes para desarrollar, mantener o comprender relaciones?"),
            q("tea_a_rel_ej","Amistad, pareja, ajuste al contexto, reciprocidad y comprensión de expectativas implícitas"),
            pick("tea_a_impacto","Impacto funcional atribuible al área social-comunicativa",IMPACT),
            checks("tea_a_fuentes","Procedencia de los datos A",EVIDENCE)
          ]),
        section("TEA · Patrones repetitivos, intereses y sensorialidad (B)",
          "Distinguir frecuencia, trayectoria y consecuencias de cada fenómeno.",
          [
            yes("tea_b_mov","¿Movimientos, lenguaje o manipulación de objetos repetitivos relevantes?"),
            q("tea_b_mov_ej","Fenomenología, edad de inicio y función subjetiva"),
            yes("tea_b_rigidez","¿Necesidad de invariancia, ritualización o dificultad significativa con cambios?"),
            q("tea_b_rigidez_ej","Cambios de agenda, reglas, transiciones y respuesta emocional"),
            yes("tea_b_intereses","¿Intereses circunscritos o especialmente intensos por foco o dedicación?"),
            q("tea_b_intereses_ej","Temas, persistencia, intensidad, funcionalidad y comparadores del contexto"),
            yes("tea_b_sensorial","¿Hiper/hiporreactividad sensorial o intereses sensoriales atípicos?"),
            checks("tea_b_modalidades","Modalidades pertinentes",["Auditiva","Visual","Táctil","Gustativa/olfativa","Vestibular","Propioceptiva","Interoceptiva"]),
            q("tea_b_sensorial_ej","Detonantes, estrategias de regulación y repercusión"),
            pick("tea_b_frecuencia","Curso/frecuencia global de manifestaciones B",FREQ),
            checks("tea_b_fuentes","Procedencia de los datos B",EVIDENCE)
          ]),
        section("TEA · Adaptación, camuflaje y manifestaciones asociadas",
          "El camuflaje y el agotamiento no sustituyen por sí solos los criterios nucleares.",
          [
            yes("tea_masking","¿Refiere camuflaje, guiones sociales o adaptación deliberada de la conducta?"),
            checks("tea_masking_recursos","Estrategias referidas",["Imitación","Guiones conversacionales","Preparación previa","Supresión de conductas","Ajuste de contacto visual","Evitación"]),
            q("tea_masking_coste","Esfuerzo, agotamiento, recuperación, cambios entre contextos y evidencia"),
            checks("tea_adapt_areas","Áreas de adaptación exploradas",["Autocuidado","Gestión doméstica","Estudios","Empleo","Economía","Relaciones","Transiciones","Autogestión de salud"]),
            pick("tea_apoyos","Necesidad funcional de apoyo referida",["No identificada","Ocasional","Recurrente","Intensa","No valorada"]),
            yes("tea_regulacion","¿Se describen episodios de sobrecarga, bloqueo o pérdida de regulación?"),
            q("tea_regulacion_ej","Describir sin asumir etiquetas causales; antecedentes, duración y manejo")
          ]),
        section("TEA · Comorbilidad, diferencial y juicio clínico",
          "Contrastar el patrón global y el curso evolutivo con otras explicaciones.",
          [
            checks("tea_dif","Alternativas/condiciones concurrentes a valorar",["TDAH","Ansiedad social","Trastorno de ansiedad","TOC","Trauma/TEPT","Alteraciones afectivas","Trastornos de personalidad","Trastorno del lenguaje/pragmática","Psicosis","Discapacidad intelectual","Otros"]),
            q("tea_dif_datos","Argumentos a favor y en contra de las hipótesis alternativas"),
            yes("tea_criterio_func","¿Consta repercusión funcional clínicamente significativa?"),
            q("tea_criterio_func_ej","Ejemplos reales, apoyos compensatorios y dominios afectados"),
            yes("tea_explicacion_alternativa","¿Existe alguna explicación alternativa suficiente para el cuadro actual?"),
            q("tea_evaluacion_pendiente","Fuentes o pruebas adicionales a considerar y lagunas pendientes"),
            pick("tea_integracion_prov","Estado de la hipótesis TEA",["No valorable con datos actuales","Hipótesis por explorar","Evidencia compatible pendiente de integración","Hallazgos contradictorios","Requiere diferencial ampliado"])
          ])
      ]
    },
    memoria_deterioro:{
      title:"Memoria, deterioro cognitivo y demencias",
      subtitle:"Historia longitudinal, síndrome cognitivo, funcionamiento, informantes, etiologías y factores potencialmente reversibles.",
      sources:[
        ["NICE NG97 · Deterioro cognitivo y demencias","https://www.nice.org.uk/guidance/ng97/chapter/recommendations"],
        ["Alzheimer's Association · DETeCD-ADRD","https://alz-journals.onlinelibrary.wiley.com/doi/full/10.1002/alz.14333"]
      ],
      sections:[
        section("Memoria · Cronología y fuentes longitudinales",
          "Reconstruir el primer síntoma, el cambio con respecto al funcionamiento premórbido y la fiabilidad del informante.",
          [
            checks("mem_informantes","Fuentes de evolución",["Persona evaluada","Pareja","Hijos","Otros familiares","Personal cuidador/residencial","Informes médicos","Otro"]),
            pick("mem_informante_contacto","Frecuencia de contacto del informante principal",["Diaria","Varias veces por semana","Semanal","Esporádica","No consta"]),
            pick("mem_sintoma_inicial","Síntoma de inicio predominante",["Amnésico","Lenguaje","Visuoespacial","Ejecutivo/atencional","Conductual","Motor","Múltiple","Indeterminado"]),
            pick("mem_curso","Trayectoria evolutiva referida",["Insidiosa progresiva","Escalonada","Fluctuante","Súbita","Estable","Remitente","Indeterminada"]),
            date("mem_fecha_inicio","Fecha de inicio referida, si se conoce"),
            q("mem_evolucion_documentada","Línea temporal con hitos, episodios agudos y fuentes"),
            pick("mem_concordancia","Acuerdo entre persona e informante",["Coincide","Persona minimiza dificultades","Informante minimiza dificultades","Relatos distintos","Sin informante"]),
            q("mem_discrepancia_ej","Ejemplos y explicación posible de discrepancias"),
            yes("mem_alerta_aguda","¿Inicio agudo/fluctuación de conciencia/otros indicios que obliguen a descartar delirium o causa médica aguda?"),
            q("mem_alerta_accion","Si procede, evaluación médica/derivación realizada o recomendada")
          ]),
        section("Memoria · Perfil cognitivo y conductual",
          "Informar de cambios observables, no solamente puntuaciones de screening.",
          [
            pick("mem_episodica","Memoria de nueva información",IMPACT),
            pick("mem_remota","Memoria autobiográfica/remota",IMPACT),
            pick("mem_orientacion","Orientación temporal y espacial",IMPACT),
            pick("mem_lenguaje","Denominación, comprensión y fluidez",IMPACT),
            pick("mem_ejecutivas","Planificación, flexibilidad, juicio y resolución de problemas",IMPACT),
            pick("mem_atencion","Atención y velocidad",IMPACT),
            pick("mem_visuoespacial","Visuopercepción, orientación espacial y praxias",IMPACT),
            checks("mem_neuropsiq","Cambios neuropsiquiátricos o conductuales referidos",["Apatía","Desinhibición","Irritabilidad/agitación","Ansiedad","Síntomas depresivos","Alucinaciones/delirios","Cambios en apetito","Alteración sueño","Ninguno referido"]),
            q("mem_perfil_ejemplos","Ejemplos funcionales y observación vinculados a dominios alterados"),
            yes("mem_fluctuaciones","¿Fluctuaciones cognitivas destacables en el día o semana?"),
            yes("mem_alucinaciones","¿Alucinaciones visuales recurrentes u otros fenómenos perceptivos?"),
            yes("mem_parkinsonismo","¿Signos motores extrapiramidales referidos o documentados?"),
            yes("mem_conducta_sueno","¿Conductas nocturnas sugerentes de alteración del sueño REM?"),
            q("mem_otros_sindromes","Elementos sugerentes de perfiles frontotemporal, vascular u otros; interpretación cautelosa")
          ]),
        section("Memoria · AVD y riesgos cotidianos",
          "Graduar cada dominio funcional según el nivel previo y el apoyo disponible.",
          [
            pick("mem_avd_higiene","Aseo y vestido",["Independiente","Con ayuda puntual","Supervisión habitual","Dependiente","No valorado"]),
            pick("mem_avd_aliment","Alimentación",["Independiente","Con ayuda puntual","Supervisión habitual","Dependiente","No valorado"]),
            pick("mem_aivd_finanzas","Administración de dinero y pagos",["Independiente","Con ayuda puntual","Supervisión habitual","Dependiente","No valorado"]),
            pick("mem_aivd_farmacos","Gestión de medicación",["Independiente","Con ayuda puntual","Supervisión habitual","Dependiente","No valorado"]),
            pick("mem_aivd_compras","Compras, cocina y hogar",["Independiente","Con ayuda puntual","Supervisión habitual","Dependiente","No valorado"]),
            pick("mem_aivd_transporte","Desplazamientos y orientación fuera de casa",["Independiente","Con ayuda puntual","Supervisión habitual","Dependiente","No valorado"]),
            pick("mem_aivd_tecnologia","Teléfono, gestiones y tecnología habitual",["Independiente","Con ayuda puntual","Supervisión habitual","Dependiente","No valorado"]),
            checks("mem_riesgos","Situaciones de riesgo exploradas",["Errores de medicación","Caídas","Extravíos","Cocina/gas","Conducción","Estafas/vulnerabilidad financiera","Autonegligencia","Sobrecarga cuidador","Ninguna identificada"]),
            q("mem_avd_cambio","Capacidades previas, fecha de pérdida, ejemplos y compensaciones"),
            pick("mem_supervision","Apoyo / supervisión requerida",["Sin apoyos","Recordatorios puntuales","Ayuda recurrente","Supervisión diaria","Apoyo continuado","No determinado"]),
            q("mem_preferencias","Preferencias expresadas, decisiones concretas que se evalúan y medidas de apoyo pertinentes")
          ]),
        section("Memoria · Contexto médico y factores explicativos",
          "La anamnesis no sustituye la valoración médica para establecer etiología.",
          [
            checks("mem_medicos","Factores a contrastar",["Enfermedad cerebrovascular","Factores de riesgo vascular","Epilepsia","Traumatismo craneal","Apnea de sueño","Déficit sensorial","Depresión","Polifarmacia","Anticolinérgicos/sedantes","Alcohol/sustancias","Enfermedad sistémica","Otro"]),
            yes("mem_medica_revision","¿Consta revisión médica reciente de posibles causas tratables?"),
            q("mem_medicina","Analíticas, neuroimagen, pruebas complementarias y fechas disponibles"),
            pick("mem_estadificacion","Estadificación funcional provisional",["Sin evidencia de pérdida funcional","Queja con autonomía conservada","Deterioro con afectación funcional pendiente de graduar","Dependencia funcional relevante","No clasificable"]),
            q("mem_premorbido","Escolaridad, ocupación, autonomía previa y reserva cognitiva"),
            yes("mem_hipotesis_dcl","¿Se contempla un síndrome de deterioro cognitivo leve?"),
            yes("mem_hipotesis_tnc","¿Se contempla trastorno neurocognitivo mayor?"),
            q("mem_diferencial","Alternativas y datos a favor/en contra; especificar qué falta para etiología"),
            q("mem_cuidador","Situación del cuidador, recursos y necesidades de coordinación"),
            q("mem_pruebas_recomendadas","Plan de evaluación neuropsicológica y médica según pregunta clínica")
          ])
      ]
    },
    altas_capacidades:{
      title:"Altas capacidades intelectuales",
      subtitle:"Perfil de aptitudes, trayectoria de aprendizaje, talentos, contexto, doble excepcionalidad y necesidades educativas o funcionales.",
      sources:[
        ["NAGC · Evaluaciones y pruebas","https://www.nagc.org/assessments-and-tests"],
        ["NAGC · Identificación de perfiles diversos","https://www.nagc.org/identifying-gifted-children-from-diverse-populations"]
      ],
      sections:[
        section("Altas capacidades · Demanda e historia evolutiva",
          "El concepto de altas capacidades no equivale a un único umbral de CI.",
          [
            pick("aac_finalidad","Finalidad de la valoración",["Identificación inicial","Comprender discrepancia de rendimiento","Necesidades educativas","Perfil adulto","Segunda opinión","Otra"]),
            pick("aac_edad_deteccion","Primera percepción de aptitudes excepcionales",["Primera infancia","Primaria","Secundaria","Edad adulta","No identificada"]),
            yes("aac_lenguaje_precoz","¿Lenguaje/lectura temprana o aprendizaje acelerado referido?"),
            yes("aac_curiosidad","¿Curiosidad intensa o profundización autónoma mantenida?"),
            q("aac_historia_ej","Ejemplos concretos, edad, contexto y comparadores pertinentes"),
            checks("aac_fuentes","Fuentes de información",["Paciente","Familia","Profesorado","Orientación educativa","Calificaciones","Portafolio/productos","Observación","Otras"]),
            q("aac_fuentes_ej","Concordancia entre fuentes y particularidades socioculturales"),
            yes("aac_contex_barrera","¿Hay barreras idiomáticas, socioeconómicas o de acceso a oportunidades?"),
            q("aac_barrera_ej","Impacto de oportunidades, ambiente, migración o desigualdades")
          ]),
        section("Altas capacidades · Aptitudes, rendimiento y creatividad",
          "Caracterización multidimensional; la entrevista no sustituye una evaluación psicométrica.",
          [
            checks("aac_dominios","Fortalezas referidas",["Razonamiento verbal","Razonamiento fluido","Visuoespacial","Memoria de trabajo","Procesamiento","Creatividad","Área artística","Área académica específica","Liderazgo","Otra"]),
            pick("aac_rendimiento","Relación entre aptitud percibida y rendimiento",["Concordante alto","Variable según área","Infra-rendimiento","Datos insuficientes"]),
            yes("aac_aprendizaje_rapido","¿Aprendizaje acelerado ante contenidos novedosos?"),
            yes("aac_transferencia","¿Transferencia y conexiones originales entre dominios?"),
            yes("aac_creatividad","¿Producción creativa verificable o soluciones originales?"),
            q("aac_evidencias","Ejemplos observables, logros y productos, evitando juicios basados en impresiones"),
            checks("aac_perfil_desigual","Asincronías/diferencias de desempeño",["Verbal/no verbal","Aptitud/rendimiento","Razonamiento/velocidad","Intereses/motivación","Cognición/autorregulación","No identificado"]),
            q("aac_perfil_especifico","Resultados de pruebas y baremos adecuados, si constan"),
            pick("aac_motivacion","Vinculación y motivación ante tareas",["Alta","Variable","Baja","Condicionada por interés","No explorado"])
          ]),
        section("Altas capacidades · Experiencia académica y adaptación",
          "Documentar oportunidades de aprendizaje, apoyos previos y respuesta a cambios.",
          [
            checks("aac_escolar","Contextos de desempeño",["Educación formal","Formación no formal","Trabajo","Autodidacta","Otro"]),
            yes("aac_aburrimiento","¿Infradesafío o aburrimiento persistente en actividades habituales?"),
            yes("aac_perfeccionismo","¿Perfeccionismo desadaptativo o evitación del error?"),
            yes("aac_regulacion","¿Dificultades en autorregulación, planificación o tolerancia a frustración?"),
            yes("aac_ajuste_social","¿Dificultades con pares o sentido de pertenencia?"),
            q("aac_ajuste_ej","Ejemplos de necesidades de ajuste, relación con compañeros y bienestar emocional"),
            checks("aac_intervenciones","Medidas ya implementadas",["Enriquecimiento","Aceleración","Flexibilización curricular","Mentoría","Apoyo emocional","Ninguna","Otra"]),
            pick("aac_respuesta","Respuesta a adaptaciones",["Mejora clara","Mejora parcial","Sin cambio","No implementadas","Desconocida"]),
            q("aac_intervenciones_resultado","Cambios observados y condiciones de implementación")
          ]),
        section("Altas capacidades · Doble excepcionalidad y conclusiones",
          "Valorar explicaciones concurrentes, no inferir diagnóstico por rasgos.",
          [
            checks("aac_doble_hip","Dificultades concurrentes por explorar",["TDAH","TEA","Lectoescritura","Matemáticas","Ansiedad","Estado de ánimo","Función ejecutiva","Ninguna planteada"]),
            q("aac_doble_ej","Historia, pruebas y funcionamiento que justifican cada hipótesis"),
            pick("aac_normas","Adecuación de baremos/contexto",["Adecuados","Requiere cautela","Inadecuados","Pendiente de pruebas"]),
            yes("aac_informe_doc","¿Se dispone de evidencias objetivas suficientes para describir el perfil?"),
            q("aac_recomendaciones","Necesidades educativas, ajustes razonables y apoyos a evaluar"),
            q("aac_interpretacion","Conclusión provisional con incertidumbres y referencias al contexto")
          ])
      ]
    },
    dislexia:{
      title:"Dislexia y lectoescritura",
      subtitle:"Historia de alfabetización, exactitud, fluidez, decodificación, fonología, ortografía, lenguas y respuesta educativa.",
      sources:[
        ["International Dyslexia Association · Testing & Evaluation","https://dyslexiaida.org/testing-and-evaluation/"],
        ["IDA · Assessment Guidelines","https://dyslexiaida.org/wp-content/uploads/2023/10/IDA-Assessment-Guidelines_For-Web.pdf"]
      ],
      sections:[
        section("Dislexia · Desarrollo y enseñanza de la lectoescritura",
          "Situar los síntomas según edad, curso escolar, idioma y oportunidades de instrucción.",
          [
            pick("dis_edad_inicio","Edad/etapa de primeras dificultades",["Educación infantil","Primaria inicial","Primaria avanzada","Secundaria","Edad adulta","No identificada"]),
            q("dis_metodo","Enseñanza de lectura y escritura recibida, interrupciones y escolaridad"),
            checks("dis_lenguas","Lenguas utilizadas",["Catalán","Castellano","Otra lengua escolar","Otra lengua familiar","Educación bilingüe/multilingüe"]),
            q("dis_lenguas_nivel","Nivel funcional oral/escrito y edad de adquisición por lengua"),
            yes("dis_antecedentes","¿Se describen antecedentes familiares de dificultades lectoras persistentes?"),
            q("dis_historia","Hitos del lenguaje oral, acceso fonológico y apoyos recibidos"),
            yes("dis_persistencia","¿Las dificultades persisten pese a enseñanza e intervención apropiadas?"),
            q("dis_evidencia_curso","Boletines, informes, muestras históricas y trayectorias de intervención"),
            pick("dis_impacto_escolar","Repercusión global en aprendizaje/ocupación",IMPACT)
          ]),
        section("Dislexia · Lectura de palabras, pseudopalabras y fluidez",
          "Distinguir precisión, automatización, comprensión y diferencias entre modalidades.",
          [
            pick("dis_exactitud","Exactitud de lectura de palabras",IMPACT),
            pick("dis_pseudopalabras","Decodificación de secuencias novedosas/pseudopalabras",IMPACT),
            pick("dis_velocidad","Velocidad y automatización lectora",IMPACT),
            pick("dis_fluidez","Fluidez, pausas y prosodia en lectura conectada",IMPACT),
            pick("dis_comprension","Comprensión lectora",IMPACT),
            pick("dis_oral","Comprensión oral comparada con la lectura",["Similar","Oral notablemente mejor","Lectora mejor","Variable","No valorable"]),
            checks("dis_errores","Errores observados/referidos",["Sustituciones","Omisiones","Inversiones","Adiciones","Lectura silábica","Autocorrecciones frecuentes","Evitación","Otros"]),
            q("dis_lectura_ej","Ejemplos, materiales, tiempo, condiciones y muestras de ejecución"),
            q("dis_lectura_normas","Pruebas y puntuaciones normativas por edad, escolaridad y lengua")
          ]),
        section("Dislexia · Procesamiento lingüístico y escritura",
          "Registrar resultados observados; no convertir síntomas aislados en criterios.",
          [
            pick("dis_conciencia_fonol","Conciencia fonológica/fonémica",IMPACT),
            pick("dis_ran","Denominación automatizada rápida",IMPACT),
            pick("dis_memoria_fonol","Memoria fonológica y repetición de secuencias",IMPACT),
            pick("dis_grafema_fonema","Correspondencia grafema-fonema y automatización",IMPACT),
            pick("dis_ortografia","Ortografía natural/arbitraria y reglas",IMPACT),
            pick("dis_expresion","Redacción, planificación y coherencia escrita",IMPACT),
            pick("dis_motricidad","Grafomotricidad y legibilidad",IMPACT),
            q("dis_escritura_ej","Errores, muestras de escritura, contexto y discrepancia oral-escrita"),
            q("dis_medidas","Instrumentos y normas de lectoescritura aplicados")
          ]),
        section("Dislexia · Diagnóstico diferencial e intervención",
          "Considerar instrucción insuficiente, dificultades sensoriales, lenguaje y condiciones concurrentes.",
          [
            checks("dis_diferencial","Condiciones y factores a estudiar",["Trastorno del desarrollo del lenguaje","TDAH","Dificultades intelectuales globales","Déficits sensoriales","Instrucción insuficiente","Ausentismo","Factores lingüísticos","Ansiedad/evitación","Disgrafía","Otra"]),
            yes("dis_sensory","¿Se ha comprobado la adecuación funcional de visión y audición?"),
            pick("dis_intervencion","Respuesta a apoyo/enseñanza explícita",["Mejoría significativa","Mejoría parcial","Escasa respuesta","Sin intervención documentada","No consta"]),
            q("dis_apoyos","Tipo de intervención, frecuencia, duración, fidelidad y resultados"),
            checks("dis_impactos","Ámbitos afectados",["Exámenes","Lectura recreativa","Expresión escrita","Estudio autónomo","Empleo","Autoestima","Otros"]),
            q("dis_evidencia_insuficiente","Datos faltantes, explicaciones alternativas y seguimiento previsto"),
            q("dis_ajustes","Ajustes razonables, orientaciones y apoyos a considerar")
          ])
      ]
    },
    neuropsicologia_general:{
      title:"Evaluación neuropsicológica general",
      subtitle:"Caracterización por dominios, etiología, autonomía, premórbido, validez y objetivos de evaluación.",
      sources:[
        ["AACN · Consenso sobre evaluación de validez","https://www.tandfonline.com/doi/full/10.1080/13854046.2021.1896036"],
        ["NLM · Neuropsychological Assessment","https://www.ncbi.nlm.nih.gov/books/NBK513310/"]
      ],
      sections:[
        section("Neuropsicología · Antecedentes y funcionamiento premórbido",
          "Describir trastorno o evento, antecedentes de comparación y pregunta de derivación.",
          [
            checks("neuro_motivos","Motivos principales de valoración",["Queja cognitiva","Neurología","Neurodesarrollo","Daño cerebral adquirido","Seguimiento","Autonomía","Rehabilitación","Valoración de capacidades","Otro"]),
            pick("neuro_etiologia_principal","Contexto etiológico conocido",["Sin causa identificada","Neurodesarrollo","Vascular","Traumático","Neurodegenerativo","Epilepsia","Inflamatorio/infeccioso","Oncológico","Metabólico/tóxico","Otro"]),
            date("neuro_evento_fecha","Fecha de episodio índice, si existe"),
            q("neuro_medico","Historia neurológica y médica, neuroimagen, tratamientos y fechas"),
            pick("neuro_curso","Curso de dificultades",["Desde infancia","Agudo","Subagudo","Estable","Progresivo","Fluctuante","En recuperación","No claro"]),
            q("neuro_premorbido","Escolaridad, ocupación, habilidades previas, lecturas, idioma y reserva"),
            checks("neuro_informantes","Fuentes de contraste",["Paciente","Familia","Equipo sanitario","Centro educativo","Centro laboral","Informes previos"]),
            q("neuro_demanda_ej","Dificultades prioritarias, ejemplos y objetivos funcionales")
          ]),
        section("Neuropsicología · Perfil cognitivo referido y observado",
          "Separar queja subjetiva, cambios funcionales, observación e instrumentos.",
          [
            pick("neuro_atencion_sost","Atención sostenida/selectiva/dividida",IMPACT),
            pick("neuro_velocidad","Velocidad de procesamiento",IMPACT),
            pick("neuro_memoria_nueva","Aprendizaje y memoria episódica",IMPACT),
            pick("neuro_trabajo","Memoria de trabajo",IMPACT),
            pick("neuro_inhibicion","Inhibición y autorregulación",IMPACT),
            pick("neuro_flexibilidad","Flexibilidad cognitiva",IMPACT),
            pick("neuro_planificacion","Planificación, organización y juicio",IMPACT),
            pick("neuro_lenguaje","Denominación, fluidez y comprensión del lenguaje",IMPACT),
            pick("neuro_visuoesp","Visuopercepción, construcción y orientación espacial",IMPACT),
            pick("neuro_praxias","Praxias, coordinación y habilidades motoras",IMPACT),
            pick("neuro_academico","Lectura/escritura/cálculo cuando corresponda",IMPACT),
            q("neuro_patron_ej","Patrón temporal y ejemplos concretos de dominios afectados/preservados")
          ]),
        section("Neuropsicología · Salud, conducta y adaptación",
          "Integrar factores emocionales, sensoriales y funcionales sin inferir causalidad automática.",
          [
            checks("neuro_emocional","Factores emocionales/conductuales",["Ansiedad","Depresión","Apatía","Irritabilidad","Impulsividad","Alteraciones sueño","Dolor","Fatiga","Sin datos"]),
            checks("neuro_sensory","Factores de administración",["Visión","Audición","Motricidad","Dolor","Fatiga","Barreras idiomáticas","Medicación","Interrupciones","Ninguno"]),
            pick("neuro_avd","Autonomía en AVD básicas",["Conservada","Ayuda puntual","Supervisión","Dependencia","No valorada"]),
            pick("neuro_aivd","Autonomía en AIVD",["Conservada","Ayuda puntual","Supervisión","Dependencia","No valorada"]),
            pick("neuro_educacion_laboral","Rendimiento escolar/laboral",["Conservado","Cambio leve","Cambio moderado","Cambio marcado","No valorado"]),
            q("neuro_funcional_ej","Ejemplos ecológicos, adaptaciones utilizadas y fechas de cambio"),
            checks("neuro_proteccion","Fortalezas y apoyos",["Reserva/competencias premórbidas","Apoyo social","Estrategias","Motivación","Adherencia","Recursos ambientales","Otros"]),
            q("neuro_salud_contexto","Factores modificadores y su posible relación temporal con el rendimiento")
          ]),
        section("Neuropsicología · Protocolo, validez y diferencial",
          "Para pruebas psicométricas usar manuales, condiciones de administración y baremos autorizados.",
          [
            checks("neuro_dominios_bateria","Dominios previstos para pruebas",["Atención/velocidad","Memoria verbal","Memoria visual","Ejecutivas","Lenguaje","Visuoespacial","Funciones académicas","Conducta/adaptación","Validez"]),
            pick("neuro_validez_plan","Evaluación de validez del rendimiento y síntomas",["Planificada","Realizada e interpretable","Realizada con reservas","No realizada","No aplicable con justificación"]),
            q("neuro_validez_datos","Pruebas/indicadores de validez y fundamento de interpretación"),
            pick("neuro_baremos","Representatividad de baremos",["Adecuados","Con cautelas","No adecuados","Pendientes de selección"]),
            q("neuro_resultados","Perfil de puntuaciones y hallazgos observables, con validez y normas"),
            checks("neuro_diferencial_check","Hipótesis alternativas/coexistentes",["Afectiva","Sueño/fatiga","Farmacológica","Déficit sensorial","Neurodesarrollo","Vascular","Neurodegenerativa","Lesión focal","Funcional","Otras"]),
            q("neuro_diferencial_raz","Datos que respaldan/contradicen cada hipótesis"),
            pick("neuro_cierre","Estado de conclusión",["Entrevista en curso","Pendiente de pruebas","Pendiente de integrar fuentes","Integración provisional con limitaciones"]),
            q("neuro_plan","Objetivos de intervención, derivaciones, apoyos y seguimiento")
          ])
      ]
    }
  };
  const checkKey=/^[a-z][a-z0-9_]*$/;
  const keys=new Set();
  for(const group of [...common,...Object.values(profiles).flatMap(v=>v.sections)]){
    for(const item of group.questions){
      if(!checkKey.test(item.key))throw Error("Clave de anamnesis inválida");
      if(!item.label)throw Error("Pregunta sin texto");
      if(!["textarea","text","select","checks","date","number"].includes(item.kind))throw Error("Tipo de respuesta desconocido");
    }
  }
  for(const [key,profile] of Object.entries(profiles)){
    keys.clear();
    for(const group of [...common,...profile.sections]){
      for(const item of group.questions){
        if(keys.has(item.key))throw Error("Pregunta duplicada en "+key+": "+item.key);
        keys.add(item.key);
      }
    }
  }
  window.ClinicAnamnesisForms=Object.freeze({
    version:"2.0", common, profiles,
    isAnswer(value){return Array.isArray(value)?value.length>0:value!==null&&value!==undefined&&String(value).trim()!=="";},
    format(value){return Array.isArray(value)?value.join(", "):String(value??"");}
  });
})();