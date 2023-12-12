const db = require("../models");

module.exports = {
  addShow: (req, res) => {
    db.ShowData.create(req.body.showData)
      .then(({ _id }) =>
        db.User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { showLibrary: _id } },
          { new: true }
        ).populate({
          path: "showLibrary",
          populate: {
            path: "watchedEpisodes",
          },
        })
      )
      .then((dbUser) => {
        res.json(dbUser);
      })
      .catch((err) => {
        res.json(err);
      });
  },

  getAllShows: (req, res) => {
    db.User.findOne({ _id: req.params.id })
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
  },

  deleteShow: (req, res) => {
    db.ShowData.deleteOne({ _id: req.params.showId })
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
