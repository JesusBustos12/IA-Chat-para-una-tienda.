// Dependencies:
import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";

// Environment variable integrity:
dotenv.config();

// Create and configure the server:
const app = express();
const port = process.env.PORT || 3000;

// Serve the Front-end:
app.use("/", express.static("public"));

// Middleware configurations:
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Pass the OpenAI API key:
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Thread as an object:
const userThread = {};

// Post request:
app.post("/assistant/chat", async(req, res) => {

    // Unpack body properties:
    const {id, message} = req.body;

    // Status 404:
    if(!message){
        return res.status(404).json({
            exception: "Error. Message not found"
        });
    }

    // Try and catch:
    try{

        // UserThread validation:
        if(!userThread[id]){
            const thread = await openai.beta.threads.create();
            userThread[id] = thread.id;
        }

        const threadId = userThread[id];

        // Add message to threadId:
        await openai.beta.threads.messages.create(threadId, {
            role: "user", content: message
        });

        // Execution:
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: "asst_MhBY40No7qy8EUR3cNRNktqs"
        });

        // Process executions:
        let runStatus = run;
        let attempts = 0;
        const maxAttempts = 15;

        while(runStatus.status !== "completed" && attempts < maxAttempts){

            // Resolve the promise:
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Status of thread and run details:
            runStatus = await openai.beta.threads.runs.retrieve(run.id, {
                thread_id: threadId
            });

            // Add a new attempt:
            attempts++;

            // Execution attempt: ${attempts}. Execution status: ${runStatus.status}:
            console.log(`Execution attempt: ${attempts}. Execution status: ${runStatus.status} `);

        }

        // Add error message to backend heap if execution fails to process:
        if(runStatus.status !== "completed"){
            throw new Error(`Error. Could not process execution: ${runStatus.status}`);
        }

        // List threadId:
        const messages = await openai.beta.threads.messages.list(threadId);

        console.log(`Total chat messages: ${messages.data.length}`);

        console.log("Chat messages: " + messages.data);

        // Filter assistant messages:
        const messagesBot = messages.data.filter(msg => msg.role == "assistant");

        console.log(`Total bot messages in chat: ${messagesBot}`);

        // Sort the messages:
        const messagesReply = messagesBot
                                        .sort((a,b) => b.created_at - a.created_at)[0]
                                        .content[0].text.value;

        console.log("Message: " + messagesReply);

        // Status 200:
        return res.status(200).json({
            messagesReply
        });

    }catch(exception){
        // Status 500:
        return res.status(500).json({
            exception: "Error. With the server"
        });
    }

});

// Serve the back-end:
app.listen(port, () => {
    console.log("Your server is starting at: http//localhost/ " + port);
});
