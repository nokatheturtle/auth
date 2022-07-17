import { FastifyInstance } from "fastify";
import { Controller, Get } from "@angonoka/core";
import { AuthorizedRequest, WithAuth } from "../../src/index.js";
import { authStrategy, IAuthStrategy, User } from "../auth.js";

@Controller("example")
class ExampleController {
  constructor(public server: FastifyInstance, public auth: IAuthStrategy) {}

  @Get("user")
  @WithAuth(authStrategy)
  getUser([, , user]: AuthorizedRequest<User>) {
    return user;
  }
}

export default ExampleController;
