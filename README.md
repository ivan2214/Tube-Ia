# Tube Ia

Una aplicación potenciada por IA que genera automáticamente líneas de tiempo y resúmenes de videos de YouTube, facilitando la navegación y comprensión del contenido.

## 🌟 Características

- **Análisis de Video con IA**: Genera líneas de tiempo y resúmenes de videos de YouTube
- **Autenticación de Usuarios**: Inicio de sesión seguro con email/contraseña, Google y GitHub
- **Rutas Protegidas**: Control de acceso basado en roles para diferentes secciones
- **Diseño Responsivo**: Funciona en dispositivos de escritorio y móviles
- **Modo Oscuro/Claro**: Elige tu tema preferido

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Shadcn UI
- **Backend**: Rutas API de Next.js, Server Actions
- **Autenticación**: Auth.js (NextAuth) v5
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Integración de IA**: Google AI SDK
- **Estilos**: Tailwind CSS con animaciones

## 📋 Requisitos Previos

- Node.js 18+
- Base de datos PostgreSQL
- Credenciales de API de Google (para funciones de IA)
- Credenciales OAuth (para inicio de sesión social)

## 🚀 Primeros Pasos

### Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tunombre/YouTube-Generator-Timeline-AI.git
cd YouTube-Generator-Timeline-AI
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:
   Crea un archivo `.env` en el directorio raíz con las siguientes variables:

```
# Base de datos
DATABASE_URL="postgresql://username:password@localhost:5432/youtube_timeline_ai"

# Autenticación
AUTH_SECRET="tu-secreto-de-autenticacion"
GITHUB_CLIENT_ID="tu-github-client-id"
GITHUB_CLIENT_SECRET="tu-github-client-secret"
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"

# Google AI API
GOOGLE_AI_API_KEY="tu-clave-de-api-de-google-ai"
```

4. Configura la base de datos:

```bash
npx prisma migrate dev
```

5. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

6. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 🧩 Estructura del Proyecto

- **/app**: Rutas principales de Next.js
  - **(public)**: Rutas accesibles sin autenticación
    - `/about`: Página de información del proyecto
  - **(protected)**: Rutas que requieren autenticación
    - `/profile`: Gestión de perfil de usuario
    - `/admin`: Panel de administración
- **/entities**: Lógica de negocio por dominio
  - `auth`: Autenticación y componentes relacionados
  - `user`: Gestión de perfiles y datos de usuario
  - `admin`: Funcionalidades exclusivas de administrador
- **/shared**: Componentes y utilidades reutilizables
  - `components`: UI components (botones, formularios, modales)
  - `hooks`: Hooks personalizados (useAuth, currentUser)
  - `lib`: Utilidades y configuraciones comunes
- **/actions**: Acciones del servidor
  - `auth.ts`: Registro y autenticación
  - `profile.ts`: Actualización de perfil
  - `admin.ts`: Gestión de usuarios
- **/data**: Acceso a base de datos
  - `user.ts`: Operaciones CRUD de usuarios
  - `accounts.ts`: Manejo de cuentas vinculadas
- **/prisma**: Configuración de base de datos
  - `schema.prisma`: Esquema de la base de datos
  - `migrations`: Historial de migraciones
- **/schemas**: Validaciones con Zod
  - `auth.ts`: Esquemas para login/registro
  - `user-profile.ts`: Validación de perfil de usuario
- **/middleware.ts**: Protección de rutas y lógica de autenticación

## 🔒 Autenticación

La aplicación utiliza Auth.js (NextAuth) v5 para autenticación con los siguientes proveedores:

- Email/Contraseña
- GitHub
- Google

Los roles de usuario incluyen:

- Usuarios regulares: Pueden generar líneas de tiempo de videos
- Usuarios administradores: Capacidades adicionales de gestión

## 🎯 Uso

1. Regístrate o inicia sesión en tu cuenta
2. Pega una URL de video de YouTube en el campo de entrada
3. La IA analizará el video y generará una línea de tiempo
4. Navega por el video utilizando los puntos de la línea de tiempo generada
5. Guarda o comparte tus líneas de tiempo generadas

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! No dudes en enviar un Pull Request.

1. Haz un fork del repositorio
2. Crea tu rama de características (`git checkout -b feature/caracteristica-asombrosa`)
3. Haz commit de tus cambios (`git commit -m 'Añadir alguna característica asombrosa'`)
4. Haz push a la rama (`git push origin feature/caracteristica-asombrosa`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.

## 📞 Contacto

Si tienes alguna pregunta o sugerencia, por favor abre un issue o contacta al propietario del repositorio.

---

Construido con ❤️ usando Next.js, React y tecnologías de IA.
