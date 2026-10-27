import type { Metadata } from "next";
export const metadata: Metadata = {title:"Mi cuerpo, mis criterios | Cuaderno gratuito para adolescentes",description:"Ejercicios gratuitos para adolescentes sobre imagen corporal, autoestima y límites ante comentarios sobre el cuerpo.",alternates:{canonical:"/recursos/mi-cuerpo-mis-criterios/"}};
export default function Page(){
return <main style={{background:"#fff",padding:"64px 20px",minHeight:"80vh"}}>
<section style={{maxWidth:900,margin:"0 auto"}}>
<p style={{fontSize:13,letterSpacing:".14em",color:"#08A6A0",fontWeight:700}}>RECURSO GRATUITO · ADOLESCENCIA</p>
<h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(36px,6vw,64px)",lineHeight:1.12,color:"#173A5E",margin:"20px 0"}}>Mi cuerpo, <span style={{color:"#F2766B"}}>mis criterios</span></h1>
<p style={{fontSize:21,lineHeight:1.65,color:"#35516C",maxWidth:740}}>Cuaderno de reflexión para adolescentes sobre imagen corporal, autoconcepto, alimentación y comentarios que duelen.</p>
<div style={{background:"#EAF6FB",padding:"28px",borderRadius:20,margin:"30px 0"}}>
<h2 style={{fontSize:24,color:"#173A5E"}}>Dentro del cuaderno</h2>
<p style={{lineHeight:1.8,color:"#35516C"}}>Nueve actividades: semáforo de comentarios, pensamiento crítico, identidad personal, señales corporales, respuestas asertivas, redes sociales y plan de actuación.</p>
<p style={{fontWeight:700,color:"#173A5E"}}>Descarga gratuita, sin registro obligatorio.</p><a href="/api/resources/free-download?slug=mi-cuerpo-mis-criterios" style={{display:"inline-block",padding:"15px 24px",background:"#08A6A0",color:"white",borderRadius:50,textDecoration:"none",fontWeight:700,marginTop:14}}>Descargar cuaderno PDF gratis ↓</a>
</div>
<p style={{lineHeight:1.7,color:"#587087"}}>Material psicoeducativo. No sustituye la valoración o intervención individual cuando sea necesaria.</p>
<section style={{borderTop:"1px solid #d7e8ed",marginTop:42,paddingTop:30}}>
<h2 style={{fontFamily:"Georgia,serif",fontSize:30,color:"#173A5E"}}>¿Quieres recibir próximos recursos?</h2>
<p style={{lineHeight:1.7,color:"#35516C"}}>Suscríbete voluntariamente a nuestras novedades. No necesitas suscribirte para acceder a los cuadernos gratuitos.</p>
<a href="/suscribete/" style={{display:"inline-block",padding:"15px 24px",background:"#173A5E",color:"white",borderRadius:50,textDecoration:"none",fontWeight:700}}>Suscribirme a las novedades ↗</a>
</section>
</section></main>;
}