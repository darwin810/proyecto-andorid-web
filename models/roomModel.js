export function isValidRoomId(value) {
  return typeof value === "string" && value.length > 0 && value === value.trim() && !/[.#$\[\]/\u0000-\u001f\u007f]/.test(value) && new TextEncoder().encode(value).length <= 768;
}

export function obtenerRoomId(text) {
  const value = text.trim();
  let roomId = value;
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
    const url = new URL(value);
    const androidLink = url.protocol === "event:" && url.hostname === "gallery_app" && url.pathname === "/join";
    if (!androidLink && !["http:", "https:"].includes(url.protocol)) throw new Error("Este QR no corresponde a una sala de Galería.");
    const rooms = url.searchParams.getAll(androidLink ? "roomId" : "room");
    roomId = rooms.length === 1 ? rooms[0] : "";
  }
  if (!isValidRoomId(roomId)) throw new Error("Este QR no contiene un código de sala válido.");
  return roomId;
}
