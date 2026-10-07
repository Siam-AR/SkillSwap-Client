import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URI;
const appDbName = process.env.APP_DB_NAME || process.env.AUTH_DB_NAME;

if (!uri) {
  throw new Error("Missing MONGO_DB_URI environment variable");
}

if (!appDbName) {
  throw new Error("Missing APP_DB_NAME or AUTH_DB_NAME environment variable");
}

export let clientPromise;
export let client;

if (!globalThis._mongoClientPromise) {
  client = new MongoClient(uri);
  globalThis._mongoClientPromise = client.connect();
  globalThis._mongoClient = client;
} else {
  client = globalThis._mongoClient;
}

clientPromise = globalThis._mongoClientPromise;

export async function getAppDb() {
  const client = await clientPromise;
  return client.db(appDbName);
}
