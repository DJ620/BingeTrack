const path = require("path");
const router = require("express").Router();
const userRoutes = require("./user");
const showRoutes = require("./show");
const episodeRoutes = require("./episode");

router.use("/user", userRoutes);
router.use("/show", showRoutes);
router.use("/episode", episodeRoutes);

router.use(function(req, res) {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
  });

  module.exports = router;