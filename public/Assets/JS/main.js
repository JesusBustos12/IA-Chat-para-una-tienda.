// --- Utils ---
const sanitizeHTML = (str) => {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
};

const createMessageBubble = (text, className, prefix, isHTML = false) => {
    const div = document.createElement("div");
    div.classList.add(className);
    if(isHTML) {
        div.innerHTML = `<strong>${prefix}:</strong> ${text}`;
    } else {
        div.innerHTML = `<strong>${prefix}:</strong> ${sanitizeHTML(text)}`;
    }
    return div;
};

// Selectors:
const chatForm = document.getElementById("chatForm");
const messagesSend = document.getElementById("inputBtn");
const messagesContent = document.querySelector(".chat__messages");
const messagesUser = document.getElementById("inputText");
const limitFill = document.getElementById("limitFill");
const limitText = document.getElementById("limitText");

// id and LocalStorage state:
let id = localStorage.getItem("chat_session_id");
if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("chat_session_id", id);
}

// Daily limits
const todayStr = new Date().toISOString().split('T')[0];
const lastRequestDate = localStorage.getItem("chat_last_request_date");
let remainingRequests = parseInt(localStorage.getItem("chat_remaining_requests"));

if (isNaN(remainingRequests) || lastRequestDate !== todayStr) {
    remainingRequests = 20; // Default limit
    localStorage.setItem("chat_remaining_requests", 20);
    localStorage.setItem("chat_last_request_date", todayStr);
}

// State:
let isLoading = false;

// Functions
const updateLimitUI = (remaining) => {
    const percentage = (remaining / 20) * 100;
    
    if (limitFill) {
        limitFill.style.width = `${percentage}%`;
        if (remaining <= 5) {
            limitFill.classList.add("limit__fill--warning");
        } else {
            limitFill.classList.remove("limit__fill--warning");
        }
    }
    if (limitText) {
        limitText.textContent = `${remaining}/20 consultas restantes hoy`;
    }
    
    if (remaining <= 0) {
        messagesUser.disabled = true;
        messagesSend.disabled = true;
        messagesUser.placeholder = "Límite diario alcanzado";
        messagesSend.textContent = "Límite";
    }
};

// Initialize UI optimistically from LocalStorage
updateLimitUI(remainingRequests);

// Sincronizar límite real con la base de datos (Backend)
const syncLimits = async () => {
    try {
        const response = await fetch("/assistant/limits");
        const data = await response.json();
        if (data.remainingCount !== undefined) {
            remainingRequests = data.remainingCount;
            localStorage.setItem("chat_remaining_requests", remainingRequests);
            localStorage.setItem("chat_last_request_date", new Date().toISOString().split('T')[0]);
            updateLimitUI(remainingRequests);
        }
    } catch (error) {
        console.error("Error al sincronizar límites de la DB:", error);
    }
};
syncLimits();

// Default welcome message
const showWelcomeMessage = () => {
    const welcomeText = "¡Hola! Soy el asistente virtual de la tienda. ¿En qué te puedo ayudar hoy? Puedes preguntarme sobre precios o disponibilidad de nuestros productos.";
    const welcomeBubble = createMessageBubble(welcomeText, "messages__bot", "Asistente");
    messagesContent.appendChild(welcomeBubble);
};
showWelcomeMessage();

// Backend response function:
const responseBack = async() => {
    if(isLoading) return false;

    // Extract the value of messagesUser:
    const message = messagesUser.value.trim();

    if(!message) return false;

    isLoading = true;
    messagesSend.disabled = true;
    messagesSend.textContent = "Enviando...";
    messagesUser.disabled = true;

    // messageUser:
    const userBubble = createMessageBubble(message, "messages__user", "Tú");
    messagesContent.appendChild(userBubble);
    messagesContent.scrollTop = messagesContent.scrollHeight;

    messagesUser.value = "";

    // messageResponse (loader):
    const loaderBubble = document.createElement("div");
    loaderBubble.classList.add("messages__bot", "messages__bot--response");
    loaderBubble.innerHTML = `<strong>Asistente:</strong> <div class="loader"></div>`;
    messagesContent.appendChild(loaderBubble);
    messagesContent.scrollTop = messagesContent.scrollHeight;

    try {
        const response = await fetch("/assistant/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id, message
            })
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.exception || "Error desconocido del servidor");
        }

        if(!data.messagesReply) {
            throw new Error("Respuesta vacía del asistente");
        }

        if (data.remainingCount !== undefined) {
            remainingRequests = data.remainingCount;
            localStorage.setItem("chat_remaining_requests", remainingRequests);
            localStorage.setItem("chat_last_request_date", new Date().toISOString().split('T')[0]);
            updateLimitUI(remainingRequests);
        }

        // Remove messageResponse:
        if(loaderBubble.parentNode) {
            loaderBubble.remove();
        }

        // Replace \n for <br> keeping XSS protection
        const sanitizedText = sanitizeHTML(data.messagesReply);
        const messageReplace = sanitizedText.replace(/\n/g, `<br>`);

        // messageBot:
        const botBubble = createMessageBubble(messageReplace, "messages__bot", "Asistente", true);
        messagesContent.appendChild(botBubble);
        messagesContent.scrollTop = messagesContent.scrollHeight;

        console.log("Mensaje del Asistente: ", data.messagesReply);

    } catch(exception) {
        console.error("Error del servidor:", exception);

        // Remove messageResponse:
        if(loaderBubble.parentNode) {
            loaderBubble.remove();
        }

        // Error bubble
        const errorBubble = document.createElement("div");
        errorBubble.classList.add("messages__bot", "messages__bot--error");
        errorBubble.textContent = "⚠️ " + (exception.message || "Error: No se pudo obtener respuesta. Intenta de nuevo.");
        messagesContent.appendChild(errorBubble);
        messagesContent.scrollTop = messagesContent.scrollHeight;
    } finally {
        isLoading = false;
        if (remainingRequests > 0) {
            messagesSend.disabled = false;
            messagesSend.textContent = "Enviar";
            messagesUser.disabled = false;
            messagesUser.focus();
        }
    }
}

// Events:
if (chatForm) {
    chatForm.addEventListener("submit", (event) => {
        event.preventDefault();
        responseBack();
    });
}
