"use client";

import { useQrScannerController } from "../controllers/useQrScannerController";

export default function QrScannerView({ onRoom, onCancel }) {
  const { video, error, loading } = useQrScannerController({ onRoom });

  return (
    <div className="scanner">
      <h2>Escanea el QR del evento</h2>
      <p className="intro">Apunta al código que muestra el administrador en Android.</p>
      <video ref={video} muted playsInline autoPlay aria-label="Vista de la cámara para escanear QR" />
      {loading && <p role="status">Abriendo cámara...</p>}
      {error && <p className="error" role="alert">{error}</p>}
      <button type="button" className="secondary" onClick={onCancel}>Volver al inicio</button>
    </div>
  );
}
