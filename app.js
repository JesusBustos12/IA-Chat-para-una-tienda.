// Dependencies:
import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mysql from "mysql2/promise";

// Environment variable integrity:
dotenv.config();

const isDev = process.env.NODE_ENV !== "production";
const log = (...args) => { if(isDev) console.log("[DEV]", ...args); };

// Create and configure the server:
const app = express();
app.set("trust proxy", 1); // Confiar en el proxy de Vercel para obtener la IP del cliente
const port = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,  // 1 minute
    max: 10,                    // limit each IP to 10 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        exception: "Demasiadas solicitudes. Intenta de nuevo en un minuto."
    }
});

// Middleware configurations:
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/assistant/chat", apiLimiter);

import path from "path";

// Vercel Serverless usa process.cwd() como la raíz del proyecto
const publicPath = path.join(process.cwd(), "public");

// Serve the Front-end:
app.use("/", express.static(publicPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

// Pass the OpenAI API key:
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Create DB connection pool
let dbPool;
try {
    if (process.env.DATABASE_URL) {
        // Remover ?ssl=true del string ya que mysql2 espera un objeto
        const dbUrl = process.env.DATABASE_URL.replace("?ssl=true", "");
        dbPool = mysql.createPool({
            uri: dbUrl,
            ssl: {
                rejectUnauthorized: true
            },
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log("✅ Conexión a TiDB configurada.");
    } else {
        console.warn("⚠️ DATABASE_URL no definida. La búsqueda de productos fallará.");
    }
} catch (error) {
    console.error("❌ Error al conectar con TiDB:", error.message);
}

// Almacenamiento en memoria de sesiones por usuario.
// NOTA: En producción, considera persistencia con Redis o SQLite.
const userSessions = new Map();

// System prompt para la IA
const systemPrompt = `Eres el asistente virtual amable de una TIENDA DE ABARROTES MEXICANA.
TU MISIÓN es atender a los clientes, buscar productos usando tu herramienta, y dar información del negocio.

INFORMACIÓN DE LA TIENDA (Solo menciónala si te preguntan):
- Ubicación: Localidad de Ahualulco, municipio de Tetipac, Guerrero, México.
- Horarios: Lunes a Viernes de 7:00 AM a 8:30 PM. Sábados de 10:00 AM a 10:00 PM. Domingos NO hay servicio.
- Métodos de pago: Efectivo (MXN) o transferencia digital vía Mercado Pago.
- Inventario: Abarrotes, botanas, refrescos, lácteos, despensa básica y limpieza. (Nunca ofrezcas juguetes, electrónica, ropa o muebles).
- Detalles del dueño: Tienes estrictamente prohibido dar información del dueño o asuntos administrativos.

REGLAS DE CONVERSACIÓN Y BÚSQUEDA:
1. SIEMPRE que un usuario pregunte por la existencia de productos (incluso si es una lista larga), DEBES llamar a la herramienta 'buscar_productos' para verificar la base de datos.
2. Extrae máximo 5 palabras clave en SINGULAR (ej. "huevos, galletas y botanas" -> ["huevo", "galleta", "sabritas", "doritos"]).
3. Si el usuario te pregunta cosas que no tienen NADA que ver con la tienda (como matemáticas, chistes o preguntas personales), responde educadamente que eres un asistente de la tienda y no puedes responder a eso.
4. Sé natural y conversacional. No repitas la misma frase robótica una y otra vez.`;

// Definición de las herramientas (Tools)
const tools = [
    {
        type: "function",
        function: {
            name: "buscar_productos",
            description: "Realiza una consulta a la base de datos para buscar artículos usando múltiples palabras clave (probabilidad por sinónimos).",
            parameters: {
                type: "object",
                properties: {
                    keywords: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        description: "Arreglo de palabras clave individuales en singular y sin acentos (ej. ['jabon', 'baño', 'zote', 'tocador'])."
                    }
                },
                required: ["keywords"]
            }
        }
    }
];

// Health check para servicios de hosting:
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString()
    });
});

