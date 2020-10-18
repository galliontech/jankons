import { prisma } from "..";
import { Context, UserJwt } from "../../types/fastifyHelpers";
import jwt from "jsonwebtoken";
import serverEnv from "./envalid";

// TODO: better errors and error handling
export const authenticate = async (authHeader?: string): Promise<Context> => {
	// Take off bearer
	let token;
	if (authHeader && authHeader.startsWith("Bearer ")){
		token = authHeader.substring(7, authHeader.length);
	} else {
		throw new Error("Invalid Bearer token");
	}

  const decodedToken = (await jwt.decode(token)) as UserJwt;

  const user = await prisma.user.findOne({
    where: {
      id: decodedToken.userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const verifiedJwt = (await jwt.verify(
    token,
    serverEnv.ROOT_PRIVATE_KEY + user.hash
  )) as UserJwt;

  return {
    jwt: verifiedJwt,
    user: user,
  };
};
