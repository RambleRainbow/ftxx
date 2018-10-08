declare var WxService: WxService.IService;

export = WxService;
export as namespace WxService;

declare namespace WxService {
  interface IUserInfo {
    openId?: string;
    unionId?: string;
    nickName: string;
    avatarUrl: string;
    gender: Number;
    country: string;
    province: string;
    city: string;
    language: string;
  }
  
  interface IUserInfoWithSignature {
    userInfo: IUserInfo;
    rawData: string;
    signature: string;
    encryptedData: string;
    iv: string;
  }

  export interface ISession {
    openid: string;
    session_key: string;
    unionid?: string;
    errcode?: number;
    errMsg?: string;
  }

  export interface IService {
    code2Session(code: string): Promise<ISession>;
    signature(sessionKey: string, rawData: string): string;
    decryptUserInfo(session: ISession, data: IUserInfoWithSignature): IUserInfo;
  }
}
