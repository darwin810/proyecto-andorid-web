"use client";

import { useEffect, useRef, useState } from "react";
import { obtenerRoomId } from "../models/roomModel";

export function useQrScannerController({ onRoom }) {
  const video = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let controls;
    let found = false;
    async function start() {
      try {
        if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
          throw new Error("La cámara necesita HTTPS o localhost. Abre la web mediante una conexión segura.");
        }
        const { BrowserQRCodeReader } = await import("@zxing/browser");
        if (cancelled) return;
        const reader = new BrowserQRCodeReader();
        controls = await reader.decodeFromConstraints({ audio: false, video: { facingMode: { ideal: "environment" } } }, video.current, (result, failure, scanner) => {
          if (!result || cancelled || found) return;
          try {
            const roomId = obtenerRoomId(result.getText());
            found = true;
            scanner.stop();
            onRoom(roomId);
          } catch (invalid) {
            setError(invalid.message);
          }
        });
        if (cancelled) controls.stop();
        else setLoading(false);
      } catch (failure) {
        if (cancelled) return;
        setLoading(false);
        setError(failure.name === "NotAllowedError" ? "Permite el acceso a la cámara para escanear el QR." : failure.name === "NotFoundError" ? "No se encontró una cámara en este dispositivo." : failure.message || "No se pudo abrir la cámara.");
      }
    }
    start();
    return () => { cancelled = true; controls?.stop(); };
  }, [onRoom]);

  return {
    video,
    error,
    loading,
  };
}
