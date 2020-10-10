import serverEnv from "../lib/envalid";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  Context,
  RegisterFunctionType,
  UserJwt,
} from "../../types/fastifyHelpers";
import { prisma } from "..";

const systemDetails = {
  userId: 0,
  username: "system",
  email: "system@jankons.dev",
};

const registerBase: RegisterFunctionType = (server, opts, done) => {
  server.get("/generate", async (request, reply) => {
    // 1 off for system purposes only.
    const systemUser: UserJwt = systemDetails;
    return await jwt.sign(
      systemUser,
      serverEnv.ROOT_PRIVATE_KEY,
      { algorithm: serverEnv.JWT_ALGORITHM, noTimestamp: true },
      async function (err, token) {
        if (err) {
          return await reply.status(500).send();
        } else {
          return await reply.send({ token });
        }
      }
    );
  });

  // -- CREATE --
  interface ApiCreateQuerystring {
    // TODO: extract types from Schema object below?
    key: string;
    username: string;
    email: string;
  }
  const apiCreateQuerystringSchema = {
    type: "object",
    properties: {
      key: {
        type: "string",
      },
      username: {
        type: "string",
      },
      email: {
        type: "string",
      },
    },
    required: ["key", "username", "email"],
  };

  // https://www.fastify.io/docs/v2.2.x/Validation-and-Serialization/
  server.get<{
    Querystring: ApiCreateQuerystring;
  }>(
    "/create",
    {
      schema: {
        querystring: apiCreateQuerystringSchema,
      },
    },
    async (request, reply) => {
      // Root key to check against
      const rootJwt = (await jwt.verify(
        request.query.key,
        serverEnv.ROOT_PRIVATE_KEY
      )) as UserJwt;
      if (
        rootJwt.userId !== systemDetails.userId ||
        rootJwt.username !== systemDetails.username ||
        rootJwt.email !== systemDetails.email
      ) {
        return await reply.status(403).send();
      }

      // Generate password
      const hashedValue = await bcrypt.hash(
        serverEnv.KNOWN_PASSWORD,
        serverEnv.SALT_ROUNDS
      );

      // Add new user
      const user = await prisma.user.create({
        data: {
          email: request.query.email,
          username: request.query.username,
          hash: hashedValue,
        },
      });

      return await reply.send(user);
    }
  );

  done();
};

export default registerBase;
