import * as MongoDB from "mongodb";
import * as fs from "fs";
import { spawnSync } from "child_process";

(async() => {
   let MongoClient: MongoDB.MongoClient  =  await MongoDB.connect("mongodb://localhost:27017", {useNewUrlParser: true});
   let db: MongoDB.Db = MongoClient.db("ftxx");
   let collection:MongoDB.Collection = db.collection("booksTemp");
   let books: any = await collection.find({}).toArray();
   fs.writeFileSync("books.json", JSON.stringify(books));

   let b: any = spawnSync("json2yaml.cmd", ["books.json"]);
   fs.writeFileSync("books.yaml", b.stdout.toString("utf8"));
   await MongoClient.close();
})();