import fetch from "node-fetch"; // Você pode instalar com npm install node-fetch
import "dotenv/config";

export async function postCreateMessages(question: string, thread_id: string) {
  const url = `https://api.openai.com/v1/threads/${thread_id}/messages`;
  const apiKey = process.env.API_KEY_GPT; // Use an environment variable for the API key

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "OpenAI-Beta": `assistants=v2`,
  };

  const body = {
    role: "user", content: question,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Resposta da API:", response.ok);

    return data;
  } catch (error) {
    console.error("Erro ao fazer a requisição:", error);
    throw error;
  }
}
