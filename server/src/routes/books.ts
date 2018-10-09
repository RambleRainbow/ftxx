/// <reference path="../models/books.d.ts" />

import {NextFunction, Request, Response, Router} from "express";
import {BaseRoute} from "./route";
import books from "../models/books";
import * as TokenService from "../services/tokenService";

let handler: BooksRouter = null;
export class BooksRouter extends BaseRoute {
    _router: BooksRouter = null;
    public static create(): Router {
        if( handler === null ) {
            handler = new BooksRouter();
        }

        let router: Router = Router();
        router.get("/", (req: Request, res:Response, next: NextFunction) => {
            handler.Books(req, res, next);
        });

        router.get("/:id", (req: Request,res: Response, next: NextFunction) => {
            handler.BooksDetail(req, res, next);
        });

        router.post("/", (req: Request, res: Response, next: NextFunction) => {
            handler.CreateBook(req, res, next);
        });

        router.get("/:id/likes", (req: Request, res: Response, next: NextFunction) => {
            handler.getLikes(req, res, next);
        });

        router.post("/:id/likes", (req: Request, res: Response, next: NextFunction) => {
            handler.addLikes(req, res, next);
        });

        router.delete("/:id/likes", (req: Request, res: Response, next: NextFunction) => {
            handler.removeLikes(req, res, next);
        });

       return router;
    }

    constructor() {
        super();
    }

    Books(req:Request, res:Response, next:NextFunction): void {
        (async () => {
            let rtn: Book[] = await books.Query({});
            res.send(rtn);
        })();
    }

    BooksDetail(req: Request, res: Response, next: NextFunction): void {
        (async() => {
            let bookDetail:BookDetail = await books.QueryBookDetail(req.params.id);
            if(bookDetail) {
                res.json(bookDetail);
            } else {
                res.statusCode = 404;
                res.json({});
            }
        })();
    }

    CreateBook(req: Request, res: Response, next: NextFunction): void {
        (async() => {
            let rtn: BookDetail = await books.CreateBook(<BookDetail>req.body);
            if(rtn !== null) {
            res.statusCode = 201;
            res.json(rtn);
            } else {
                res.statusCode = 406;
                res.json("创建失败");
            }
        })();
    }

    async getLikes(req: Request, res: Response, next: NextFunction): Promise<void> {
      let playload: TokenService.ITokenPlayLoad = await TokenService.verify(req.headers.authorization);
      let rtn: any = {
          id: req.params.id,
          userId: playload.userId,
          isUserLike: false,
          amount: 0
      };
      rtn.amount = await books.QueryBookLikes(req.params.id);
      rtn.isUserLike = await books.QueryIsUserLike(req.params.id, playload.userId);
      res.statusCode = 200;
      res.json(rtn);
    }

    async addLikes(req: Request, res: Response, next: NextFunction): Promise<void> {
      let playload: TokenService.ITokenPlayLoad = await TokenService.verify(req.headers.authorization);
      if(books.AddUserLike(req.params.id, playload.userId)) {
          res.statusCode = 204;
          res.json({});
      } else {
          res.statusCode = 400;
          res.json({
              errmsg: "添加点赞失败"
          });
      }
    }

    async removeLikes(req: Request, res: Response, next: NextFunction): Promise<void> {
        let playload: TokenService.ITokenPlayLoad = await TokenService.verify(req.headers.authorization);
        if(books.RemoveUserLike(req.params.id, playload.userId)) {
            res.statusCode = 204;
            res.json({});
        } else {
            res.statusCode = 400;
            res.json({
                errmsg: "取消点赞失败"
            });
        }
    }
}