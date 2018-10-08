import * as express from "express";
let router: express.Router = express.Router();
/* GET home page. */
router.get("/", function(req:express.Request, res: express.Response, next: express.NextFunction): void {
  res.render("index", { title: "Express" });
});

export default router;