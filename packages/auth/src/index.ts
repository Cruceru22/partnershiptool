import { headers } from "next/headers";

import { auth } from "./auth";

export const getSession = async () =>
  auth.api.getSession({
    headers: await headers(),
  });

export { auth, type Session } from "./auth";
export { encrypt, decrypt } from "./encryption";
