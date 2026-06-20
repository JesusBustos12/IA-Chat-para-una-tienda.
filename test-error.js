// Native fetch

async function test() {
    try {
        const response = await fetch("http://localhost:3300/assistant/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: "test-user-123",
                message: "Que vendes"
            })
        });
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", data);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}
test();
