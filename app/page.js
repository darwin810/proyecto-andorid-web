import { Suspense } from "react";
import ParticipantFlowView from "../views/ParticipantFlowView";

export default function Home() {
  return (
    <main className="page">
      <div className="brand"><span className="brand-mark" aria-hidden="true">G</span> Galería</div>
      <section className="card" aria-labelledby="page-title">
        <div className="eyebrow">UN RECUERDO PARA COMPARTIR</div>
        <h1 id="page-title">Comparte tu momento</h1>
        <p className="intro">Tu mirada también forma parte del evento.</p>
        <Suspense fallback={<p role="status" className="notice">Leyendo el enlace del evento...</p>}>
          <ParticipantFlowView />
        </Suspense>
      </section>

      <div className="apk-banner">
        <div className="apk-banner-content">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="apk-icon">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <div>
            <strong>¿Tienes Android?</strong>
            <p>Descarga la app oficial</p>
          </div>
        </div>
        <a href="https://proyecto-galeria-qr.vercel.app/" target="_blank" rel="noopener noreferrer" className="camera-link apk-link">Descargar APK</a>
      </div>

      <p className="footer">Los mejores recuerdos se comparten.</p>
    </main>
  );
}
