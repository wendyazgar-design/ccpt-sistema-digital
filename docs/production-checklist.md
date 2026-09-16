# Lista de verificación para producción

Sistema de Registro y Expediente Digital CCPT

> Esta lista separa lo imprescindible para una primera puesta en marcha de lo que puede completarse después. Debido a que el sistema manejará CURP, RFC y documentos personales, **no debe utilizarse con datos reales hasta completar todos los puntos de Prioridad 1**.

## Prioridad 1 — Imprescindible antes del lanzamiento

### 1. Repositorio y secretos

- [ ] Transferir el repositorio a la organización del Colegio.
- [ ] Cambiar el repositorio a privado.
- [ ] Confirmar que no existen contraseñas, tokens ni claves reales en el historial de Git.
- [ ] Mantener `.env` fuera del repositorio.
- [ ] Generar un `JWT_SECRET` largo, aleatorio y exclusivo para producción.
- [ ] Configurar los secretos directamente en el proveedor de despliegue.
- [ ] Cambiar la contraseña del administrador inicial.
- [ ] Eliminar o desactivar las credenciales de demostración antes del lanzamiento.

### 2. Base de datos PostgreSQL

- [ ] Crear una base PostgreSQL administrada para producción.
- [ ] Configurar `DATABASE_URL` o sus variables equivalentes.
- [ ] Ejecutar las migraciones o creación de tablas en producción.
- [ ] Verificar índices y restricciones de unicidad para correo, folio, RFC y CURP cuando corresponda.
- [ ] Crear un usuario administrador institucional con correo real.
- [ ] Crear cuentas de socio mediante un proceso controlado.
- [ ] No permitir que el registro público elija libremente el rol `admin`.
- [ ] Probar una copia de seguridad y su restauración antes del lanzamiento.

### 3. Almacenamiento privado de documentos

- [ ] Configurar almacenamiento persistente externo, como S3, Cloudinary, Supabase Storage o equivalente.
- [ ] No depender de la carpeta local del servidor de aplicaciones.
- [ ] Mantener el contenedor o bucket privado, sin enlaces públicos permanentes.
- [ ] Descargar archivos únicamente mediante una ruta autenticada y autorizada.
- [ ] Asociar cada archivo con el expediente correcto.
- [ ] Validar extensión, MIME real y tamaño máximo.
- [ ] Definir una lista permitida, por ejemplo PDF, JPG, JPEG y PNG.
- [ ] Rechazar archivos ejecutables, archivos comprimidos no autorizados y extensiones dobles.
- [ ] Generar nombres internos seguros; no usar directamente el nombre proporcionado por el usuario.
- [ ] Configurar copia de seguridad de los documentos.

### 4. Autenticación y permisos

- [ ] Confirmar que las contraseñas se almacenan únicamente con hash bcrypt o equivalente.
- [ ] Expirar los tokens o sesiones.
- [ ] Proteger todas las rutas privadas del backend.
- [ ] Comprobar permisos en el backend, no solo en React.
- [ ] Verificar que un socio solo pueda consultar, modificar y cargar documentos de su expediente.
- [ ] Verificar que un socio no pueda cambiar su propio rol a `admin`.
- [ ] Verificar que un socio no pueda cambiar el `user_id` del expediente.
- [ ] Permitir al administrador consultar todos los expedientes autorizados.
- [ ] Implementar cierre de sesión y revocación o invalidación de sesiones cuando sea necesario.
- [ ] Implementar cambio y recuperación de contraseña antes de entregar cuentas reales.
- [ ] Activar 2FA para administradores si el proveedor y el calendario lo permiten; si no, programarlo como prioridad 2.

### 5. Red y despliegue

- [ ] Desplegar el backend en un servicio con HTTPS.
- [ ] Publicar el frontend con HTTPS.
- [ ] Configurar un dominio institucional o una URL estable.
- [ ] Configurar CORS exclusivamente para el dominio real del frontend.
- [ ] No dejar `localhost` en las variables de producción.
- [ ] Configurar límites de tamaño para solicitudes y archivos.
- [ ] Añadir encabezados de seguridad, como Helmet o configuración equivalente.
- [ ] Añadir limitación de solicitudes, especialmente para login y carga de archivos.
- [ ] Revisar que los mensajes de error no expongan contraseñas, consultas SQL ni rutas internas.

### 6. Auditoría y respaldo

