/// <reference path="../services/wxService.d.ts" />
declare var UserModel: UserModel.IUsers;

export = UserModel;
export as namespace UserModel;

declare namespace UserModel {

  interface IUser extends WxService.IUserInfo {
    userId: string;
    role: string[];
  }

  interface IUsers {
    query(userId: string): Promise<IUser>;
    create(userInfo: WxService.IUserInfo): Promise<IUser>;
  }
}