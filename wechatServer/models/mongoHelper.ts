import * as config from "config";
import * as mgdb from "mongodb";

export class MongoDBHelper {
    private _host: string;
    private _port: string;
    private _dbName: string;

    private _client: mgdb.MongoClient = null;
    private _db: mgdb.Db = null;
    constructor() {
        this._host = config.get<any>("MongoDB").host;
        this._port = config.get<any>("MongoDB").port;
        this._dbName = config.get<any>("MongoDB").db;
    }
    private async GetOrCreateClient(): Promise<mgdb.MongoClient> {
        if(this._client !== null) {
            return this._client;
        }

        this._client = await mgdb.MongoClient.connect(`mongodb://${this._host}:${this._port}`);
        return this._client;
    }
    async CreateCollection(collectionName: string): Promise<mgdb.Collection> {
        let client: mgdb.MongoClient = await this.GetOrCreateClient();
        let db: mgdb.Db = client.db(this._dbName);
        let collection: mgdb.Collection = db.collection(collectionName);
        return collection;
    }

    Close(): void {
        if(this._client !== null) {
            this._client.close();
            this._db = null;
            this._client = null;
        }
    }
}