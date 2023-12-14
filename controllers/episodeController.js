const db = require("../models");

module.exports = {
  watchEpisode: (req, res) => {
    db.EpisodeData.findOneAndUpdate(
      { _id: req.body.episodeId },
      { watched: true },
      { returnOriginal: false }
    )
      .then((ep) => {
        db.User.findOne({ _id: req.body.userId })
          .populate({
            path: "showLibrary",
            populate: {
              path: "episodes",
            },
          })
          .then((dbUser) => {
            res.json(dbUser);
          })
          .catch((err) => {
            res.json(err);
          });
      })
      .catch((err) => {
        res.json(err);
      });
  },

  unwatchEpisode: (req, res) => {
    db.EpisodeData.findOneAndUpdate(
      { _id: req.body.episodeId },
      { watched: false },
      { returnOriginal: false }
    )
      .then((ep) => {
        db.User.findOne({ _id: req.body.userId })
          .populate({
            path: "showLibrary",
            populate: {
              path: "episodes",
            },
          })
          .then((dbUser) => {
            res.json(dbUser);
          })
          .catch((err) => {
            res.json(err);
          });
      })
      .catch((err) => {
        res.json(err);
      });
  },

  watchSeason: (req, res) => {
    db.EpisodeData.updateMany(
      { _id: { $in: req.body.episodeIds } },
      { $set: { watched: true } }
    )
      .then((ep) => {
        db.User.findOne({ _id: req.body.userId })
          .populate({
            path: "showLibrary",
            populate: {
              path: "episodes",
            },
          })
          .then((dbUser) => {
            res.json(dbUser);
          })
          .catch((err) => {
            res.json(err);
          });
      })
      .catch((err) => {
        res.json(err);
      });
  },

  unwatchSeason: (req, res) => {
    db.EpisodeData.updateMany(
      { _id: { $in: req.body.episodeIds } },
      { $set: { watched: false } }
    )
      .then((ep) => {
        db.User.findOne({ _id: req.body.userId })
          .populate({
            path: "showLibrary",
            populate: {
              path: "episodes",
            },
          })
          .then((dbUser) => {
            res.json(dbUser);
          })
          .catch((err) => {
            res.json(err);
          });
      })
      .catch((err) => {
        res.json(err);
      });
  },
};
