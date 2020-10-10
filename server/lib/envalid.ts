import envalid, { host, makeValidator, num, port, str } from "envalid";
import dotenv from "dotenv";
import path from "path";
import { Algorithm } from "jsonwebtoken";
import { Validate } from "../../types/utils";

const envPath = path.resolve(process.cwd(), "server/.env");
dotenv.config({
  path: envPath,
});

// Custom validators
const jwtAlgorithms = makeValidator((x) => {
  const validList = [
    "HS256",
    "HS384",
    "HS512",
    "RS256",
    "RS384",
    "RS512",
    "ES256",
    "ES384",
    "ES512",
    "PS256",
    "PS384",
    "PS512",
    "none",
  ] as const;
  type OurUnionType = typeof validList[number];
  type AssignableAlgorithmTypes = Validate<OurUnionType, Algorithm>;

  if (validList.includes(x as AssignableAlgorithmTypes)) {
    return x as AssignableAlgorithmTypes;
  } else throw new Error(x + " is not a valid JWT Algorithm type");
});

// Server environment
const serverEnv = envalid.cleanEnv(process.env, {
  // DB
  // DATABASE_URL: str(), prevented by prisma

  // WEBSERVER
  SERVER_PORT: port(),
  SERVER_HOST: host(),

  JWT_ALGORITHM: jwtAlgorithms(),
  ROOT_PRIVATE_KEY: str(),
  KNOWN_PASSWORD: str(),
  SALT_ROUNDS: num(),
});

export default serverEnv;