- [ ] Registrar inicio de sesión exitoso y fallido.
- [ ] Registrar creación, edición y eliminación de expedientes.
- [ ] Registrar carga, descarga y eliminación de documentos.
- [ ] Guardar usuario, fecha, acción y expediente afectado.
- [ ] Configurar backup automático de PostgreSQL.
- [ ] Configurar backup automático del almacenamiento de archivos.
- [ ] Definir retención de respaldos.
- [ ] Probar restauración completa con una copia de prueba.
- [ ] Restringir el acceso a logs y respaldos.

### 7. Pruebas de aceptación

- [ ] Un usuario no autenticado no puede abrir expedientes.
- [ ] Un socio puede iniciar sesión con sus credenciales.
- [ ] Un socio solo ve su expediente.
- [ ] Un socio no puede consultar el expediente de otro cambiando el ID en la URL.
- [ ] Un socio no puede descargar documentos de otro expediente.
- [ ] Un socio no puede crear o asignarse el rol administrador.
- [ ] Un administrador puede consultar todos los expedientes.
- [ ] La carga de un PDF permitido funciona.
- [ ] Un archivo demasiado grande es rechazado.
- [ ] Un archivo no permitido es rechazado.
- [ ] La edición actualiza el expediente correcto.
- [ ] El borrado requiere permisos de administrador.
- [ ] Las sesiones expiradas son rechazadas.
- [ ] El sistema funciona desde computadora y teléfono.
- [ ] Se verifica la restauración de base de datos y documentos.

### 8. Privacidad y operación institucional

- [ ] Aprobar el aviso de privacidad aplicable.
- [ ] Informar al socio qué datos se recopilan y para qué se utilizan.
- [ ] Obtener el consentimiento o aceptación requerida antes de cargar documentación.
- [ ] Designar responsables del sistema y de los datos.
- [ ] Definir quién puede ser administrador.
- [ ] Definir el procedimiento para altas, bajas y recuperación de cuentas.
- [ ] Definir el tiempo de conservación de expedientes y documentos.
- [ ] Capacitar al personal que revisará los expedientes.
- [ ] Documentar el procedimiento para reportar un incidente de seguridad.

## Prioridad 2 — Completar inmediatamente después del lanzamiento

- [ ] Activar 2FA para todas las cuentas administrativas.
- [ ] Implementar bloqueo temporal después de varios intentos fallidos.
- [ ] Implementar recuperación de contraseña mediante correo institucional.
- [ ] Añadir validación antivirus o escaneo de archivos.
- [ ] Añadir historial de versiones de documentos.
- [ ] Implementar papelera y recuperación controlada.
- [ ] Añadir filtros por folio, nombre, RFC, CURP, trámite y estatus.
- [ ] Incorporar exportación Excel y CSV con controles de autorización.
- [ ] Añadir panel de indicadores para administración.
- [ ] Configurar alertas de errores, disponibilidad y almacenamiento.
- [ ] Realizar una revisión de seguridad independiente.
- [ ] Establecer un ambiente de pruebas separado de producción.

## Prioridad 3 — Mejoras futuras

- [ ] Firma o aceptación electrónica del aviso de privacidad.
- [ ] Cifrado adicional de documentos en reposo con gestión de claves.
- [ ] Historial completo de versiones y aprobaciones.
- [ ] Integración con correo institucional.
- [ ] API documentada y controlada para integraciones externas.
- [ ] Alta disponibilidad y escalamiento automático.
- [ ] Pruebas automatizadas de seguridad y regresión.
- [ ] Política formal de continuidad operativa y recuperación ante desastres.

## Criterio de aprobación

La aplicación puede pasar a una **prueba piloto controlada** cuando todos los puntos de Prioridad 1 estén marcados, exista una copia de seguridad restaurable y se hayan probado dos cuentas: una de administrador y una de socio.

La aplicación puede declararse **operativa para socios** únicamente después de completar también la revisión de privacidad, el almacenamiento privado de documentos, la validación de permisos y las pruebas de acceso cruzado.

## Evidencias que deben conservarse

- URL de producción y dominio utilizado.
- Fecha y responsable de la puesta en marcha.
- Resultado de pruebas de administrador y socio.
- Confirmación de backup y restauración.
- Configuración de almacenamiento privado.
- Lista de administradores autorizados.
- Versión o commit desplegado.
- Aprobación institucional del aviso de privacidad.
