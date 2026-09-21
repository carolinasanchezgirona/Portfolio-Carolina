const SUPABASE_URL=Deno.env.get("SUPABASE_URL")??"";
const ANON_KEY=Deno.env.get("SUPABASE_ANON_KEY")??"";
const ALLOWED_USER_ID="9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
const GATEWAY_KEY=Deno.env.get("AI_GATEWAY_API_KEY")??"";
const MODEL="openai/gpt-5.6-sol";
const cors={"Access-Control-Allow-Origin":"https://carolinasanchezgirona.com","Access-Control-Allow-Headers":"authorization, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};

function json(body:Record<string,unknown>,status=200){
  return new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json; charset=utf-8"}});
}
function cleanText(value:unknown,max=1800){
  return String(value??"").slice(0,max)
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,"[correo omitido]")
    .replace(/(?:\+34\s*)?(?:\d[\s.-]*){9,}/g,"[teléfono omitido]")
    .replace(/\b\d{8}[A-Z]\b/gi,"[identificador omitido]");
}
async function currentUser(req:Request){
  const authorization=req.headers.get("Authorization")??"";
  if(!authorization)return null;
  const response=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:ANON_KEY,Authorization:authorization}});
  if(!response.ok)return null;
  return await response.json();
}
function outputText(data:any){
  if(typeof data?.output_text==="string")return data.output_text;
  for(const item of data?.output??[]){
    for(const part of item?.content??[]){
      if((part?.type==="output_text"||part?.type==="text")&&typeof part?.text==="string")return part.text;
    }
  }
  return "";
}

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
  if(req.method!=="POST")return json({error:"Método no permitido"},405);

  const user=await currentUser(req);
  if(!user)return json({error:"Sesión no válida"},401);
  if(user.id!==ALLOWED_USER_ID)return json({error:"No autorizado"},403);

  if(!GATEWAY_KEY)return json({error:"IA no configurada",code:"ai_not_configured"},503);

  let body:any;
  try{body=await req.json()}catch{return json({error:"JSON no válido"},400)}

  const base=body?.base;
  const spec=body?.spec;
  if(!base||!spec)return json({error:"Faltan datos de la actividad"},400);

  const safeContext=cleanText(spec.context,1400);
  const system=`Eres un asistente de redacción clínica para una psicóloga sanitaria y neuropsicóloga.
Tu función es enriquecer una actividad terapéutica YA DISEÑADA por un motor clínico.
NO diagnostiques, NO infieras rasgos personales, NO atribuyas causalidad, NO añadas técnicas, mecanismos ni objetivos que no estén en el borrador.
Mantén exactamente la arquitectura clínica dada. Puedes mejorar claridad, ejemplos, secuencia, tono y adaptación práctica.
No incluyas datos identificativos ni menciones nombres propios.
La versión profesional debe usar lenguaje clínico preciso; la versión paciente debe ser clara, respetuosa y no infantilizante.
No prometas resultados. No presentes hipótesis como hechos.
Devuelve exclusivamente JSON válido conforme al esquema.`;

  const payload={
    model:MODEL,
    reasoning:{effort:"low"},
    input:[
      {role:"system",content:[{type:"input_text",text:system}]},
      {role:"user",content:[{type:"input_text",text:JSON.stringify({
        task:"Enriquece esta actividad manteniendo intactos objetivo, mecanismos y técnicas.",
        context:safeContext,
        specification:{...spec,context:undefined},
        allowed_mechanisms:base.professional?.mechanisms??[],
        allowed_techniques:base.professional?.techniques??[],
        activity:base
      })}]}
    ],
    text:{format:{
      type:"json_schema",
      name:"clinical_activity",
      strict:true,
      schema:{
        type:"object",
        additionalProperties:false,
        properties:{
          title:{type:"string"},
          summary:{type:"string"},
          professional:{
            type:"object",additionalProperties:false,
            properties:{
              purpose:{type:"string"},
              rationale:{type:"string"},
              mechanisms:{type:"array",items:{type:"string"}},
              techniques:{type:"array",items:{type:"string"}},
              indications:{type:"array",items:{type:"string"}},
              cautions:{type:"array",items:{type:"string"}},
              steps:{type:"array",items:{type:"string"}},
              questions:{type:"array",items:{type:"string"}},
              close:{type:"string"}
            },
            required:["purpose","rationale","mechanisms","techniques","indications","cautions","steps","questions","close"]
          },
          patient:{
            type:"object",additionalProperties:false,
            properties:{
              intro:{type:"string"},
              steps:{type:"array",items:{type:"string"}},
              reflection:{type:"array",items:{type:"string"}},
              homework:{type:"string"}
            },
            required:["intro","steps","reflection","homework"]
          }
        },
        required:["title","summary","professional","patient"]
      }
    }}
  };

  const response=await fetch("https://ai-gateway.vercel.sh/v1/responses",{
    method:"POST",
    headers:{"Authorization":`Bearer ${GATEWAY_KEY}`,"Content-Type":"application/json"},
    body:JSON.stringify(payload)
  });

  const data=await response.json().catch(()=>null);
  if(!response.ok)return json({error:"No se ha podido generar la adaptación con IA",detail:data?.error?.message??null},502);

  const raw=outputText(data);
  if(!raw)return json({error:"La IA no devolvió contenido utilizable"},502);

  let enriched:any;
  try{enriched=JSON.parse(raw)}catch{return json({error:"La respuesta de IA no tiene un formato válido"},502)}

  const baseMechanisms=JSON.stringify(base.professional?.mechanisms??[]);
  const baseTechniques=JSON.stringify(base.professional?.techniques??[]);
  if(JSON.stringify(enriched.professional?.mechanisms??[])!==baseMechanisms ||
     JSON.stringify(enriched.professional?.techniques??[])!==baseTechniques){
    return json({error:"La IA intentó modificar la arquitectura clínica y la respuesta fue descartada."},422);
  }

  return json({ok:true,model:MODEL,enriched});
});