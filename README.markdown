Chat para Tienda con OpenAI Assistants - Portafolio Full-Stack
Descripción
Aplicación web full-stack que implementa un chat inteligente para negocios utilizando la API de Assistants de OpenAI. El sistema permite conversaciones persistentes por usuario, responde preguntas sobre productos reales (cargados desde un archivo JSON) y muestra un diseño moderno con loader animado, efectos neón y mensajes diferenciados por rol (usuario/bot). Construido con Node.js, Express, JavaScript vanilla y CSS puro, sin frameworks. Ideal para demostrar habilidades full-stack en un primer empleo.

Objetivo
Como estudiante universitario autodidacta, desarrollé este proyecto para:

Mostrar dominio de Node.js + Express en el backend.
Integrar APIs externas avanzadas (OpenAI Assistants con threads y polling).
Implementar conversaciones multi-turno con estado persistente.
Diseñar una interfaz interactiva y responsiva con animaciones CSS.
Aplicar buenas prácticas de seguridad (.env, .gitignore, variables de entorno).
Construir un portafolio profesional listo para despliegue en producción.
Características
Chat con memoria: Cada usuario tiene un thread único en OpenAI (persistencia por sesión).
Polling inteligente: Espera respuesta del asistente con reintentos automáticos (máx. 15).
Loader animado: Indicador visual durante la espera de la respuesta.
Mensajes diferenciados: Usuario (rojo) y bot (cian neón) con formato de burbuja.
Integración de datos reales: Archivo productos.json con 240+ productos (nombre, marca, costo, stock, caducidad).
Diseño moderno: Tema oscuro, tipografía clara, sombras neón, transiciones suaves.
Entrada por teclado: Enviar mensaje con Enter o botón.
Seguridad: API key protegida con dotenv y nunca expuesta en GitHub.
Despliegue listo: Configurado para Render, Vercel o Hostinger.
Tecnologías utilizadas
Node.js + Express: Servidor backend y rutas API.
OpenAI Assistants API: Gestión de threads, runs y mensajes.
JavaScript (vanilla): Manipulación del DOM, eventos, fetch asíncrono.
HTML5 + CSS3: Estructura semántica, Flexbox, animaciones con @keyframes.
JSON: Base de datos estática de productos (productos.json).
dotenv: Gestión segura de variables de entorno.
Git & GitHub: Control de versiones y colaboración.
Render / Vercel (opcional): Despliegue en producción.
Estructura del proyecto
chat-tienda-openai/ ├── app.js # Servidor Express + lógica OpenAI ├── package.json # Dependencias y scripts ├── productos.json # 240+ productos reales (stock, precio, etc.) ├── public/ │ ├── index.html # Estructura del chat │ ├── Assets/ │ │ ├── CSS/styles.css # Diseño neón, loader, burbujas │ │ └── JS/main.js # Lógica del frontend (DOM, fetch) ├── .env.example # Plantilla de variables (sin claves) ├── .gitignore # Protege .env, node_modules └── README.md # Esta documentación

Habilidades demostradas
Este proyecto refleja competencias clave para un Junior Full-Stack:

Backend: Rutas API, async/await, polling, manejo de errores.
Frontend: DOM dinámico, eventos, scroll automático, UX fluida.
APIs externas: Integración avanzada con OpenAI (threads, runs).
Arquitectura limpia: Separación de responsabilidades (backend/frontend).
Seguridad: Variables de entorno, .gitignore, no exposición de secretos.
Despliegue: Listo para hosting con Node.js (Render, Hostinger).
Autonomía: Construido en 7 horas sin seguir tutoriales.
Demo en vivo
Prueba el chat en tiempo real:
https://ia-chat-para-una-tienda.onrender.com/
(Espera 20-30 segundos al primer uso — plan gratuito)

Pregunta:
"¿Cuánto cuesta el refresco de cola?"
"¿Qué jugos tienen en stock?"
"¿Cuándo caduca la cerveza Corona?"
Notas para empleadores
Este es mi proyecto full-stack más avanzado hasta la fecha. Lo construí en 7 horas tras aprender los conceptos en 30 días, sin seguir videos paso a paso. Demuestra que:

Puedo integrar APIs complejas en producción. Domino backend y frontend sin frameworks. Priorizo seguridad, rendimiento y experiencia de usuario. Aprendo rápido y entrego resultados funcionales.

Estoy listo para contribuir en equipos reales como Junior Full-Stack Developer. Contacto Busco mi primer empleo en desarrollo web.

Contáctame en:
GitHub: github.com/JesusBustos12

LinkedIn: linkedin.com/in/jesus-bustos-arizmendi-325329283

Correo: jesusbustosarizmendi0@gmail.com

numero de celular: 762-119-2732

¡Gracias por revisar mi trabajo!
