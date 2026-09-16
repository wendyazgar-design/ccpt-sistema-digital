# CCPT Sistema Digital

Sistema institucional para registro y expediente digital de socios del Colegio de Contadores Públicos del Estado de Tabasco, A.C.

## Descripción general

Esta primera versión está enfocada en una implementación funcional, segura y desplegable en una semana, con:

- Autenticación con correo y contraseña
- Roles: administrador y socio
- Expedientes con información básica y académica
- Carga y almacenamiento de documentos por expediente
- API REST con permisos por rol
- Frontend web para acceso desde navegador
- Preparado para desplegar en Railway / Render / VPS

## Arquitectura propuesta

- Frontend: React + Vite
- Backend: Node.js + Express + PostgreSQL
- Almacenamiento de documentos: Cloudinary / S3 / almacenamiento configurable
- Autenticación: JWT + bcrypt
- Base de datos: PostgreSQL

## Roles

### Administrador
- Ve todos los expedientes
- Gestiona usuarios
- Revisa documentos
- Exporta listados y reportes

### Socio
- Inicia sesión con su correo
- Solo ve su expediente
- Sube su documentación
- Consulta su estado

## Estructura de repositorio

- `backend/`: API REST, autenticación, expedientes, documentos
- `frontend/`: aplicación web del usuario
- `docs/`: documentación de seguridad y procedimientos

## Requisitos mínimos

- Node.js 18+
- PostgreSQL 14+
- npm

## Variables de entorno

Copia el archivo del backend y ajusta los valores:

- `backend/.env.example`

## Inicio rápido

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Base de datos

El backend crea automáticamente las tablas necesarias al iniciar si la base está disponible.

## Despliegue recomendado

- Railway para backend + PostgreSQL
- Cloudinary o S3 para documentos
- Frontend publicado en Vercel o Railway

## Seguridad mínima adecuada

Se ha incluido una guía explícita en:

- `docs/security-minimum.md`

## Siguiente fase

- Roles y permisos refinados
- Exportación a Excel
- Auditoría detallada por expediente
- Recuperación de papelera
- Portal administrativo avanzado

