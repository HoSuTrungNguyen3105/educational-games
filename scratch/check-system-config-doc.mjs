import { MongoClient } from "../server/node_modules/mongodb/lib/mongo_client.js";
import { config } from "../server/src/config.js";
const c = new MongoClient(config.mongoUri);
await c.connect();
const doc = await c.db(config.dbName).collection("system_config").findOne({ key: "global" });
console.log(JSON.stringify(doc, null, 2));
await c.close();
