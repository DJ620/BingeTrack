const router = require("express").Router();
const episodeController = require("../../controllers/episodeController");

router.route("/watch")
    .post(episodeController.watchEpisode);

router.route("/unwatch")
    .post(episodeController.unwatchEpisode);

router.route("/watchSeason")
    .post(episodeController.watchSeason);

router.route("/unwatchSeason")
    .post(episodeController.unwatchSeason);

router.route("/addNew")
    .post(episodeController.addNewEpisodes);

module.exports = router;