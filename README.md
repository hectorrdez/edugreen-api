# Edugreen API

REST API para la plataforma Edugreen, construida con **Node.js**, **Express** y **TypeScript**. Gestiona usuarios, clases, retos, inscripciones e instituciones educativas.

---

## Requisitos

- Node.js >= 18
- MySQL >= 8
- npm

---

## Instalación

```bash
npm install
```

---

## Configuración — `.env`

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# API
API_KEY="your-api-key"           # Clave que deben enviar todos los clientes en el header Authorization
API_PORT=3001                    # Puerto en el que escucha la API
API_SECRET="your-jwt-secret"     # Secreto para firmar los session tokens JWT (expiran en 1h)
API_REFRESH_SECRET="your-secret" # Secreto para firmar los refresh tokens JWT (expiran en 7d)

# Logging (CSV)
REPORTING=true                   # Activa el guardado de logs en disco
REPORTING_FOLDER="data/"         # Carpeta base donde se guardan logs y errores

# Base de datos
DB_HOST="localhost"
DB_NAME="edugreen"
DB_USER="root"
DB_PASS="your-password"
```

> En producción cambia `API_SECRET` y `API_REFRESH_SECRET` por valores aleatorios y seguros.

---

## Comandos npm

| Comando | Descripción |
|---|---|
| `npm run dev` | Arranca el servidor en modo desarrollo con hot-reload (`ts-node-dev`) |
| `npm run lint` | Ejecuta el linter `ts-standard` sobre el código TypeScript |
| `npm run doc:generate` | Genera la documentación de la API en `api-docs.html` |
| `npm run commit` | Asistente interactivo de commits convencionales (`commitizen`) + push automático |

---

## Docker

El proyecto incluye un `docker-compose.yml` en `docker/` que levanta la API junto con una base de datos MySQL:

```bash
# Crear la red externa (solo la primera vez)
docker network create edugreen

# Levantar los servicios
docker compose -f docker/docker-compose.yml up --build
```

Los scripts de inicialización de la base de datos se cargan automáticamente desde `db/`.

---

## Autenticación

Todas las peticiones deben incluir la API key en el header:

```
Authorization: <API_KEY>
```

Los endpoints protegidos (todos salvo `/health`, `/auth` y `/auth/login`) requieren además un session token JWT:

```
x-session-token: <sessionToken>
```

El session token se obtiene al hacer login o registrarse y expira en **1 hora**. Puede renovarse con el refresh token (válido **7 días**) en `POST /api/auth/refresh`.

### Roles

Los roles disponibles son `student`, `teacher` y `admin`. El rol se asigna automáticamente al registrarse según el dominio del email y la institución configurada en la base de datos.

---

## Endpoints

Base URL: `/api`

### Health
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/health` | API key | Comprueba que la API está activa |

### Auth
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/auth` | API key | Registro de nuevo usuario |
| `POST` | `/auth/login` | API key | Login → devuelve `sessionToken` y `refreshToken` |
| `POST` | `/auth/refresh` | API key | Renueva el session token con el refresh token |
| `PATCH` | `/auth` | API key | Solicita token para cambiar contraseña (forgot password) |
| `PATCH` | `/auth/:token` | API key | Cambia la contraseña usando el token recibido |

### Users
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/user` | Session | Comprueba si un usuario existe |
| `GET` | `/user/:id` | Session | Obtiene un usuario por ID |
| `PATCH` | `/user/:id` | Session | Actualiza un usuario |
| `DELETE` | `/user/:id` | Session | Elimina un usuario |
| `GET` | `/user/:id/challenges` | Session | Obtiene los retos de un usuario |

### Classes
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/class` | teacher / admin | Crea una clase |
| `GET` | `/class/:id` | Session | Obtiene una clase por ID |
| `PATCH` | `/class/:id` | Session | Actualiza una clase |
| `DELETE` | `/class/:id` | Session | Elimina una clase |

### Enrollments
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/enrollment` | Session | Inscribe un usuario en un reto |
| `DELETE` | `/enrollment` | Session | Cancela una inscripción |
| `PATCH` | `/enrollment/complete` | teacher / admin | Marca una inscripción como completada |
| `GET` | `/enrollment/user/:user_id` | Session | Inscripciones de un usuario |
| `GET` | `/enrollment/challenge/:challenge_id` | Session | Inscripciones de un reto |

### Institutions
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/institution` | admin | Lista todas las instituciones |
| `POST` | `/institution` | admin | Crea una institución |
| `GET` | `/institution/:id` | Session | Obtiene una institución por ID |
| `PATCH` | `/institution/:id` | admin | Actualiza una institución |
| `DELETE` | `/institution/:id` | admin | Elimina una institución |

### User-Class
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/user-class` | teacher / admin | Añade un usuario a una clase |
| `DELETE` | `/user-class` | teacher / admin | Elimina un usuario de una clase |
| `GET` | `/user-class/user/:user_id` | Session | Clases de un usuario |
| `GET` | `/user-class/class/:class_id` | Session | Usuarios de una clase |

### Challenges
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/challenge` | teacher / admin | Crea un reto |
| `GET` | `/challenge/class/:class_id` | Session | Retos de una clase |
| `GET` | `/challenge/:id` | Session | Obtiene un reto por ID |
| `PATCH` | `/challenge/:id` | teacher / admin | Actualiza un reto |
| `DELETE` | `/challenge/:id` | teacher / admin | Elimina un reto |

### Stats
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/stats/user/:user_id` | Session | Estadísticas de un usuario |
| `GET` | `/stats/challenge/:challenge_id` | teacher / admin | Estadísticas de un reto |
| `GET` | `/stats/class/:class_id` | teacher / admin | Estadísticas de una clase |

---

## Logging

Al arrancar la API se crean automáticamente los directorios `data/logs/` y `data/errors/`. Cada sesión genera un archivo CSV con el nombre de la fecha y hora de inicio:

- `data/logs/<timestamp>.csv` — registro de todas las operaciones
- `data/errors/<timestamp>.csv` — solo errores (se crea si hay alguno)

Formato de cada línea: `timestamp|scope|type|content`

---

## Estructura del proyecto

```
src/
├── index.ts                    # Punto de entrada
├── app/
│   ├── controllers/            # Lógica de cada recurso
│   ├── middlewares/            # ApiKey, Session, Role
│   ├── models/                 # Acceso a base de datos
│   ├── entities/               # Tipos de dominio
│   └── views/                  # DataView / ErrorView
└── resources/
    ├── errors/                 # Errores tipados de la API
    ├── templates/              # Clases base (Controller, Model, Entity...)
    ├── interfaces/             # Interfaces compartidas
    └── utils/                  # Logger, Connection, Mailer, Date...
```
