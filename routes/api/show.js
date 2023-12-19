const router = require("express").Router();
const showController = require("../../controllers/showController");

router.route("/add")
    .post(showController.addShow);

router.route("/:id")
    .get(showController.getAllShows);

router.route("/delete")
    .post(showController.deleteShow);

router.route("/update")
    .post(showController.updateShow);

module.exports = router;