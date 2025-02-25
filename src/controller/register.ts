import { randomUUID } from "node:crypto";
import { knex } from "../database";
import { getMessages } from "../services/services_gpt/gptMessage";
import { getGPTResponseThread } from "../services/services_gpt/gptThread";
import { postCreateMessages } from "../services/services_gpt/gptCreateMessage";
import { postCreateRun } from "../services/services_gpt/createRun";
import { getToken } from "./token";



export async function analiseCid(evolution: string) {

  const sessionId = await getToken();

  const sessionIdExists = await knex("messages")
    .select("*")
    .where("session_id", sessionId)
    .first();

    if (sessionIdExists === undefined) {
        const sessionId = getToken();

        console.log("Received question:", evolution);
  
        const responseGPTThread = await getGPTResponseThread(evolution);
        console.log("Response from getGPTResponseThread:", responseGPTThread);
  
        const responseGPT = await getMessages(responseGPTThread, evolution);
        console.log("Response from getChatGPTResponse:", responseGPT);
  
        await knex("messages").insert({
          id: randomUUID(),
          session_id: sessionId,
          message_id: responseGPTThread,
        });

        return responseGPT;
      } else {
        const session = await knex("messages")
          .select("*")
          .where("session_id", sessionId)
          .first();
          console.log("teste0")
        await postCreateMessages(evolution, session.message_id).then(async () => {
          console.log("teste1")
          await postCreateRun(session.message_id).then(async () => {
            console.log("teste2")
            const responseGPT = await getMessages(session.message_id, evolution);
  
            return responseGPT;
          });
        });
      }
}

