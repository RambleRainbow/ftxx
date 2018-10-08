/// <reference path="./users.d.ts" />

import {MongoDBHelper} from "./mongoHelper";
import * as mgdb from "mongodb";
import * as debugModal from "debug";

let debug: debugModal.IDebugger = debugModal("ts-express:model:users");

class Users implements UserModel.IUsers {
  async query(userId: string): Promise<UserModel.IUser> {
    let helper: MongoDBHelper = new MongoDBHelper();
    try {
      let collection: mgdb.Collection = await helper.CreateCollection("users");
      let user: any = await collection.findOne({userId});
      helper.Close();
      return <UserModel.IUser>user;
    } catch(err) {
      helper.Close();
      return null;
    }
  }

  async create(userInfo: WxService.IUserInfo): Promise<UserModel.IUser> {
    let user: UserModel.IUser =  {
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

    let helper: MongoDBHelper =  new MongoDBHelper();
    try {
      let c: mgdb.Collection = await helper.CreateCollection("users");
      let dbItem: any = user;
      dbItem._id = new mgdb.ObjectId();
      await c.insertOne(dbItem);
      helper.Close();
      return user;
    } catch (err) {
      debug(`insert error:${err.message}`);
      return null;
    }
  }
}


let users: UserModel.IUsers = new Users();
export = users;