import { jsPDF } from "jspdf";

export type ConsentKind = "psicologico" | "neuro_evaluacion" | "neuro_intervencion";
export const CONSENT_VERSION = "2026-11-09";

type Patient = { full_name: string; birth_date?: string | null; national_id?: string | null };
const contents: Record<ConsentKind,{title:string;lead:string;procedures:string[];effects:string;scope:string}> = {
  psicologico: {
    title:"Consentimiento informado para atención psicológica",
    lead:"Evaluación clínica e intervención psicológica sanitaria individualizada.",
    procedures:[
      "Entrevistas clínicas, antecedentes relevantes y, cuando proceda, cuestionarios o instrumentos de evaluación.",
      "Formulación clínica, propuesta de objetivos y plan de intervención, que podrán revisarse con la persona atendida.",
      "Técnicas psicológicas fundamentadas en la evidencia, escogidas según la indicación clínica y las preferencias del paciente.",
      "Seguimiento, devolución de información, coordinación o derivación cuando exista indicación."
    ],
    effects:"Al trabajar situaciones o emociones difíciles puede aparecer malestar temporal, cansancio o cambios en la percepción de los problemas. No se garantizan resultados concretos.",
    scope:"Acepto el proceso de evaluación e intervención psicológica individual descrito."
  },
  neuro_evaluacion:{
    title:"Consentimiento informado para evaluación neuropsicológica",
    lead:"Evaluación de funciones cognitivas, emocionales y funcionales según la indicación clínica.",
    procedures:[
      "Entrevista clínica y funcional, antecedentes personales y revisión de informes que se aporten voluntariamente.",
      "Administración y corrección de pruebas estandarizadas de memoria, atención, lenguaje, funciones ejecutivas y otros dominios pertinentes.",
      "Integración de resultados con escolaridad, estado emocional, factores sensoriales, contexto y limitaciones de las pruebas.",
      "Devolución de conclusiones, orientación clínica y recomendaciones, con informe cuando se haya acordado."
    ],
    effects:"La exploración puede producir cansancio, frustración o malestar transitorio. Los resultados no determinan por sí solos un diagnóstico, un grado de discapacidad ni la capacidad jurídica.",
    scope:"Acepto exclusivamente la evaluación neuropsicológica descrita. Una intervención posterior necesitará información y acuerdo adicionales."
  },
  neuro_intervencion:{
    title:"Consentimiento informado para intervención neuropsicológica",
    lead:"Rehabilitación, entrenamiento, estimulación o intervención neuropsicológica individualizada.",
    procedures:[
      "Determinación conjunta de objetivos cognitivos y funcionales a partir de la información clínica disponible.",
      "Ejercicios de rehabilitación o estimulación, estrategias compensatorias y psicoeducación según las necesidades.",
      "Entrenamiento de familiares o cuidadores cuando proceda y exista habilitación para compartir información.",
      "Seguimiento de los objetivos, reevaluación y ajuste de las intervenciones indicadas."
    ],
    effects:"Las actividades pueden provocar fatiga, frustración o malestar transitorio. No se garantiza la recuperación cognitiva ni una magnitud específica de mejoría.",
    scope:"Acepto exclusivamente la intervención neuropsicológica descrita. Otras evaluaciones se acordarán por separado."
  }
};
const clean=(text:unknown,limit=180)=>typeof text==="string"?text.replace(/[\r\n\t]+/g," ").trim().slice(0,limit):"";
export async function buildClinicalConsentPdf(patient:Patient, kind:ConsentKind, documentId:string):Promise<Uint8Array>{
  const info=contents[kind];
  const pdf=new jsPDF({unit:"mm",format:"a4",compress:true});
  pdf.setProperties({title:info.title,author:"Carolina Sánchez Girona",subject:"Consentimiento clínico informado, versión "+CONSENT_VERSION});
  let y=21;
  const maxY=271;
  function ensure(height:number){if(y+height>maxY){pdf.addPage();y=23;}}
  function paragraph(text:string,size=10,space=5){
    pdf.setFont("helvetica","normal");pdf.setFontSize(size);pdf.setTextColor(35,48,56);
    const lines=pdf.splitTextToSize(text,169) as string[];
    ensure(lines.length*5.0+space);
    for(const line of lines){ensure(5.0);pdf.text(line,20,y);y+=5;}
    y+=space;
  }
  function section(title:string){
    ensure(12);pdf.setFont("helvetica","bold");pdf.setFontSize(11);pdf.setTextColor(62,87,101);pdf.text(title,20,y);y+=8;
  }
  pdf.setFont("helvetica","bold");pdf.setFontSize(18);pdf.setTextColor(70,103,118);
  const titleLines=pdf.splitTextToSize(info.title,168) as string[];
  for(const line of titleLines){pdf.text(line,20,y);y+=9;}
  y+=3;
  paragraph("Versión: "+CONSENT_VERSION+"  |  ID del ejemplar: "+documentId,9,4);
  paragraph("Paciente: "+clean(patient.full_name)+"  |  Nacimiento: "+(clean(patient.birth_date)||"No consta"),10,2);
  paragraph("Documento identificativo: "+(clean(patient.national_id)||"No consta"),10,4);
  paragraph("Profesional que informa: Carolina Sánchez Girona, Psicóloga General Sanitaria y neuropsicóloga, COPC 24892.",10,5);
  section("1. Finalidad");
  paragraph(info.lead+" El procedimiento concreto debe explicarse al paciente y adaptarse a su situación clínica; las técnicas adicionales de naturaleza diferente se informarán y acordarán por separado.");
  section("2. Procedimientos previstos");
  for(const item of info.procedures) paragraph("- "+item,10,2);
  y+=4;
  section("3. Beneficios, riesgos, alternativas y límites");
  paragraph("Se pretende comprender el funcionamiento y las dificultades y orientar decisiones o estrategias clínicas. Es posible optar por otras intervenciones, derivación, una evaluación diferente o no iniciar el proceso, valorando sus consecuencias.");
  paragraph(info.effects);
  section("4. Confidencialidad y terceros");
  paragraph("La información clínica está sujeta a secreto profesional y a las excepciones legales. Este consentimiento no autoriza de forma general comunicaciones a familiares, centros educativos, empresas o terceros. Grabaciones, difusión de imágenes o uso de información identificable para docencia o investigación requieren su propia habilitación.");
  section("5. Modalidad online");
  paragraph("Cuando exista modalidad telemática se acordarán el canal y las precauciones de confidencialidad. No se graban sesiones por defecto. Las pruebas que no admitan administración remota válida se realizarán mediante procedimientos alternativos.");
  section("6. Protección de datos");
  paragraph("Responsable: Carolina Sánchez Girona. El tratamiento clínico necesario para asistencia y la historia clínica se basa en los fundamentos jurídicos aplicables, incluidos los arts. 6.1.b/6.1.c y 9.2.h RGPD. Este documento no constituye un consentimiento RGPD general. Información completa: https://carolinasanchezgirona.com/privacidad/.");
  section("7. Autonomía, dudas y retirada");
  paragraph("La persona atendida puede preguntar, rechazar procedimientos concretos y retirar su consentimiento asistencial. Se le explicarán las consecuencias de su decisión, sin afectar a los deberes legales de custodia de la historia clínica. Si interviene una persona representante, deberán acreditarse las facultades de representación y la participación del paciente conforme a la normativa aplicable.");
  section("8. Declaración para la firma electrónica");
  paragraph("Declaro que he recibido información suficiente sobre la finalidad, naturaleza, riesgos previsibles, alternativas y límites; que he tenido oportunidad real de formular preguntas y que mi decisión es libre.");
  paragraph(info.scope);
  paragraph("Esta copia se ha preparado para su eventual firma electrónica por un procedimiento separado. LA GENERACIÓN DEL PDF NO ES UNA FIRMA. Si se utiliza aceptación electrónica simple desde el portal, deben conservarse el PDF original y un acta de la declaración autenticada; esta modalidad no es firma avanzada ni cualificada. Si se utiliza certificado digital, deberá verificarse externamente la firma del PDF.",9,4);
  section("Constancia de la información facilitada");
  paragraph("Profesional responsable: Carolina Sánchez Girona  |  Lugar y fecha de explicación: __________________________",9,2);
  paragraph("Si firma un representante: identidad, vínculo y acreditación de representación que debe verificarse: __________________________",9,5);
  const total=pdf.getNumberOfPages();
  for(let p=1;p<=total;p++){pdf.setPage(p);pdf.setFontSize(8);pdf.setTextColor(118,130,138);pdf.text("Documento base para firma electrónica · "+CONSENT_VERSION,20,285);pdf.text("Página "+p+" de "+total,177,285);}
  return new Uint8Array(pdf.output("arraybuffer"));
}
