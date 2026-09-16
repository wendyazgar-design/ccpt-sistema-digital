# Seguridad mínima adecuada para la versión 1

Este documento define la seguridad esencial que debe tener la primera versión del sistema CCPT antes de ir a producción.

## 1. Autenticación

- Registro con correo y contraseña
- Contraseñas con hash usando bcrypt
- JWT con expiración razonable (por ejemplo, 8 horas)
- No guardar contraseñas en texto plano

## 2. Autorización por rol

- `admin`: acceso a todos los expedientes
- `socio`: acceso solo a su expediente
- Validar permisos en cada endpoint del backend
- Nunca confiar solo en el frontend

## 3. Protección de endpoints

- Middleware de autenticación obligatorio para rutas privadas
- Middleware de autorización para acciones específicas
- Revisión del `user_id` antes de mostrar o modificar un expediente

## 4. Manejo de documentos

- Los archivos deben guardarse en un almacenamiento seguro
- Ruta de archivos no debe ser pública
- El socio solo puede subir documentos a su propio expediente
- El administrador solo accede a los documentos relevantes a su operación

## 5. HTTPS

- La aplicación debe publicarse únicamente con HTTPS
- No usar HTTP en producción
- Cualquier token o contraseña debe viajar cifrado

## 6. Protección de variables de entorno

- No publicar secretos en GitHub
- Guardar JWT secret, credenciales y tokens en variables de entorno
- Usar `.env` solo en entorno local y un sistema seguro en producción

## 7. Validación de datos

- Validar campos obligatorios
- Validar formato de correo y teléfono cuando aplique
- Sanitizar entrada para evitar inyección y abuso

## 8. Logs básicos

- Registrar inicio de sesión
- Registrar creación, edición y borrado de expediente
- Registrar subida y acceso a documentos si aplica

## 9. Recomendaciones para la siguiente etapa

- Cifrado de documentos en reposo
- Auditoría avanzada por usuario y expediente
- Backup programado con restauración
- Control de sesiones y cierre forzado
- 2FA para administradores
- Monitorización y alertas
- Copias de seguridad automatizadas

## 10. 10 requisitos mínimos de aprobación

Antes de dejarla “operativa” se debe confirmar:

1. Los usuarios no pueden entrar sin autenticación.
2. Los socios no ven expedientes ajenos.
3. Las contraseñas no se guardan en texto plano.
4. Los endpoints sensibles requieren token válido.
5. La aplicación usa HTTPS.
6. Los documentos se guardan fuera del acceso público.
7. Los roles están activos y validados en backend.
8. Los datos del expediente no pueden manipularse por terceros.
9. Hay logs básicos de acceso y cambios.
10. Las variables secretas no están subidas al repositorio.

## Resumen

La seguridad mínima adecuada en esta fase no implica un sistema infalible, pero sí debe impedir acceso no autorizado, evitar fuga de credenciales, proteger expedientes y asegurar que los documentos no queden expuestos a cualquier persona.
