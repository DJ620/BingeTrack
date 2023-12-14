const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

const EpisodeSchema = new Schema({
    episodeId: Number,
    season: Number,
    number: Number,
    name: String,
    airTime: Date,
    watched: Boolean
});

const EpisodeData = mongoose.model("EpisodeData", EpisodeSchema);

module.exports = EpisodeData;