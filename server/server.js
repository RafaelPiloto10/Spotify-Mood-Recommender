/**
 MIT License

 Copyright(c) 2019 Rafael Piloto

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files(the "Software"), to deal in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const limiter = require('express-rate-limit');

const {
    getTracks,
    getSong
} = require('./spotify-recommender-utils');

const {
    getSentiment,
    findBestSong,
} = require('./spotify-recommender-sentiment');

const {
    getBestSongFromSong
} = require('./spotify-recommender-song');

const app = express();
const port = process.env.PORT || 3000;

let cached_songs = [];

app.set('trust proxy', 1);

const route = app.listen(port, async () => {
    console.log("Server is up and running on port " + port);
    cached_songs = await getTracks();
});

const limit = limiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(cors());
app.use(express.json());
app.use(bodyparser.json());


app.use(authenticateMiddleware);
app.use("/api/v1/sentiment", limit);
app.use("/api/v1/song-title", limit);

app.get("/", (req, res, next) => {
    res.status(200).json({
        "message": "Visit https://github.com/RafaelPiloto10/Spotify-Mood-Recommender"
    });
});

app.get("/api/v1/sentiment", async (req, res, next) => {
    if (!req.query.sentence) { // Does the sentence key exist?
        console.error("Sentence missing from request!");
        res.status(400).json({
            "ErrorCode": "invalid_request",
            "Error": "The request is missing a required parameter : sentence"
        });
    } else { // We have performed all authentication & ready to provide the services
        console.log("Processing request with sentence:", req.query.sentence);
        let sentiment = await getSentiment(req.query.sentence);
        let best_songs = findBestSong(cached_songs, sentiment);
        res.status(200).json(best_songs);
    }

});

app.get("/api/v1/song-title", async (req, res, next) => {
    if (!req.query.song) { // Does the sentence key exist?
        console.error("Song title missing from request!");
        res.status(400).json({
            "ErrorCode": "invalid_request",
            "Error": "The request is missing a required parameter : song"
        });
    } else { // We have performed all authentication & ready to provide the services
        console.log("Processing request with song title:", req.query.song, "excluding:", req.query.exclude);
        let song = await getSong(req.query.song);
        let best_songs = await getBestSongFromSong(cached_songs, song, req.query.exclude ? req.query.exclude.split(",") : undefined);
        res.status(200).json(best_songs);
    }

});

function authenticateMiddleware(req, res, next) {
    if (!req.query.auth) { // Does the auth key exist?
        console.error("Auth missing from request!");
        res.status(400).json({
            "ErrorCode": "invalid_request",
            "Error": "The request is missing a required parameter : auth"
        });
    } else if (req.query.auth != process.env.AUTH_TOKEN) { // Is the auth key valid?
        console.error("Auth not valid in request!");
        res.status(400).json({
            "ErrorCode": "invalid_request",
            "Error": "Invalid Authorization Code"
        });
    } else {
        if (cached_songs.length == 0) {
            res.status(503).json({
                "ErrorCode": "Service Unavailable",
                "Error": "Cached songs list not yet built"
            });
        } else {
            next();
        }
    }

}

setInterval(async () => {
    cached_songs = await getTracks();
}, 1000 * 60 * 60 * 2);