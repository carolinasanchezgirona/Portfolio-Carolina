import type { Metadata } from "next";
export const metadata: Metadata = { title: "Confirma tu correo | Recursos gratuitos", robots: { index: false, follow: false } };
export default function Page() {
  return <main style={{minHeight:"75vh",display:"grid",placeItems:"center",padding:"64px 20px",background:"#fff"}}>
    <section style={{maxWidth:650,textAlign:"center"}}>
      <p style={{color:"#08A6A0",letterSpacing:".12em",fontWeight:700}}>RECURSOS GRATUITOS</p>
      <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(36px,5vw,56px)",color:"#173A5E"}}>Revisa tu correo</h1>
      <p style={{fontSize:19,lineHeight:1.7,color:"#35516C"}}>Te hemos enviado un mensaje para confirmar tu suscripción. Haz clic en el enlace de ese correo para recibir nuestras novedades y recursos.</p>
      <p style={{color:"#587087"}}>Puedes descargar nuestros cuadernos gratuitos sin suscribirte.</p>
      <a href="/recursos/" style={{display:"inline-block",padding:"15px 24px",borderRadius:40,background:"#173A5E",color:"white",textDecoration:"none",marginTop:20}}>Explorar los recursos gratuitos</a>
    </section>
  </main>;
}