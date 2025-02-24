import fetch from "node-fetch"; // You can install with npm install node-fetch
import "dotenv/config";

export async function postCreateRun(thread_id: string) {
  const url = `https://api.openai.com/v1/threads/${thread_id}/runs`;
  const apiKey = process.env.API_KEY_GPT; // Use an environment variable for the API key
  const assistant_id = process.env.ASSISTANT_ID; // Use an environment variable for the assistant ID

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "OpenAI-Beta": `assistants=v2`,
  };

  const body = {
    assistant_id: assistant_id, //.env
  };

  try {
   const response =  await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Resposta da API:", response.ok);

    return data;
  } catch (error) {
    console.error("Error making the call:", error);
    throw error;
  }
}
