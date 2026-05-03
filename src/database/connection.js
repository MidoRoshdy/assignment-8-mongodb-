import { MongoClient } from "mongodb";
const url = "mongodb://localhost:27017";
const dbName = "assignment_8";
let cachedClient = null;

export const connectToDatabase = async () => {
  if (cachedClient) {
    return { client: cachedClient, dbName };
  }

  const client = new MongoClient(url);
  await client.connect();
  console.log("Connected successfully to server");
  cachedClient = client;

  return { client: cachedClient, dbName };
};
