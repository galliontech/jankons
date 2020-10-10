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
	userName: string;
}

export interface Context {
	jwt: UserJwt
}