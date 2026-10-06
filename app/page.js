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
      <p className="footer">Los mejores recuerdos se comparten.</p>
    </main>
  );
}
