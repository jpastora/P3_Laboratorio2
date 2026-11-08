# Laboratorio 2 – CRUD front-end (Proyecto 3)

Interfaz en Angular 22 para el CRUD de Productos y Categorías del Laboratorio 1.

## Requisitos
- Backend: https://github.com/jpastora/P3_Laboratorio1 (Spring Boot + Keycloak + PostgreSQL en Docker)
- Node LTS y Angular CLI

## Ejecución
1. Backend: `cd docker && docker compose up -d` y luego iniciar Spring Boot (puerto 8080).
2. Frontend: `npm install` y `npm run start` → http://localhost:4200

## Usuarios de prueba
| Usuario | Contraseña | Rol |
|---|---|---|
| admin | admin123 | SUPER-ADMIN-ROLE |
| user | user123 | USER |

También se pueden registrar usuarios nuevos desde `/register` (rol USER).