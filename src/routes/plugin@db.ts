import { type RequestHandler } from "@builder.io/qwik-city";
import { initializeDb } from "~/utils/db";

export const onRequest: RequestHandler = async ({ env }) => {
  const url = env.get("TURSO_DATABASE_URL")!;
  const authToken = env.get("TURSO_AUTH_TOKEN")!;
  await initializeDb(url, authToken);
};
