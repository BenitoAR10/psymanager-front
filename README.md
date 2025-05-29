# 🧠 Psymanager Frontend

Este repositorio contiene el **frontend completo del sistema Psymanager**, una plataforma web y móvil con gamificación para la gestión del servicio de atención psicológica universitaria.

## 📦 Estructura del Repositorio

```plaintext
psymanager-front/        # Aplicación web para terapeutas
psymanager-mobile/       # Aplicación móvil para estudiantes (Expo + React Native)
```

---

## 🌐 Aplicación Web (Terapeutas)

Aplicación construida con **React + TypeScript**, organizada por dominio bajo la carpeta `features/`. Utiliza bibliotecas modernas para una experiencia fluida y profesional.

### Tecnologías principales

- React 18 + Vite
- TypeScript
- Material UI (v5)
- TanStack Query
- React Router
- Axios + Hooks personalizados
- Moti + Framer Motion (animaciones)
- Estructura modular por `features`

### Funcionalidades destacadas

- Inicio de sesión con cuenta institucional (OAuth2)
- Gestión de citas, sesiones y tratamientos
- Acceso a historiales clínicos
- Seguimiento al progreso del paciente
- Notificaciones, visualización de estudiantes activos y finalizados

---

## 📱 Aplicación Móvil (Estudiantes)

Desarrollada con **React Native + Expo**, enfocada en ofrecer herramientas accesibles de gestión emocional y conexión con terapeutas.

### Tecnologías principales

- React Native + Expo SDK
- React Native Paper
- React Navigation
- Moti (animaciones suaves)
- TanStack Query
- `react-native-big-calendar` para visualización semanal de horarios
- Toast personalizado y diseño accesible

### Funcionalidades destacadas

- Registro e inicio de sesión con email y contraseña (JWT)
- Calendario semanal para agendar citas
- Acceso a kits de ayuda inmediata ("Calma Ahora")
- Recompensas y puntos de bienestar
- Gestión de citas, perfil y preferencias

---

## 🚀 Cómo ejecutar

### Web

```bash
cd psymanager-front
npm install
npm run dev
```

### Mobile

```bash
cd psymanager-mobile
npm install
npx expo start
```

> ⚠️ Asegúrate de tener configuradas las variables de entorno para ambos entornos (`.env`, `.env.development`, etc.), y de que el backend esté disponible en la URL especificada en cada entorno.

---

## 🔐 Conexión con Backend

Ambas aplicaciones consumen la API REST desarrollada en Spring Boot. El manejo de autenticación está basado en tokens JWT (mobile) y OAuth2 (web), y los datos se sincronizan automáticamente a través de hooks personalizados.

---

## 🎓 Proyecto de Grado

**Universidad Católica Boliviana “San Pablo”**  
Facultad de Ingeniería – Departamento de Ingeniería de Sistemas  
**Autor:** Amir Adolfo Rojas Bellido  
**Tutor:** M.Sc. Ángel Ávila Maceda  
**Relator:** M.Sc. Jorge Tancara Aguilar
