import type { Metadata } from "next";
export const metadata: Metadata = {title:"Suscríbete a recursos gratuitos",description:"Recibe cuadernos gratuitos, ejercicios y novedades de psicología y neuropsicología de Carolina Sánchez Girona.",alternates:{canonical:"/suscribete/"}};
export default function Page(){return <main style={{minHeight:"70vh",background:"#fff",padding:"clamp(40px,6vw,85px) 20px"}}>
<section style={{maxWidth:770,margin:"auto",textAlign:"center"}}>
<p style={{fontSize:13,letterSpacing:".13em",fontWeight:700,color:"#08A6A0"}}>PSICOLOGÍA · NEUROPSICOLOGÍA</p>
<h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(36px,5vw,58px)",color:"#173A5E",lineHeight:1.14,margin:"18px 0"}}>Recursos gratuitos en tu correo</h1>
<p style={{fontSize:20,lineHeight:1.7,color:"#35516C"}}>Recibe nuevos cuadernos de ejercicios, herramientas prácticas, artículos y novedades de los servicios de Carolina Sánchez Girona.</p>
<a href="https://c6645869.sibforms.com/serve/MUIFAIuvbjgYqrRqmmfpA-O89yKi9fH-Kb6Yp0UkGDyZKb_O1wjUF1SHUqEcp20MeACDjXZHQBzDuXijbIdqi8CB692onRlW0SA6IVn-N_ym1RIdQjptK-couFyXNVAQiyPtFM4hkdWfLmwNQgVfnarzCyzZDYkTDXyOH2O8g5m7BN-Gw--aM1hnRHHMfp39FyhRtcurRMbxfwtgMQ==" target="_blank" rel="noopener noreferrer" style={{display:"inline-block",background:"#08A6A0",color:"#fff",borderRadius:100,padding:"17px 30px",textDecoration:"none",fontWeight:700,marginTop:20}}>Suscribirme gratis ↗</a>
<p style={{fontSize:14,lineHeight:1.6,color:"#587087",marginTop:22}}>La suscripción es voluntaria. Puedes darte de baja cuando quieras. Los cuadernos marcados como gratuitos también pueden descargarse desde la biblioteca sin suscripción.</p>
<a href="/recursos/" style={{color:"#173A5E",display:"inline-block",marginTop:24}}>Explorar biblioteca de recursos →</a>
</section></main>}