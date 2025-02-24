import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { knex } from "../database";
import { getMessages } from "../services/services_gpt/gptMessage";
import { postCreateMessages } from "../services/services_gpt/gptCreateMessage";
import { getGPTResponseThread } from "../services/services_gpt/gptThread";
import { postCreateRun } from "../services/services_gpt/createRun";

export default async function (server: FastifyInstance) {
  server.post("/messages", async (request, reply) => {
    const { question }: any = request.body;
    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dyas
      });

      console.log("Received question:", question);

      const responseGPTThread = await getGPTResponseThread(question);
      console.log("Response from getGPTResponseThread:", responseGPTThread);

      const responseGPT = await getMessages(responseGPTThread);
      console.log("Response from getChatGPTResponse:", responseGPT);

      await knex("messages").insert({
        id: randomUUID(),
        session_id: sessionId,
        message_id: responseGPTThread,
      });

      reply.send({ responseGPT });
    } else {
      const session = await knex("messages")
        .select("*")
        .where("session_id", sessionId)
        .first();
        console.log("teste0")
      await postCreateMessages(question, session.message_id).then(async () => {
        console.log("teste1")
        await postCreateRun(session.message_id).then(async () => {
          console.log("teste2")
          const responseGPT = await getMessages(session.message_id);

          return reply.send({ responseGPT });
        });
      });
    }
  });
}
