/// <reference path="./tokenService.d.ts" />

import * as jwt from "jsonwebtoken";
import * as config from "config";

class TokenService implements TokenService.ITokenService {
  private _secret: string = "";
  constructor (secret: string) {
    this._secret = secret;
  }

  async verify(token: string): Promise<TokenService.ITokenPlayLoad> {
    return new Promise<TokenService.ITokenPlayLoad>( (resolve: any,reject: any) => {
      if( token.match(/Beared \S+\.\S+\.\S+/i)) {
        let tokenString: string = token.split(" ")[1];

        jwt.verify(tokenString, this._secret, (error:jwt.VerifyErrors, decode:any) => {
          if(error) {
            resolve(null);
          } else {
            resolve(<TokenService.ITokenPlayLoad>decode);
          }
        });
      } else {
        resolve(null);
      }
    });
  }
}

var svr: TokenService.ITokenService = new TokenService(config.get<any>("JWT").secret);
export = svr;