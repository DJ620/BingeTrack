const db = require("../models");

module.exports = {
  addShow: (req, res) => {
    db.ShowData.create(req.body.showData).then(({ _id }) =>
      db.EpisodeData.insertMany(req.body.episodesData).then((eps) => {
        const epIds = eps.map((ep) => ep._id);
        db.ShowData.findOneAndUpdate(
          { _id: _id },
          { $push: { episodes: { $each: epIds } } }
        )
          .then((epRes) => {
            db.User.findOneAndUpdate(
              { _id: req.body.userId },
              { $push: { showLibrary: _id } },
              { new: true }
            )
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
          .catch((err) => res.json(err));
      })
    );
  },

  getAllShows: (req, res) => {
    db.User.findOne({ _id: req.params.id })
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
  },

  deleteShow: (req, res) => {
    console.log(req.body);
    db.ShowData.deleteOne({ _id: req.body.showId })
      .then(() => {
        db.EpisodeData.deleteMany({ _id: { $in: req.body.episodeIds } })
          .then((epRes) => {
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
      })
      .catch((err) => {
        res.json(err);
      });
  },
};
