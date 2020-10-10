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
	jwt: UserJwt,
	user: User,
}