// Selectors:
const messagesSend = document.getElementById("inputBtn");
const messagesContent = document.querySelector(".chat__messages");
const messagesUser = document.getElementById("inputText");

// id:
const id = Date.now() + Math.floor(230 + Math.random() * 500);

// Backend response function:
const responseBack = async() => {

    // Extract the value of messagesUser:
    const message = messagesUser.value.trim();

    if(!message) return false;

    // messageResponse:
    setTimeout(() => {
        messagesContent.innerHTML += `<div class="messages__bot messages__bot--response">Bot: <div class="loader"></div></div>`;
        messagesContent.scrollTop = messagesContent.scrollHeight;
    }, 250);

    // messageUser:
    messagesContent.innerHTML += `<div class="messages__user">User: ${message}</div>`;
    messagesContent.scrollTop = messagesContent.scrollHeight;

    messagesUser.value = "";

    try{

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

        // Remove messageResponse:
        document.querySelector(".messages__bot--response").remove();

        // Replace /\n/g for `<br>`:
        const messageReplace = data.messagesReply.replace(/\n/g, `<br>`);

        // messageBot:
        messagesContent.innerHTML += `<div class="messages__bot">Bot: ${messageReplace}</div>`;
        messagesContent.scrollTop = messagesContent.scrollHeight;

        console.log("Message the Bot: " + messageReplace);

    }catch(exception){
        console.log(exception, "Error with the server");
    }

}

// Events:
messagesUser.addEventListener("keypress", (event) => {
    if(event.key == "Enter"){
        event.preventDefault();
        responseBack();
    }
});
messagesSend.addEventListener("click", responseBack);
