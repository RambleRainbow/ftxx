/// <reference path="../models/books.d.ts" />

import {NextFunction, Request, Response, Router} from "express";
import {BaseRoute} from "./route";
import books from "../models/books";

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
        res.send(books.Query({}));
    }

    BooksDetail(req: Request, res: Response, next: NextFunction): void {
        let bookDetail:BookDetail = books.QueryBookDetail(req.params.id);
        if(bookDetail) {
            res.json(bookDetail);
        } else {
            res.statusCode = 404;
            res.json({});
        }
    }

    CreateBook(req: Request, res: Response, next: NextFunction): void {
            let rtn: BookDetail = books.CreateBook(<BookDetail>req.body);
            res.statusCode = 201;
            res.json(rtn);
    }
}