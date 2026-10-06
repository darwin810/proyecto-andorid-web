import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

function getFirebaseApp() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    projectId: "galeria-3b934",
    databaseURL: "https://galeria-3b934-default-rtdb.firebaseio.com",
    messagingSenderId: "935456737950",
  };
  const missing = ["apiKey", "authDomain", "appId"].filter((key) => !config[key]);
  if (missing.length) {
    throw new Error(`Falta configurar Firebase: ${missing.join(", ")}. Contacta al organizador.`);
  }
  return getApps().length ? getApp() : initializeApp(config);
}

export function getFirebaseDatabase() { return getDatabase(getFirebaseApp()); }

export function getFirebaseAuth() { return getAuth(getFirebaseApp()); }

export function firebaseErrorMessage(error) {
  if (/permission.denied/i.test(`${error.code} ${error.message}`)) {
    return "Firebase no permite acceder a esta sala o enviar fotos. El organizador debe revisar los permisos del evento.";
  }
  if (/network|disconnected|unavailable/i.test(`${error.code} ${error.message}`)) {
    return "No se pudo conectar con Firebase. Revisa tu conexión e inténtalo otra vez.";
  }
  return error.message || "No se pudo completar la operación. Inténtalo otra vez.";
}
