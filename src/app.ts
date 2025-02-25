import fastify from "fastify";
import routes from "./routes";
import cookie from "@fastify/cookie";
import { getToken } from "./controller/token";
import { analiseAnaminese } from "./services/analyse";
import { connectionTasy } from "./connection/database";
import { analiseCid } from "./controller/register";


export const app = fastify()

app.register(routes)
app.register(cookie)

connectionTasy()

getToken()

analiseAnaminese()