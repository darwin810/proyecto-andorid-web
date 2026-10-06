"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirebaseAuth, firebaseErrorMessage } from "../models/firebaseModel";

export function useParticipantController() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const params = useSearchParams();
  const router = useRouter();
  const rooms = params.getAll("room");
  const roomId = rooms.length === 1 ? rooms[0] : "";
  const hasRoomParam = params.has("room");

  useEffect(() => {
    try {
      return onAuthStateChanged(getFirebaseAuth(), (current) => {
        setUser(current);
        setLoading(false);
      }, (failure) => { setError(firebaseErrorMessage(failure)); setLoading(false); });
    } catch (failure) {
      setError(firebaseErrorMessage(failure));
      setLoading(false);
    }
  }, []);

  const enterRoom = useCallback((id) => {
    setScanning(false);
    router.push(`/?room=${encodeURIComponent(id)}`);
  }, [router]);

  async function login(event) {
    event.preventDefault();
    if (busy) return;
    setError("");
    if (registering && password !== confirmation) { setError("Las contraseñas no coinciden."); return; }
    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      if (registering) await createUserWithEmailAndPassword(auth, email.trim(), password);
      else await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword("");
      setConfirmation("");
    } catch (failure) {
      const messages = {
        "auth/invalid-credential": "El correo o la contraseña no son correctos.",
        "auth/user-not-found": "El correo o la contraseña no son correctos.",
        "auth/wrong-password": "El correo o la contraseña no son correctos.",
        "auth/email-already-in-use": "Este correo ya tiene una cuenta. Inicia sesión.",
        "auth/invalid-email": "Escribe un correo electrónico válido.",
        "auth/weak-password": "Usa una contraseña más segura, de al menos 6 caracteres.",
        "auth/password-does-not-meet-requirements": "La contraseña no cumple la política de seguridad del evento. Usa una más larga con mayúsculas, minúsculas, números y símbolos.",
        "auth/too-many-requests": "Se realizaron demasiados intentos. Espera un momento y vuelve a probar.",
        "auth/user-disabled": "Esta cuenta está deshabilitada. Contacta al organizador.",
        "auth/unauthorized-domain": "El organizador debe autorizar este dominio en Firebase Authentication.",
        "auth/operation-not-allowed": "El organizador debe habilitar Correo electrónico/contraseña en Firebase Authentication.",
        "auth/network-request-failed": "Revisa tu conexión a internet e inténtalo otra vez.",
      };
      setError(messages[failure.code] || firebaseErrorMessage(failure));
    } finally { setBusy(false); }
  }

  async function logout() {
    setBusy(true);
    setError("");
    try { await signOut(getFirebaseAuth()); setScanning(false); }
    catch (failure) { setError(firebaseErrorMessage(failure)); }
    finally { setBusy(false); }
  }

  function goHome() {
    router.push("/");
  }

  function toggleRegistering() {
    setRegistering(!registering);
    setError("");
    setPassword("");
    setConfirmation("");
  }

  return {
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
  };
}
