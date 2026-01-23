# Optimizador de Rutas - Nextmv

Aplicación web para optimización de rutas de recogida utilizando Nextmv API, integrada con Supabase para almacenamiento de datos.

## 🌐 Acceso a la Aplicación

**URL de Producción**: [https://optimizadorv2-4c1mqpjlf-ontrack1.vercel.app/new](https://optimizadorv2-4c1mqpjlf-ontrack1.vercel.app/new)

## 🚀 Características

- **Gestión de Puntos de Recogida**: Agregar, editar y eliminar puntos de recogida
- **Búsqueda de Estudiantes**: Buscar estudiantes por nombre, dirección o ID
- **Gestión de Múltiples Personas**: Editar individualmente a las personas que comparten un punto
- **Configuración de Vehículos**: Definir vehículos con capacidad y restricciones
- **Optimización de Rutas**: Generar rutas optimizadas usando Nextmv API
- **Visualización en Mapa**: Ver rutas y puntos de recogida en un mapa interactivo
- **Historial de Optimizaciones**: Revisar ejecuciones anteriores

## 🛠️ Tecnologías

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn-ui
- **Styling**: Tailwind CSS
- **Base de Datos**: Supabase (PostgreSQL)
- **API de Optimización**: Nextmv
- **Mapas**: Mapbox GL

## 📦 Instalación Local

### Requisitos

- Node.js (recomendado usar [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm o yarn

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Juanes1203/what-is-nextmvV2.git

# 2. Navegar al directorio del proyecto
cd what-is-nextmvV2

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
# Crear archivo .env con las siguientes variables:
# VITE_SUPABASE_URL=tu_url_de_supabase
# VITE_SUPABASE_PUBLISHABLE_KEY=tu_clave_publica
# VITE_NEXTMV_API_KEY=tu_clave_de_nextmv

# 5. Iniciar servidor de desarrollo
npm run dev
```

## 🚀 Despliegue

### Vercel (Recomendado)

Ver la guía completa en [DEPLOY.md](./DEPLOY.md)

**Resumen rápido:**
1. Conecta tu repositorio de GitHub a Vercel
2. Agrega las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_NEXTMV_API_KEY`
3. Vercel detectará automáticamente que es un proyecto Vite y lo desplegará

## 📚 Documentación Adicional

- [Guía de Despliegue](./DEPLOY.md) - Instrucciones detalladas para desplegar en Vercel
- [Configuración de Supabase](./SETUP_SUPABASE.md) - Configuración de la base de datos

## 📝 Licencia

Este proyecto es privado.
