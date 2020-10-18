import bent from "bent";

export const commandDirOptions = {
  // TODO: convert ts to js for real use - NOTE: this is also the case inside root level cli.js
  extensions: ["js", "ts"],
  visit: (commandModule: any) => {
    return commandModule.default;
  },
};

// FIXME: env vars !!!

export const authenticateAndGetJwt = () => {
  // TODO: login once, then store somewhere on disk?
  const stub =
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsInVzZXJuYW1lIjoidGVzdCIsImVtYWlsIjoiYXdlc29tZUB0ZXN0LmNvbSJ9.jeSL8I8MgkAhWtqFPkU6hLTuWJLkIBJDQXZg3lbSZP8d0bjC8z2R0rbxwq1lM-JesdD54eG2Vsj4d2uLAWlgbA";
  const token = stub;
  return token;
};

export const makePost = async (relativeUrl: string, body: any) => {
  const token = authenticateAndGetJwt();
  const headers = {
    authorization: `Bearer ${token}`,
  };
  const post = bent("http://localhost:8080", "POST", "json", 200);
  console.log(relativeUrl);
  return post(relativeUrl, body, headers);
};

interface BentQuerystring {
  [key: string]: string | number | unknown;
}

export const makeGet = async (
  relativeUrl: string,
  querystringItems: BentQuerystring
) => {
  const token = authenticateAndGetJwt();
  const headers = {
    authorization: `Bearer ${token}`,
  };
  const querystring = Object.entries(querystringItems)
    .map(([key, value]) => (value ? `${key}=${value}` : undefined))
    .filter((x) => !!x)
    .join("&");
  const fullQuerystring = querystring ? `?${querystring}` : "";
  const fullUrl = relativeUrl + fullQuerystring;

  const get = bent("http://localhost:8080", "GET", "json", 200);
  console.log(fullUrl);
  return get(fullUrl, undefined, headers);
};
