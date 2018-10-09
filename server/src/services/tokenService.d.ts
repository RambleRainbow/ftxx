declare var tokenService: TokenService.ITokenService 

export = TokenService;
export as namespace TokenService;

declare namespace TokenService {
  interface ITokenService {
    verify(token: string): Promise<ITokenPlayLoad>;
  }

  interface ITokenPlayLoad {
    userId: string;
  }
}