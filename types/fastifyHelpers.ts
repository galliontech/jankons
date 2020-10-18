import { User } from "@prisma/client";
import {
  FastifyInstance,
  FastifyLoggerInstance,
  FastifyPluginOptions,
  FastifyRegisterOptions,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
} from "fastify";

export type RegisterFunctionType = (
  server: FastifyInstance<
    RawServerBase,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    FastifyLoggerInstance
  >,
  opts: FastifyRegisterOptions<FastifyPluginOptions>,
  done: () => void
) => void;

export interface UserJwt {
  userId: number;
  username: string;
  email: string;
}

export interface Context {
  jwt: UserJwt;
  user: User;
}

export interface ApiPaginationQuerystring {
  skip: number;
  take: number;
}

interface BaseSchemaInterface<T> {
  properties: T;
}

export const extendSchemaWithPagination = <T extends BaseSchemaInterface<any>>(
  schema: T
) => {
  return {
    skip: {
      type: "number",
    },
    take: {
      type: "number",
    },
    ...schema.properties,
  } as T & { skip: { type: string }; take: { type: string } };
};

export const defaultPagination: ApiPaginationQuerystring = {
  skip: 0,
  take: 20,
};
