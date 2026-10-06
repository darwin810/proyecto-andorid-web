"use client";

import { useEffect, useRef, useState } from "react";
import { get, onValue, push, ref, serverTimestamp, set } from "firebase/database";
import { firebaseErrorMessage, getFirebaseDatabase } from "../models/firebaseModel";
import { compressImage } from "../models/imageModel";
import { isValidRoomId } from "../models/roomModel";

export function usePhotoController({ roomId, initialName = "" }) {
  const validRoom = isValidRoomId(roomId);
  const [status, setStatus] = useState("loading");
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState(initialName);
  const [caption, setCaption] = useState("");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const fileInput = useRef(null);
  const cameraInput = useRef(null);
  const submitting = useRef(false);
  const selection = useRef(0);

  useEffect(() => {
    if (!validRoom) return;
    let cancelled = false;
    let unsubscribe;
    setStatus("loading");
    setError("");
    async function checkRoom() {
      try {
        const db = getFirebaseDatabase();
        const snapshot = await get(ref(db, `rooms/${roomId}`));
        if (cancelled) return;
        if (!snapshot.exists()) { setStatus("missing"); return; }
        const room = snapshot.val();
        setRoomName(typeof room.roomName === "string" ? room.roomName : "");
        setStatus(room.active === true ? "ready" : "closed");
        unsubscribe = onValue(ref(db, `rooms/${roomId}/active`), (active) => {
          if (!cancelled) setStatus(active.exists() ? active.val() === true ? "ready" : "closed" : "missing");
        }, (failure) => {
          if (!cancelled) { setStatus("error"); setError(firebaseErrorMessage(failure)); }
        });
      } catch (failure) {
        if (!cancelled) { setStatus("error"); setError(firebaseErrorMessage(failure)); }
      }
    }
    checkRoom();
    return () => { cancelled = true; unsubscribe?.(); selection.current += 1; };
  }, [roomId, validRoom, attempt]);

  async function choosePhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const current = ++selection.current;
    setProcessing(true);
    setError("");
    setSuccess(false);
    setPhoto(null);
    try {
      const result = await compressImage(file);
      if (current === selection.current) setPhoto(result);
    } catch (failure) {
      if (current === selection.current) setError(failure.message);
    } finally {
      if (current === selection.current) setProcessing(false);
    }
  }

  async function submitPhoto(event) {
    event.preventDefault();
    if (submitting.current || status !== "ready" || processing || !photo || !userName.trim()) return;
    submitting.current = true;
    setSending(true);
    setError("");
    setSuccess(false);
    try {
      if (!navigator.onLine) throw new Error("No tienes conexión. Conéctate a internet antes de enviar.");
      const db = getFirebaseDatabase();
      const snapshot = await get(ref(db, `rooms/${roomId}`));
      if (!snapshot.exists()) { setStatus("missing"); return; }
      if (snapshot.val().active !== true) { setStatus("closed"); return; }
      const photoRef = push(ref(db, `rooms/${roomId}/photos`));
      await set(photoRef, {
        photoId: photoRef.key,
        id: photoRef.key,
        roomId,
        userName: userName.trim(),
        username: userName.trim(),
        userFullName: userName.trim(),
        imageBase64: photo.imageBase64,
        caption: caption.trim(),
        timestamp: serverTimestamp(),
      });
      setPhoto(null);
      setCaption("");
      setSuccess(true);
    } catch (failure) {
      setError(firebaseErrorMessage(failure));
    } finally {
      submitting.current = false;
      setSending(false);
    }
  }

  function retryCheck() {
    setAttempt((prev) => prev + 1);
  }

  return {
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
  };
}
