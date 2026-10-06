# Galería para participantes

Proyecto creado desde cero en D:\proyecto android_cliente. Next.js, React, JavaScript y Firebase Web SDK. Puerto 3015.

## Iniciar

```sh
npm install
npm run dev
```

Abrir http://localhost:3015. La página permite crear una cuenta o iniciar sesión con correo y contraseña, entrar al inicio del participante, pulsar «Unirse a una sala» y escanear el QR de Android. Las cuentas se crean en Firebase Authentication, sin guardar contraseñas en Realtime Database.

También admite http://localhost:3015/?room=ABC123 y http://localhost:3015/?room=XYZ789. El enlace se conserva mientras se inicia sesión.

## Configuración Firebase

La configuración Web proporcionada por el propietario ya está guardada en .env.local: API key Web, authDomain galeria-3b934.firebaseapp.com y appId 1:935456737950:web:03c8c8601986a5d624898f. Pertenece al mismo proyecto galeria-3b934, número 935456737950, verificado previamente en Android. No se utiliza el appId ni la API key de Android.

No faltan valores para inicializar Firebase Web. No se incorpora Analytics ni measurementId porque esta aplicación no los necesita.

En Firebase Console → Authentication → Sign-in method debe estar habilitado Correo electrónico/contraseña para permitir el registro y el login. Esto no se cambia desde el código de la web. Las reglas existentes de Realtime Database también deben autorizar las operaciones del participante autenticado.

Si cambias las variables, reinicia npm run dev y vuelve a ejecutar npm run build para producción. En otra máquina copia .env.example a .env.local y completa las tres variables con la configuración de la aplicación Web.

La dirección de Realtime Database está fijada en https://galeria-3b934-default-rtdb.firebaseio.com. No se usa Storage, Admin SDK ni Service Account. La configuración incompleta bloquea las operaciones y muestra el motivo; no hay credenciales simuladas ni acceso de prueba.

## QR y salas

obtenerRoomId(), en lib/room.js, admite event://gallery_app/join?roomId=ABC123, códigos simples como ABC123 y enlaces HTTP(S) con ?room=ABC123. Rechaza rutas Firebase, caracteres prohibidos y parámetros duplicados. No abre el enlace escaneado: solo extrae el identificador y navega dentro de esta web.

La web consulta rooms/{roomId}, comprueba existencia y active === true, y usa roomName del modelo Android. Escucha cambios en active y vuelve a comprobar la sala antes de enviar. Una sala inexistente o finalizada no permite enviar.

## Fotografías y compatibilidad Android

Las imágenes se redimensionan sin aumentar tamaño, manteniendo proporción, a un máximo de 900 px en su lado mayor. Se convierten a JPEG con calidad 0.65 y fondo blanco para transparencias. Se aceptan originales de hasta 25 MB, siempre que el navegador pueda decodificarlos. El peso final varía según la imagen.

Se usa push() y set() en rooms/{roomId}/photos/{photoId}. imageBase64 contiene Base64 puro sin prefijo data:. timestamp usa serverTimestamp(), en milisegundos. También se escriben roomId, caption, photoId y userName.

Al revisar PhotoItem.java se verificaron id, username, userFullName y el setter setImageBase64. Por compatibilidad se escriben también id, username y userFullName, sin duplicar la imagen. PhotoRepository y LiveGalleryActivity escuchan exactamente rooms/{roomId}/photos. La recepción completa debe probarse con una sala real una vez configurada Firebase.

## Permisos Firebase

No se modificaron reglas ni configuración remota. Si aparece permission-denied, revisar las reglas actuales con el organizador. Iniciar sesión proporciona auth.uid, pero no garantiza que las reglas permitan leer o escribir.

La solución mínima debe autorizar a los participantes autenticados según el acceso previsto al evento; permitir únicamente crear fotos válidas en una sala existente y activa; validar campos, longitudes, identificadores y tamaño Base64; e impedir que participantes modifiquen la sala, fotos ajenas o permisos administrativos. Las reglas deben comprobar active en el servidor para cubrir un cierre entre la verificación web y la escritura. No sustituir las reglas existentes por permisos públicos ni conceder administración a cualquier cuenta registrada. Revisar reglas reales antes de proponer un cambio compatible con Android.

## Cámara y pruebas

La cámara QR necesita HTTPS en el teléfono. localhost funciona en el equipo que ejecuta el servidor, pero una IP local servida por HTTP normalmente no permite acceder a la cámara. Usa un despliegue HTTPS para probar el escáner desde el celular. No se publicó la web ni se creó un túnel.

```sh
node --test tests/room.test.mjs
npm run build
```

Prueba manual pendiente con Firebase: registro, login, QR Android, sala inexistente, sala cerrada, foto horizontal y vertical, envío a dos salas distintas y recepción en Android. No se crearon cuentas ni fotos de prueba en la base de datos real.

La dependencia indirecta @grpc/grpc-js se actualiza mediante overrides para corregir los avisos detectados en npm audit. La web importa solo Firebase App, Auth y Realtime Database.

Documentación: https://firebase.google.com/docs/web/setup y https://firebase.google.com/docs/auth/web/password-auth.