// Post request:
app.post("/assistant/chat", async(req, res) => {

    // Unpack body properties:
    const {id, message} = req.body;

    // Validación de tipo y existencia:
    if(!message || typeof message !== "string"){
        return res.status(400).json({
            exception: "Error. El mensaje es requerido y debe ser texto."
        });
    }

    // Validación de longitud:
    const trimmedMessage = message.trim();
    if(trimmedMessage.length === 0 || trimmedMessage.length > 500){
        return res.status(400).json({
            exception: "Error. El mensaje debe tener entre 1 y 500 caracteres."
        });
    }

    // Validación del ID:
    if(!id){
        return res.status(400).json({
            exception: "Error. Se requiere un ID válido."
        });
    }

    // Try and catch:
    try{
        if (!dbPool) {
            throw new Error("Error Crítico: No hay conexión a la base de datos.");
        }

        // Load or initialize user session
        let sessionMessages = userSessions.get(id);
        if (!sessionMessages) {
            sessionMessages = [
                { role: "system", content: systemPrompt }
            ];
        }

        // Append user message
        sessionMessages.push({ role: "user", content: trimmedMessage });

        // Maintain context window size (e.g. keep last 20 messages + system prompt)
        if (sessionMessages.length > 21) {
            sessionMessages = [sessionMessages[0], ...sessionMessages.slice(sessionMessages.length - 20)];
        }

        log(`Llamando a OpenAI Chat Completions...`);
        let response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: sessionMessages,
            temperature: 0.7,
            top_p: 1,
            tools: tools,
            tool_choice: "auto"
        });

        let responseMessage = response.choices[0].message;

        // Si OpenAI decide llamar a una herramienta (buscar_productos)
        if (responseMessage.tool_calls) {
            log(`El asistente decidió llamar a una herramienta.`);
            sessionMessages.push(responseMessage); // Add tool call to history

            for (const toolCall of responseMessage.tool_calls) {
                if (toolCall.function.name === "buscar_productos") {
                    const args = JSON.parse(toolCall.function.arguments);
                    const keywords = args.keywords || [];
                    log(`Ejecutando query en TiDB para keywords: ${keywords.join(", ")}`);

                    try {
                        let rows = [];
                        
                        // Limpieza extrema de keywords para evitar frases largas o plurales
                        let finalKeywords = [];
                        keywords.forEach(kw => {
                            // Si la IA manda frases (ej. "pasta de dientes"), la dividimos por espacios
                            let words = kw.split(" ").map(w => w.trim().toLowerCase());
                            words.forEach(w => {
                                if (w.length > 3 && w.endsWith("s")) {
                                    // Remover 's' simple (ej. huevos -> huevo)
                                    finalKeywords.push(w.slice(0, -1));
                                } else if (w.length > 4 && w.endsWith("es")) {
                                    // Remover 'es' (ej. jabones -> jabon)
                                    finalKeywords.push(w.slice(0, -2));
                                }
                                if (w.length > 2) { // Evitar palabras como "de", "la", "el"
                                    finalKeywords.push(w);
                                }
                            });
                        });
                        
                        if (finalKeywords.length > 0) {
                            // Construir múltiples LIKE para búsquedas probabilísticas (El Case Insensitive ahora lo maneja la base de datos)
                            const safeKeywords = finalKeywords.slice(0, 5); // Max 5 keywords para evitar Timeouts
                            const likeClauses = safeKeywords.map(() => "nombre LIKE ? OR marca LIKE ?").join(" OR ");
                            const queryParams = [];
                            safeKeywords.forEach(kw => {
                                queryParams.push(`%${kw}%`, `%${kw}%`);
                            });

                            const sqlQuery = `SELECT nombre, marca, costo, unidades_de_stock FROM productos WHERE ${likeClauses} LIMIT 20`;
                            const [result] = await dbPool.execute(sqlQuery, queryParams);
                            rows = result;
                        }
                        
                        const toolResultContent = rows.length > 0 ? JSON.stringify(rows) : "No se encontraron productos con esos términos.";
                        
                        sessionMessages.push({
                            tool_call_id: toolCall.id,
                            role: "tool",
                            name: "buscar_productos",
                            content: toolResultContent
                        });
                    } catch (dbError) {
                        console.error("Error en DB:", dbError);
                        sessionMessages.push({
                            tool_call_id: toolCall.id,
                            role: "tool",
                            name: "buscar_productos",
                            content: "Hubo un error al consultar la base de datos."
                        });
                    }
                }
            }

            // Llamar a OpenAI nuevamente con el resultado de la herramienta
            log(`Llamando a OpenAI nuevamente con los resultados de TiDB...`);
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: sessionMessages,
                tools: tools,
                temperature: 0.7,
                top_p: 1
            });
            
            responseMessage = response.choices[0].message;
        }

        // Add final response to session
        sessionMessages.push({ role: "assistant", content: responseMessage.content });
        userSessions.set(id, sessionMessages);

        const messagesReply = responseMessage.content;
        log("Message: " + messagesReply);

        // Status 200:
        return res.status(200).json({
            messagesReply
        });

    } catch(exception) {
        console.error("================ ERROR EN EL BACKEND ================");
        console.error(exception);
        if (exception.response) {
            console.error("Datos de la respuesta de OpenAI:", exception.response.data);
        }
        console.error("=====================================================");

        const statusCode = exception.status || 500;
        const userMessage = statusCode === 429
            ? "El servicio está saturado. Intenta en unos minutos."
            : "Error interno del servidor. Intenta de nuevo más tarde. Detalles: " + exception.message;

        return res.status(statusCode).json({
            exception: userMessage,
            ...(isDev && { debug: exception.message })
        });
    }
});

// Manejador de rutas no encontradas:
app.use((req, res) => {
    res.status(404).json({
        exception: "Ruta no encontrada."
    });
});

// Manejador global de errores:
app.use((err, req, res, next) => {
    console.error("[ERROR GLOBAL]:", err.message);
    res.status(500).json({
        exception: "Error interno del servidor."
    });
});

// Exportar para Vercel Serverless:
export default app;

// Solo iniciar el servidor cuando se ejecuta directamente (desarrollo local).
// En Vercel, el archivo api/index.js importa la app sin necesidad de listen().
const isDirectRun = process.argv[1] && (
    process.argv[1].endsWith("app.js") ||
    process.argv[1].endsWith("app")
);

if(isDirectRun) {
    const server = app.listen(port, () => {
        console.log(`✅ Servidor activo en: http://localhost:${port}`);
    });

    const gracefulShutdown = (signal) => {
        console.log(`\n⏳ ${signal} recibido. Cerrando servidor...`);
        server.close(() => {
            console.log("✅ Servidor cerrado correctamente.");
            process.exit(0);
        });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}
