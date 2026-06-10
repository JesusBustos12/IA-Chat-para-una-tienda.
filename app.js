// Dependencies:
import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Environment variable integrity:
dotenv.config();

const isDev = process.env.NODE_ENV !== "production";
const log = (...args) => { if(isDev) console.log("[DEV]", ...args); };

// Create and configure the server:
const app = express();
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

// Serve the Front-end:
app.use("/", express.static("public"));

// Pass the OpenAI API key:
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Thread as an object:
// Almacenamiento en memoria de threads por usuario.
// NOTA: Los threads se pierden al reiniciar el servidor.
// Para producción real, considerar persistencia con Redis o SQLite.
const userThread = new Map();

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

        // UserThread validation:
        if(!userThread.has(id)){
            const thread = await openai.beta.threads.create();
            userThread.set(id, thread.id);
        }

        const threadId = userThread.get(id);

        // Add message to threadId:
        await openai.beta.threads.messages.create(threadId, {
            role: "user", content: trimmedMessage
        });

        // Execution:
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: process.env.OPENAI_ASSISTANT_ID
        });

        // Process executions:
        let runStatus = run;
        let attempts = 0;
        const maxAttempts = 15;

        while(runStatus.status !== "completed" && attempts < maxAttempts){
            // Resolve the promise:
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Status of thread and run details:
            runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

            // Add a new attempt:
            attempts++;

            log(`Intento de ejecución: ${attempts}. Estado: ${runStatus.status}`);
        }

        // Add error message to backend heap if execution fails to process:
        if(runStatus.status !== "completed"){
            throw new Error(`Error. Could not process execution: ${runStatus.status}`);
        }

        // List threadId:
        const messages = await openai.beta.threads.messages.list(threadId);

        log(`Total chat messages: ${messages.data.length}`);

        // Filter assistant messages:
        const messagesBot = messages.data.filter(msg => msg.role === "assistant");

        log(`Total bot messages in chat: ${messagesBot.length}`);

        // Sort the messages:
        const messagesReply = messagesBot
                                        .sort((a,b) => b.created_at - a.created_at)[0]
                                        .content[0].text.value;

        log("Message: " + messagesReply);

        // Status 200:
        return res.status(200).json({
            messagesReply
        });

    } catch(exception) {
        console.error("[ERROR] /assistant/chat:", exception.message);

        // Distinguir errores de OpenAI de errores internos:
        const statusCode = exception.status || 500;
        const userMessage = statusCode === 429
            ? "El servicio está saturado. Intenta en unos minutos."
            : "Error interno del servidor. Intenta de nuevo más tarde.";

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

// Graceful shutdown:
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
