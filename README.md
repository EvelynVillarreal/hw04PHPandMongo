# MongoDB Manager con PHP

Aplicación web para gestionar bases de datos MongoDB con interfaz PHP.

## 📋 Requisitos

- Docker y Docker Compose
- Conexión a MongoDB (local o Atlas)

## 🛠️ Desarrollo

### Ejecutar con Docker Compose (recomendado):

```bash
docker-compose up -d
```

Accede a:
- Frontend: http://localhost:8080
- API: http://localhost:8080/api.php

### Ver logs:

```bash
docker-compose logs -f app
```

### Detener servicios:

```bash
docker-compose down
```

## 🚀 Despliegue en Render

### Configuración:

1. Conecta tu repositorio GitHub a [Render](https://render.com)
2. Selecciona "Docker" como runtime
3. Configura las variables de entorno en Render:
   - `MONGODB_URI`: Tu conexión MongoDB Atlas completa
   - `DATABASE_NAME`: Nombre de la base de datos (ej: `students`)
   - `COLLECTION_NAME`: Nombre de la colección (ej: `Customer`)

### Ejemplo de MONGODB_URI:
```
mongodb+srv://usuario:contraseña@cluster.mongodb.net/?appName=TuApp
```

### Variables de Entorno en Render:
En el dashboard de Render, agrega:
- `MONGODB_URI` = tu conexión MongoDB
- `DATABASE_NAME` = `students`
- `COLLECTION_NAME` = `Customer`

## 📁 Estructura del Proyecto

```
├── api.php              # API REST para MongoDB
├── index.html          # Interfaz de usuario
├── public/
│   ├── css/
│   │   └── style.css   # Estilos
│   ├── images/
│   └── js/
│       └── script.js   # Lógica frontend
├── Dockerfile          # Configuración Docker
├── docker-compose.yml  # Servicios locales
├── composer.json       # Dependencias PHP
├── render.yaml         # Configuración Render
├── .env.example        # Plantilla de variables
└── README.md          # Este archivo
```

## 🔧 Configuración Local

Copia `.env.example` a `.env` y actualiza las credenciales:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales reales de MongoDB.

**IMPORTANTE:** `.env` nunca debe ser commiteado a Git (está en `.gitignore`)

## 📝 Nota Importante

Las variables de entorno se cargan automáticamente en Render desde la configuración que hagas en el dashboard. El archivo `render.yaml` ya tiene la estructura necesaria.
