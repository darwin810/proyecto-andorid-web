export async function compressImage(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selecciona un archivo de imagen.");
  }
  if (file.size > 25 * 1024 * 1024) {
    throw new Error("La foto original debe pesar como máximo 25 MB.");
  }
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, 900 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Tu navegador no permite procesar esta imagen.");
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const preview = canvas.toDataURL("image/jpeg", 0.65);
    return { preview, imageBase64: preview.split(",")[1] };
  } catch {
    throw new Error("No se pudo procesar la foto. Prueba con una imagen JPEG, PNG o WebP.");
  } finally {
    URL.revokeObjectURL(url);
  }
}
