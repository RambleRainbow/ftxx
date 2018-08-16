/// <reference path="../models/books.d.ts" />

import {NextFunction, Request, Response, Router} from "express";
import {BaseRoute} from "./route";
import books from "../models/books";
import { AsyncResource } from "async_hooks";

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
}