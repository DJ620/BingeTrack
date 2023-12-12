const db = require("../models");

module.exports = {
  addEpisode: (req, res) => {
    db.EpisodeData.create(req.body.episodeData)
      .then(({ _id }) =>
        db.ShowData.findOneAndUpdate(
          { _id: req.body.showId },
          { $push: { watchedEpisodes: _id } },
          { new: true }
        )
      )
      .then(() => {
        db.User.findOne({ _id: req.body.userId })
          .populate({
            path: "showLibrary",
            populate: {
              path: "watchedEpisodes",
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

  deleteEpisode: (req, res) => {
    db.EpisodeData.deleteOne({ _id: req.params.episodeId })
      .then(() => {
        db.User.findOne({ _id: req.params.userId })
          .populate({
            path: "showLibrary",
            populate: {
              path: "watchedEpisodes",
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
