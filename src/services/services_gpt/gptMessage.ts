import fetch from "node-fetch";
import "dotenv/config";

export async function getMessages(threadId: string, evolution: string) {
  console.log("Fetching response for thread ID:", threadId);
  const apiKey = process.env.API_KEY_GPT; // Use an environment variable for the API key

  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2' // Adicionando o cabeçalho necessário
    }
  });

  const jsonResponse: any = await response.json();
  let jsonResponseGPT = jsonResponse.data[0].content[0].text.value;

  const compareEvolutions = (evolution: string, jsonResponseGPT: string) => {
    const evolutionArray = evolution.split(' ');
    const jsonResponseGPTArray = jsonResponseGPT.split(' ');
    const evolutionLength = evolutionArray.length;
    const jsonResponseGPTLength = jsonResponseGPTArray.length;

    if (evolutionLength === jsonResponseGPTLength) {
      for (let i = 0; i < evolutionLength; i++) {
        if (evolutionArray[i] !== jsonResponseGPTArray[i]) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  console.log(compareEvolutions(evolution, jsonResponseGPT));

  // Função para esperar alguns segundos
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Loop para verificar a resposta até que ela seja diferente da pergunta
  while (compareEvolutions(evolution, jsonResponseGPT) === true) {
    console.log("Resposta igual à pergunta, esperando 5 segundos antes de tentar novamente...");
    await wait(5000); // Espera 5 segundos

    // Faz a solicitação novamente
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    const jsonResponse: any = await response.json();
    jsonResponseGPT = jsonResponse.data[0].content[0].text.value;
  }

  return jsonResponseGPT;
}
