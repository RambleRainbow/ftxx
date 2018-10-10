"use strict";
/// <reference path="./users.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mongoHelper_1 = require("./mongoHelper");
const mgdb = require("mongodb");
const debugModal = require("debug");
let debug = debugModal("ts-express:model:users");
class Users {
    query(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let helper = new mongoHelper_1.MongoDBHelper();
            try {
                let collection = yield helper.CreateCollection("users");
                let user = yield collection.findOne({ userId });
                helper.Close();
                return user;
            }
            catch (err) {
                helper.Close();
                return null;
            }
        });
    }
    create(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = {
                userId: userInfo.openId,
                openId: userInfo.openId,
                unionId: userInfo.unionId,
                role: [],
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                gender: userInfo.gender,
                country: userInfo.country,
                province: userInfo.province,
                city: userInfo.city,
                language: userInfo.language
            };
            let helper = new mongoHelper_1.MongoDBHelper();
            try {
                let c = yield helper.CreateCollection("users");
                let dbItem = user;
                dbItem._id = new mgdb.ObjectId();
                yield c.insertOne(dbItem);
                helper.Close();
                return user;
            }
            catch (err) {
                debug(`insert error:${err.message}`);
                return null;
            }
        });
    }
}
let users = new Users();
module.exports = users;
