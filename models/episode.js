const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EpisodeSchema = new Schema({
    episodeId: Number,
    season: Number,
    number: Number,
    name: String
});

const EpisodeData = mongoose.model("EpisodeData", EpisodeSchema);

module.exports = EpisodeData;