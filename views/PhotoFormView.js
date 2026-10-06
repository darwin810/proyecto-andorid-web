"use client";

import { usePhotoController } from "../controllers/usePhotoController";

export default function PhotoFormView({ roomId, initialName = "" }) {
  return <RoomFormView key={`${roomId}`} roomId={roomId} initialName={initialName} />;
}

function RoomFormView({ roomId, initialName }) {
  const {
    validRoom,
    status,
    roomName,
    userName,
    setUserName,
    caption,
    setCaption,
    photo,
    error,
    processing,
    sending,
    success,
    fileInput,
    cameraInput,
    choosePhoto,
    submitPhoto,
    retryCheck,
  } = usePhotoController({ roomId, initialName });

  if (!validRoom) {
    return <p className="notice" role="alert">Abre el enlace de tu evento con un código de sala válido, por ejemplo: ?room=ABC123.</p>;
  }

  const disabled = status !== "ready" || sending;

  return (
    <>
      <div className="room">
        <span className="room-dot" aria-hidden="true" />
        <div>
          <span className="room-label">{status === "ready" ? "ESTÁS EN LA SALA" : "SALA DEL EVENTO"}</span>
          <strong>{roomId}</strong>
          {roomName && <span className="room-name">{roomName}</span>}
        </div>
      </div>
      {status === "loading" && <p className="notice" role="status">Comprobando sala...</p>}
      {status === "missing" && <p className="notice" role="alert">Sala no encontrada</p>}
      {status === "closed" && <p className="notice" role="alert">Este evento ya finalizó</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {status === "error" && <button className="secondary retry" onClick={retryCheck}>Volver a comprobar</button>}
      {success && (
        <div className="success" role="status">
          <strong>Foto enviada</strong>
          <p>Tu momento ya está en la galería.</p>
          <p>Puedes elegir otra foto. Conservamos tu nombre.</p>
        </div>
      )}
      <form onSubmit={submitPhoto}>
        <fieldset disabled={disabled}>
          <label htmlFor="user-name">Tu nombre</label>
          <input
            id="user-name"
            name="userName"
            autoComplete="given-name"
            placeholder="¿Cómo te llamas?"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            required
            maxLength={80}
          />
          <label htmlFor="photo">Fotografía</label>
          <div className="photo-picker">
            <svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 6h4l2-3h4l2 3h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <button type="button" className="secondary" disabled={processing} onClick={() => fileInput.current?.click()}>
              {photo ? "Elegir otra foto" : "Tomar o elegir foto"}
            </button>
            <button type="button" className="camera-link" disabled={processing} onClick={() => cameraInput.current?.click()}>
              Abrir cámara
            </button>
            <span className="hint">Elige un recuerdo de este evento.</span>
            <input ref={fileInput} id="photo" type="file" accept="image/*" onChange={choosePhoto} hidden />
            <input ref={cameraInput} aria-label="Tomar fotografía" type="file" accept="image/*" capture="environment" onChange={choosePhoto} hidden />
          </div>
          {processing && <p className="notice" role="status">Preparando foto...</p>}
          {photo && (
            <figure className="preview">
              <img src={photo.preview} alt="Vista previa de la foto que vas a enviar" />
              <figcaption>Tu foto está lista para enviar.</figcaption>
            </figure>
          )}
          <label htmlFor="caption">Mensaje <span className="optional">opcional</span></label>
          <textarea
            id="caption"
            placeholder="Cuenta algo sobre este momento..."
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            maxLength={500}
            rows={3}
          />
          <button className="primary" type="submit" disabled={disabled || processing || !photo || !userName.trim()}>
            {sending ? "Enviando..." : "Enviar foto"}
          </button>
          <p className="hint send-hint" role="status">
            {sending ? "Espera la confirmación antes de cerrar esta página." : "Tu foto se compartirá con la galería de esta sala."}
          </p>
        </fieldset>
      </form>
    </>
  );
}
