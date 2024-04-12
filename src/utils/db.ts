import { type Client, createClient } from "@libsql/client/web";

let _db!: Client;

export function getDB() {
  if (!_db) {
    throw new Error("DB not set");
  }
  return _db;
}

export async function initializeDb(url: string, authToken: string) {
  if (!_db) {
    _db = createClient({
      url,
      authToken,
    });
  }
}
