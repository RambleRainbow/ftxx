/// <reference path="books.d.ts" />

import * as config from "config";
import * as fs from "fs";
import * as mgdb from "mongodb";
import {MongoDBHelper} from "./mongoHelper";
// const books: any = require("../datas/books.json");

class Books implements IBooks {
    async Query(opts: BookQueryOptions): Promise<Book[]> {
        let helper:MongoDBHelper = new MongoDBHelper();
        try {
            let collection:mgdb.Collection = await helper.CreateCollection("books");
            let books:any[] = await collection.find<Book>({}).toArray();

            let rtn: Book[] = books.map( (item) => {
                return {
                    _id: item._id,
                    name: item.name,
                    coverImage: item.coverImage,
                    labels: item.labels
                };
            });
            helper.Close();
            return rtn;
        } catch(err) {
            helper.Close();
            console.log(err);
            return null;
        }
    }

    async QueryBookDetail(id: string): Promise<BookDetail> {
        let helper: MongoDBHelper = new MongoDBHelper();
        try {
            let collection: mgdb.Collection = await helper.CreateCollection("books");
            let books: BookDetail[] = await collection.find<BookDetail>({"_id": new mgdb.ObjectID(id)}).toArray();
            helper.Close();
            if(books.length >= 1 ) {
                return books[0];
            } else {
                return null;
            }
        } catch (err) {
            helper.Close();
            console.log(err);
            return null;
        }
    }

    async CreateBook(book: BookDetail): Promise<BookDetail> {
        let helper:MongoDBHelper = new MongoDBHelper();
        try {
            let c: mgdb.Collection = await helper.CreateCollection("books");
            let rtn:any = book;
            rtn._id = new mgdb.ObjectId();
            await c.insertOne(rtn);
            helper.Close();
            return rtn;
        } catch(err) {
            helper.Close();
            console.log(err);
            return null;
        }
    }

}

export default <IBooks>(new Books());