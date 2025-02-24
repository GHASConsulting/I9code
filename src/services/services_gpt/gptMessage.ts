import fetch from "node-fetch";
import "dotenv/config";

export async function getMessages(threadId : string) {
  console.log("Fetching response for thread ID:", threadId);
  const apiKey = process.env.API_KEY_GPT; // Use an environment variable for the API key

  // Adicionar um atraso antes de fazer a solicitação
  await new Promise(resolve => setTimeout(resolve, 50000));

  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2' // Adicionando o cabeçalho necessário
    }
  });

  const jsonResponse : any = await response.json();
  const jsonResponseGPT = await jsonResponse.data[0].content[0].text.value
  console.log("+> Data received from API:", jsonResponse.data[0].content[0].text.value);

  return jsonResponseGPT


}
