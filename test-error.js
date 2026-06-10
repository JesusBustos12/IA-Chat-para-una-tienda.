import { OpenAIError } from "openai/error.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: "fake" });

try {
  await openai.beta.threads.runs.create(undefined, { assistant_id: "fake" });
} catch (e) {
  console.log("TEST 1:", e.message);
}

try {
  await openai.beta.threads.runs.retrieve("thread_1", undefined);
} catch (e) {
  console.log("TEST 2:", e.message);
}
