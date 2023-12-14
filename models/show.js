const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShowSchema = new Schema({
    showId: Number,
    name: String,
    image: String,
    numOfEpisodes: Number,
    episodes: [
        {
            type: Schema.Types.ObjectId,
            ref: "EpisodeData"
        }
    ]
});

const ShowData = mongoose.model("ShowData", ShowSchema);

module.exports = ShowData;