# Supabase Auth y Confirmación de Email

## Situación actual

- El proyecto local `wacrm` está corriendo en `http://127.0.0.1:3000`.
- El usuario target es: `joshuagarciia77@gmail.com`
- El ingreso con la contraseña propuesta (`Lumiere8`) devuelve:
  - `Invalid login credentials`
- Supabase indica que el email ya está registrado: `email_exists`.

## Qué revisar en Supabase

### 1. Verificar el usuario

1. En el panel de Supabase, ve a `Authentication > Users`.
2. Busca el usuario `joshuagarciia77@gmail.com`.
3. Comprueba el estado del usuario:
   - `Confirmed` / `Unconfirmed`
   - Si está `Unconfirmed`, confirma la cuenta manualmente.
4. Si hay un botón para `Confirm user`, `Verify email` o `Re-send confirmation email`, úsalo.

### 2. Revisar la configuración de email

1. En el panel de Supabase, ubica `Authentication > Emails` o `Authentication > Settings`.
2. Asegúrate de que:
   - `Enable email confirmations` esté activado.
   - El proveedor de correo (SMTP / SendGrid / otro) esté configurado y activo.
3. Revisa el remitente del email y que no haya configuraciones inválidas.

### 3. Revisar URL de redirección

1. Ve a `Authentication > URL Configuration`.
2. Asegúrate de tener agregados estos URLs:
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
   - la URL de producción si aplica

### 4. Probar registro de nuevo

1. Abre la app local en:
   - `http://127.0.0.1:3000/signup`
2. Registra con:
   - Email: `joshuagarciia77@gmail.com`
   - Contraseña: `Lumiere8`
3. Revisa si aparece el mensaje de confirmación por email.
4. Verifica también spam / promociones.

## Qué hacer si aún no llega el email

1. En `Authentication > Users`, localiza el usuario.
2. Si existe y no está confirmado, confírmalo manualmente.
3. Si no hay opción de confirmación manual, revisa el proveedor de email.
4. Si el email todavía no llega, puede ser un problema de SMTP o de la cuenta de correo.

## Qué hacer si quieres entrar ahora mismo

- En `Authentication > Users`, confirma manualmente el usuario.
- Luego intenta iniciar sesión en:
  - `http://127.0.0.1:3000/login`
- Si no puedes iniciar sesión, usa `Forgot password` para restablecer la contraseña.

## Nota importante

- No compartas contraseñas públicamente.
- El problema no es del código de la app en este punto: el usuario existe en Supabase, pero la cuenta no está lista para iniciar sesión.

---

## Accesos útiles en la app

- Login: `http://127.0.0.1:3000/login`
- Signup: `http://127.0.0.1:3000/signup`

## Revisión adicional en el proyecto

- El flujo actual de signup en `src/app/(auth)/signup/page.tsx` usa Supabase Auth.
- El código de backend puede usar el `SUPABASE_SERVICE_ROLE_KEY` para acciones administrativas, pero la confirmación de usuario es mejor hacerla desde el panel o desde el email de Supabase.
