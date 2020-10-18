import fastify from "fastify";
// @ts-ignore
import makePromisesSafe from "make-promises-safe";
import serverEnv from "./lib/envalid";
import { PrismaClient } from '@prisma/client'
import baseRoutes from './api/base';
import userRoutes from './api/user';
import bookmarkRoutes from './api/bookmark/bookmark';

const server = fastify({
  logger: false
});

export const prisma = new PrismaClient();

server.register(baseRoutes);
server.register(userRoutes);
server.register(bookmarkRoutes, { prefix: '/bookmark'});

server.listen(
  {
    port: serverEnv.SERVER_PORT,
    host: serverEnv.SERVER_HOST,
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(0);
    }
    console.log(`Server listening at ${address}`);
  }
);
