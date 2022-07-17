import fastify from "fastify";
import { authStrategy } from "./auth.js";
import ExampleController from "./controllers/example.js";

export const server = fastify();

new ExampleController(server, authStrategy);

await server.listen({ port: 1234, host: "127.0.0.1" });
console.log("Started");
