import * as MongoDB from "mongodb";
import * as fs from "fs";
import * as yaml from "js-yaml";

(async() => {
    try {
        let doc:any = yaml.safeLoad(fs.readFileSync("books.yaml","utf8"));
        doc = doc.map( (book:any) => {
            book._id = new MongoDB.ObjectId(book._id);
            return book;
        });
        let client: MongoDB.MongoClient = await MongoDB.connect("mongodb://localhost:27017", {useNewUrlParser: true});
        let db: MongoDB.Db = client.db("ftxx");
        let collection: MongoDB.Collection = db.collection("books");
        collection.deleteMany({});
        let rtn: MongoDB.InsertWriteOpResult = await collection.insertMany(doc);
        await client.close();
    } catch(err) {
        console.log(err);
    }
})();