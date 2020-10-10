import serverEnv from "../lib/envalid";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  Context,
  RegisterFunctionType,
  UserJwt,
} from "../../types/fastifyHelpers";
import { prisma } from "..";
import { authenticate } from "../lib/context";

const registerUserRoutes: RegisterFunctionType = (server, opts, done) => {
  // -- LOGIN --
  interface ApiLoginBody {
    email: string;
    password: string;
  }
  const apiLoginBodySchema = {
    type: "object",
    properties: {
      email: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
    required: ["email", "password"],
  };
  server.post<{ Body: ApiLoginBody }>(
    "/login",
    {
      schema: {
        body: apiLoginBodySchema,
      },
    },
    async (request, reply) => {
      // Attempt to login with user
      const checkUser = await prisma.user.findOne({
        where: {
          email: request.body.email,
        },
      });

      if (!checkUser) {
        return await reply.status(403).send("Email or password not valid");
      }

      const isValid = await bcrypt.compare(
        request.body.password,
        checkUser.hash
      );

      if (!isValid) {
        return await reply.status(403).send("Email or password not valid");
      }

      // Return JWT signed with root key and hash
      const userJwt: UserJwt = {
        userId: checkUser.id,
        username: checkUser.username,
        email: checkUser.email,
      };
      return await jwt.sign(
        userJwt,
        serverEnv.ROOT_PRIVATE_KEY + checkUser.hash,
        { algorithm: serverEnv.JWT_ALGORITHM, noTimestamp: true }, // TODO: timestamp but long?
        async function (err, token) {
          if (err) {
            return await reply.status(500).send(err);
          } else {
            return await reply.send({ token });
          }
        }
      );
    }
  );

  server.post("/user/test", async (request, reply) => {
    // Simple test endpoint to check authentication
    const user = await authenticate(request.headers.authorization as string);
    return await reply.send({ message: "You are authenticated!", ...user.jwt });
  });

  done();
};

export default registerUserRoutes;
