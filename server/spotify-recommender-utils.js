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

const Spotify = require('node-spotify-api');
const playlist_id = process.env.SPOTIFYPLAYLIST;

let spotify = new Spotify({
    id: process.env.SpotifyClientID,
    secret: process.env.SpotifyClientSecret
});

function get100SongFeatures(tracks) {
    return new Promise(resolve => {
        let song_ids = "";

        for (const song of tracks) {
            song_ids += song.track.id + ",";
        }
        song_ids = song_ids.slice(0, (song_ids.length - 1));

        spotify.request(`https://api.spotify.com/v1/audio-features/?ids=${song_ids}`).then(features => {
            resolve(features);
        }).catch(err => {
            console.log("Error in getting song features:" + err);
        });
    });
}

async function getSongs(playlist_id) {
    let songs = [];
    let song_features = [];

    let complete_songs = [];

    console.log("Getting songs..");

    let tracks = await spotify.request(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`);
    let track_features = await get100SongFeatures(tracks.items);

    songs = songs.concat(tracks.items);
    song_features = song_features.concat(track_features.audio_features);

    while (tracks.next) {
        console.log("Found more songs.. adding to list.. current count:", songs.length);
        tracks = await spotify.request(tracks.next);
        track_features = await get100SongFeatures(tracks.items);

        songs = songs.concat(tracks.items);
        song_features = song_features.concat(track_features.audio_features);
    }

    for (let i = 0; i < songs.length; i++) {
        const track = songs[i];

        complete_songs.push({
            "artists": JSON.stringify(track.track.artists),
            "name": track.track.name,
            "url": track.track.href,
            "id": track.track.id,
            "features": song_features[i]
        });
    }
    console.log("------------ Finished Gathering Songs -----------");
    return complete_songs;
}

function get100SongFeatures(tracks) {
    return new Promise(resolve => {
        let song_ids = "";

        for (const song of tracks) {
            song_ids += song.track.id + ",";
        }
        song_ids = song_ids.slice(0, (song_ids.length - 1));

        spotify.request(`https://api.spotify.com/v1/audio-features/?ids=${song_ids}`).then(features => {
            resolve(features);
        }).catch(err => {
            console.log("Error in getting song features:" + err);
        });
    });
}

async function getTracks() {
    return new Promise(async resolve => {
        let tracks = await getSongs(playlist_id);
        console.log("Total songs received:", tracks.length);
        resolve(tracks);
    });
}

function getSong(name) {
    return new Promise(async resolve => {
        let song = await spotify.request(`https://api.spotify.com/v1/search?q=${name.split(" ").join("+")}&type=track`).catch(err => console.error(err));
        console.log(song.tracks.items[0].id);
        let song_features = await getSongFeature(song.tracks.items[0].id);
        resolve({
            song_features,
            song: {
                name: song.tracks.items[0].name,
                id: song.tracks.items[0].id,
                artists: song.tracks.items[0].artists,
                popularity: song.tracks.items[0].popularity
            }
        });
    });
}

function getSongFeature(songID) {
    return new Promise(resolve => {
        spotify.request(`https://api.spotify.com/v1/audio-features/${songID}`).then(features => {
            let {
                danceability,
                energy,
                valence,
                tempo,
                loudness,
                instrumentalness,
                speechiness,
                acousticness,
                liveness,
                mode,
                key
            } = features
            resolve({
                danceability,
                energy,
                valence,
                tempo,
                loudness,
                instrumentalness,
                speechiness,
                acousticness,
                liveness,
                mode,
                key
            });
        }).catch(err => {
            console.error("Error in getting song features:" + err);
        });
    });
}

module.exports = {
    getTracks,
    getSong,
}