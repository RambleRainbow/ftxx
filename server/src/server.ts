import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");

import {IndexRoute} from "./routes/index";
import {BooksRouter} from "./routes/books";
/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    // create expressjs application
    this.app = express();

    // configure application
    this.config();

    // add routes
    this.routes();

    // add api
    this.api();
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api(): any {
    // empty for now
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config(): any {
    // empty for now

  // add byside framework
  // add static paths
  this.app.use(express.static(path.join(__dirname, "public")));

  // configure pug
  this.app.set("views", path.join(__dirname, "views"));
  this.app.set("view engine", "pug");

  this.app.all("*",  function(req:express.Request, res:express.Response, next:express.NextFunction): void {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With");
      res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
      if (req.method === "OPTIONS") {
          res.send(200);
      } else {
          next();
      }
  });

  // use logger middlware
  this.app.use(logger("dev"));

  // use json form parser middlware
  this.app.use(bodyParser.json());

  // use query string parser middlware
  this.app.use(bodyParser.urlencoded({
    extended: true
  }));

  // use cookie parser middleware
  this.app.use(cookieParser("SECRET_GOES_HERE"));

  // use override middlware
  this.app.use(methodOverride());

  // catch 404 and forward to error handler
  this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction): void {
      err.status = 404;
      next(err);
  });

  // error handling
  this.app.use(errorHandler());
  }

  /**
   * Create router
   *
   * @class Server
   * @method api
   */
  public routes(): any {
    // empty for now

    let router: express.Router = express.Router();

    IndexRoute.create(router);

    this.app.use(router);
    this.app.use("/api/v1/books", BooksRouter.create());
  }
}