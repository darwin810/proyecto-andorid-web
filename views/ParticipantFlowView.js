"use client";

import { useParticipantController } from "../controllers/useParticipantController";
import PhotoFormView from "./PhotoFormView";
import QrScannerView from "./QrScannerView";

export default function ParticipantFlowView() {
  const {
    user,
    loading,
    busy,
    error,
    scanning,
    setScanning,
    registering,
    email,
    setEmail,
    password,
    setPassword,
    confirmation,
    setConfirmation,
    roomId,
    hasRoomParam,
    enterRoom,
    login,
    logout,
    goHome,
    toggleRegistering,
  } = useParticipantController();

  if (loading) {
    return <p className="notice" role="status">Comprobando sesión...</p>;
  }

  if (!user) {
    return (
      <div>
        <h2>{registering ? "Crea tu cuenta" : "Inicia sesión"}</h2>
        <p className="intro">Entra para unirte al evento y compartir tus fotos.</p>
        {error && <p role="alert" className="error">{error}</p>}
        <form onSubmit={login}>
          <fieldset disabled={busy}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              maxLength={254}
              placeholder="tu@correo.com"
            />
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              autoComplete={registering ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={registering ? 6 : 1}
            />
            {registering && (
              <>
                <label htmlFor="confirmation">Repite la contraseña</label>
                <input
                  id="confirmation"
                  type="password"
                  autoComplete="new-password"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  required
                  minLength={6}
                />
              </>
            )}
            <button className="primary" disabled={busy}>
              {busy ? "Espera un momento..." : registering ? "Crear cuenta" : "Iniciar sesión"}
            </button>
            <button type="button" className="camera-link auth-switch" onClick={toggleRegistering}>
              {registering ? "Ya tengo cuenta. Iniciar sesión" : "¿No tienes cuenta? Regístrate"}
            </button>
          </fieldset>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="session">
        <span>{user.displayName || user.email || "Participante"}</span>
        <button className="camera-link" disabled={busy} onClick={logout}>
          Cerrar sesión
        </button>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {scanning ? (
        <QrScannerView onRoom={enterRoom} onCancel={() => setScanning(false)} />
      ) : hasRoomParam ? (
        <>
          <button className="camera-link back" onClick={goHome}>
            Volver al inicio
          </button>
          <PhotoFormView key={roomId} roomId={roomId} initialName={user.displayName || ""} />
        </>
      ) : (
        <div className="participant-home">
          <h2>Inicio del participante</h2>
          <p className="intro">Únete a una sala escaneando el QR del administrador.</p>
          <button className="primary" onClick={() => setScanning(true)}>
            Unirse a una sala
          </button>
        </div>
      )}
    </>
  );
}
