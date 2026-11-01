import { MongoClient } from "../server/node_modules/mongodb/lib/mongo_client.js";
import { config } from "../server/src/config.js";
const c = new MongoClient(config.mongoUri);
await c.connect();
const r = await c.db(config.dbName).collection("system_config").updateOne(
  { key: "global" },
  { $set: { "site.name": "", "site.supportContact": "" } },
);
console.log("modified=", r.modifiedCount);
console.log(JSON.stringify(await c.db(config.dbName).collection("system_config").findOne({ key: "global" })).slice(0, 300));
await c.close();
