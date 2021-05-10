import express from "express"
const router = express.Router()

/* GET home page. */
router.get(
	"/",
	function(
		_req: express.Request,
		res: express.Response,
		_next: express.NextFunction,
	) {
		res.render("index", {title: "Express"});
	},
);

export default router;
