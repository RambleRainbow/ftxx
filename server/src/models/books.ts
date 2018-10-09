/// <reference path="books.d.ts" />

import * as config from "config";
import * as fs from "fs";
import * as mgdb from "mongodb";
import {MongoDBHelper} from "./mongoHelper";
import * as debugModal from "debug";

let debug: debugModal.IDebugger = debugModal("ts-express:models:books");

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
            let c: mgdb.Collection = await helper.CreateCollection("booksTemp");
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

    async QueryBookLikes(id: string): Promise<number> {
        let helper: MongoDBHelper = new MongoDBHelper();
        try {
            let c: mgdb.Collection = await helper.CreateCollection("bookLikes");
            let rtn: any = await c.findOne({_id: new mgdb.ObjectId(id)});
            helper.Close();
            if(rtn === null) {
                return 0;
            } else {
                return rtn.amount;
            }
        } catch (err) {
            helper.Close();
            debug(`QueryBookLikes Error: ${err.message}`);
            return 0;
        }
    }

    async QueryIsUserLike(id: string, userId: string): Promise<boolean> {
        let helper: MongoDBHelper = new MongoDBHelper();
        try {
            let c: mgdb.Collection = await helper.CreateCollection("bookLikes");
            let rtn: any = await c.find({_id: new mgdb.ObjectId(id), users: userId}).toArray();
            helper.Close();

            return rtn.length !== 0;
        } catch(err) {
            helper.Close();
            debug(`QueryIsUserLike Error: ${err.message}`);
            return false;
        }
    }

    async AddUserLike(id: string, userId: string): Promise<boolean> {
        let helper: MongoDBHelper = new MongoDBHelper();
        let mid: mgdb.ObjectId = new mgdb.ObjectId(id);
        try {
            let c: mgdb.Collection = await helper.CreateCollection("bookLikes");
            let userLikes: any = await c.find({_id: new mgdb.ObjectId(id), users: userId}).toArray();
            if(userLikes.length === 0) {
                let bookLike: any = await c.findOne({_id: mid},{projection: {amount: 1}});
                if(bookLike === null) {
                    let result:mgdb.InsertOneWriteOpResult = await c.insertOne({
                        _id: mid,
                        amount: 1,
                        users: [userId]
                    });
                    helper.Close();
                    return result.result.ok === 1;
                } else {
                    let result: mgdb.WriteOpResult = await c.update({_id: mid}, {$push:{users: userId}, $set:{amount: bookLike.amount +1}});
                    helper.Close();
                    return result.result.ok === 1;
                }
            } else {
                helper.Close();
                return true;
            }
        } catch(err) {
            helper.Close();
            debug(`AddUserLke Error: ${err.message}`);
            return false;
        }
    }

    async RemoveUserLike(id: string, userId: string): Promise<boolean> {
        let helper: MongoDBHelper = new MongoDBHelper();
        let mid: mgdb.ObjectId = new mgdb.ObjectId(id);
        try {
            let c: mgdb.Collection = await helper.CreateCollection("bookLikes");
            let bookLike: any = await c.findOne(
                {_id: mid,users: userId},
                {projection: {amount : 1}}
            );
            if(bookLike === null) {
                helper.Close();
                return true;
            } else {
                let result: mgdb.WriteOpResult = await c.update(
                    {_id: mid},
                    {$pull: {users: userId}, $set: {amount: bookLike.amount-1}}
                );

                return result.result.ok === 1;
            }
        } catch(err) {
            helper.Close();
            debug(`RemoveUserLike Error: ${err.message}`);
            return false;
        }
    }
}

export default <IBooks>(new Books());