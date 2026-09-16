# Almacenamiento de documentos

La aplicación utiliza un almacenamiento S3-compatible privado en producción. Puede ser AWS S3, Cloudflare R2, Backblaze B2, MinIO o un proveedor equivalente.

Variables requeridas:

```env
STORAGE_MODE=s3
S3_BUCKET=nombre-del-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
# Opcional para R2, MinIO o proveedor compatible:
S3_ENDPOINT=https://...
S3_SSE=AES256
```

El bucket debe ser privado y no debe exponerse con `express.static` ni enlaces públicos. Los archivos se cargan en memoria, se guardan con una clave aleatoria por expediente y se descargan únicamente mediante una ruta autenticada.

En producción se debe configurar también una política de bucket que niegue acceso público y otorgue a la cuenta de la aplicación solo `PutObject`, `GetObject` y, si se implementa eliminación, `DeleteObject` sobre el prefijo de expedientes.

El modo `local` solo es apropiado para desarrollo. En modo producción el backend se detiene si no se configura `STORAGE_MODE=s3` y las credenciales correspondientes.
