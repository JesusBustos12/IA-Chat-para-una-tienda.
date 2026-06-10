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

// id:
const id = crypto.randomUUID();

// State:
let isLoading = false;

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
        errorBubble.textContent = "⚠️ Error: No se pudo obtener respuesta. Intenta de nuevo.";
        messagesContent.appendChild(errorBubble);
        messagesContent.scrollTop = messagesContent.scrollHeight;
    } finally {
        isLoading = false;
        messagesSend.disabled = false;
        messagesSend.textContent = "Enviar";
        messagesUser.disabled = false;
        messagesUser.focus();
    }
}

// Events:
if (chatForm) {
    chatForm.addEventListener("submit", (event) => {
        event.preventDefault();
        responseBack();
    });
}
