"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const mgdb = require("mongodb");
class MongoDBHelper {
    constructor() {
        this._client = null;
        this._db = null;
        this._host = config.get("MongoDB").host;
        this._port = config.get("MongoDB").port;
        this._dbName = config.get("MongoDB").db;
    }
    GetOrCreateClient() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._client !== null) {
                return this._client;
            }
            this._client = yield mgdb.MongoClient.connect(`mongodb://${this._host}:${this._port}`);
            return this._client;
        });
    }
    CreateCollection(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            let client = yield this.GetOrCreateClient();
            let db = client.db(this._dbName);
            let collection = db.collection(collectionName);
            return collection;
        });
    }
    Close() {
        if (this._client !== null) {
            this._client.close();
            this._db = null;
            this._client = null;
        }
    }
}
exports.MongoDBHelper = MongoDBHelper;
