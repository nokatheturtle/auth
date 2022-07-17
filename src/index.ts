import { FastifyReply, FastifyRequest } from "fastify";
import { IEndpoint, Request, RequestTypes } from "@angonoka/core";

type IEndpointWithAuth = IEndpoint & {
  isEndpoint: boolean;
  needToAuth: boolean;
  openAPI: Array<any>;
};

export type AuthorizedRequest<T, D extends RequestTypes = {}> = [
  Request<D>[0],
  Request<D>[1],
  T
];

export const WithAuth = <T>(auth: () => T) => {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const fn = target[key] as IEndpointWithAuth;
    fn.needToAuth = true;
    if (!fn.openAPI) fn.openAPI = [];
    fn.openAPI.push({
      401: { schema: null, description: "Auth Error" },
    });
    if (!fn._modules) fn._modules = [];
    fn._modules.push(
      async (
        endpoint: IEndpointWithAuth,
        req: FastifyRequest,
        res: FastifyReply
      ) => {
        if (endpoint.needToAuth) {
          let user: T;

          try {
            user = await auth();
          } catch (error) {
            return res.code(401).send();
          }

          try {
            return await endpoint.bind(this)([req, res, user]);
          } catch (error) {
            console.error(error);
            return res.code(500).send();
          }
        }
      }
    );
    return descriptor;
  };
};
