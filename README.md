# Chat Inteligente para E-Commerce con OpenAI

## Descripción
Aplicación web full-stack diseñada para ofrecer un **asistente virtual inteligente para negocios** utilizando la **API de OpenAI**. El sistema cuenta con conversaciones persistentes, consultas en tiempo real a una base de datos relacional en la nube (TiDB) y una interfaz de usuario fluida con animaciones modernas. Desarrollado con **Node.js, Express, JavaScript vanilla y CSS puro**.

## Arquitectura y Características
* **Integración con IA:** Gestión avanzada de contexto mediante OpenAI (modelos `gpt-4o-mini` y `gpt-4o`) utilizando _Function Calling / Tool Calling_ para buscar disponibilidad de inventario y precios dinámicamente.
* **Base de Datos en la Nube:** Conexión a TiDB (MySQL) para búsquedas de catálogo eficientes y altamente escalables.
* **Rate Limiting Persistente:** Sistema de protección contra abusos basado en direcciones IP y persistido directamente en la base de datos. Incluye reseteo automático cada 24 horas de forma invisible para el usuario; la protección es resistente a reinicios de entorno serverless y borrado de caché del navegador.
* **UX/UI Optimizada:** 
  - Diseño responsivo con tema oscuro, efectos neón, animaciones `@keyframes` y barra de progreso de consumo de API.
  - Mensaje de bienvenida automático que guía al usuario.
  - Prevención proactiva contra vulnerabilidades de inyección XSS (Cross-Site Scripting) mediante sanitización de HTML.
* **SEO & Accesibilidad:** Meta-tags completos, soporte Open Graph para redes sociales, Twitter Cards, junto con atributos ARIA para accesibilidad.
* **Seguridad y Producción:** Configuración segura con `helmet` para cabeceras HTTP, gestión de secretos a través de `dotenv`, y arquitectura modular preparada para Serverless Functions en Vercel.

## Tecnologías Utilizadas
* **Backend:** Node.js, Express, MySQL2 (Promise), Helmet.
* **Inteligencia Artificial:** OpenAI API (Chat Completions & Tools).
* **Base de Datos:** TiDB (Motor compatible con MySQL).
* **Frontend:** HTML5 Semántico, CSS3, JavaScript (Vanilla).
* **Infraestructura:** Git, GitHub, Vercel (Serverless Functions).

## Estructura del Proyecto
```text
chat-tienda-openai/
├── api/
│   └── index.js          # Punto de entrada para Vercel Serverless Functions
├── app.js                # Servidor Express, endpoints y lógica central de IA
├── vercel.json           # Configuración de despliegue y ruteo para Vercel
├── package.json          # Dependencias y scripts
├── public/
│   ├── index.html        # Estructura semántica, SEO y Open Graph
│   └── Assets/
│       ├── CSS/styles.css # Sistema de diseño, variables CSS y animaciones
│       └── JS/main.js     # Lógica del cliente, control del DOM y fetch asíncrono
├── .env.example          # Plantilla de variables de entorno
└── README.md             # Documentación del proyecto
```

## Demo en vivo
> **Prueba el asistente virtual en tiempo real:**  
> https://ia-chat-para-una-tienda.vercel.app/

**Ejemplos de interacción:**  
- *"¿Cuánto cuesta el jabón Zote y cuántas unidades hay?"*  
- *"Busco galletas y botanas saladas para una fiesta."*  
- *"¿Cuáles son los horarios de atención y métodos de pago aceptados?"*

## Contacto

* **GitHub:** [github.com/JesusBustos12](https://github.com/JesusBustos12)
* **LinkedIn:** [linkedin.com/in/jesus-bustos-arizmendi-325329283](https://www.linkedin.com/in/jesus-bustos-arizmendi-325329283)
* **Correo:** [jesusbustosarizmendi0@gmail.com](mailto:jesusbustosarizmendi0@gmail.com)
