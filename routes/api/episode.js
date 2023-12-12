const router = require("express").Router();
const episodeController = require("../../controllers/episodeController");

router.route("/add")
    .post(episodeController.addEpisode);

router.route("/:episodeId/:userId")
    .delete(episodeController.deleteEpisode);

module.exports = router;