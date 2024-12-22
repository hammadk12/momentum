import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI)

let clientPromise;

if (process.env.NODE_ENV === "development") {
    // In development, use a global variable to ensure the MongoClient is only created once
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production, it's safe to not use a global variable
    clientPromise = client.connect();
  }
  
  export default clientPromise;