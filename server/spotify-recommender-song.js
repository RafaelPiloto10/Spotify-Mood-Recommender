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

let best_song_error = {
    name: "",
    danceability: 1,
    energy: 1,
    loudness: -60,
    valence: 1,
    dance_error: 1,
    energy_error: 1,
    valence_error: 1

}

let suggested_songs = {
    danceable: {
        name: "",
        danceability: 1,
        energy: 1,
        loudness: -60,
        valence: 1,
        dance_error: 1,
        energy_error: 1,
        loudness_error: 1,
        valence_error: 1,
    },
    energetic: {
        name: "",
        danceability: 1,
        energy: 1,
        loudness: -60,
        valence: 1,
        dance_error: 1,
        energy_error: 1,
        loudness_error: 1,
        valence_error: 1,
    },
    most_valent: {
        name: "",
        danceability: 1,
        energy: 1,
        loudness: -60,
        valence: 1,
        dance_error: 1,
        energy_error: 1,
        loudness_error: 1,
        valence_error: 1,
    }
};




/**
 * 
 * danceability: 0.0 -> 1.0 most danceable
 * energy: 0.0 -> 1.0 high intensity and activity
 * loudness: typically between -60 and 0 (0 being quiet)
 * valence: 0.0 -> 1.0 very positive track
 * tempo: no limit
 * 
 */


function getBestSongFromSong(tracks, target_song) {
    let bound_1 = Math.min(Math.floor(Math.random() * tracks.length) + 25, tracks.length);
    let bound_2 = Math.max(Math.floor(Math.random() * tracks.length), 0);

    let lower_bound = Math.min(bound_1, bound_2);
    let upper_bound = Math.max(bound_1, bound_2);

    if (bound_1 == bound_2) upper_bound += Math.min(Math.ceil(lower_bound) / 2, tracks.length);


    let songs = tracks.slice(lower_bound, upper_bound);

    console.log("-------------------- Configuring Best Song Search --------------------\n");
    console.log("Lower bound:", lower_bound, "Upper bound:", upper_bound, "\n");

    console.log("Target song:", target_song);
    console.log("\n");

    console.log("\n-------------------- Finding best song --------------------");

    for (const song of songs) {
        let {
            danceability,
            energy,
            loudness,
            valence,
            tempo,
        } = song.features;


        let name = song.name;
        if (name == target_song.song.name) continue;

        let artists = song.artists;

        let dance_error = Math.abs(danceability - target_song.song_features.danceability) / target_song.song_features.danceability;
        let energy_error = Math.abs(energy - target_song.song_features.energy) / target_song.song_features.energy;
        let loudness_error = Math.abs(loudness - target_song.song_features.loudness) / target_song.song_features.loudness;
        let valence_error = Math.abs(valence - target_song.song_features.valence) / target_song.song_features.valence;

        if (dance_error < best_song_error.dance_error && energy_error < best_song_error.energy_error && valence_error < best_song_error.valence_error) {
            best_song_error = {
                danceability,
                energy,
                loudness,
                valence,
                tempo,
                dance_error,
                energy_error,
                loudness_error,
                valence_error,
                name,
                artists: JSON.parse(artists)[0].name,
            }
        }

        if (dance_error <= suggested_songs.danceable.dance_error) {
            suggested_songs.danceable = {
                danceability,
                energy,
                loudness,
                valence,
                tempo,
                dance_error,
                energy_error,
                loudness_error,
                valence_error,
                name,
                artists: JSON.parse(artists),

            }
        }
        if (energy_error <= suggested_songs.energetic.energy_error) {
            suggested_songs.energetic = {
                danceability,
                energy,
                loudness,
                valence,
                tempo,
                dance_error,
                energy_error,
                loudness_error,
                valence_error,
                name,
                artists: JSON.parse(artists),

            }
        }
        if (valence_error <= suggested_songs.most_valent.valence_error) {
            suggested_songs.most_valent = {
                danceability,
                energy,
                loudness,
                valence,
                tempo,
                dance_error,
                energy_error,
                loudness_error,
                valence_error,
                name,
                artists: JSON.parse(artists),

            }
        }
    }

    console.log("Best song found:", best_song_error.name == '' ? "NONE" : best_song_error);
    console.log("\n\n");
    console.log("Suggested songs found:", suggested_songs);
    return {
        best: best_song_error,
        target_song,
        other_suggested_songs: suggested_songs,
        bounds: {
            lower_bound,
            upper_bound
        }
    }
}

module.exports = {
    getBestSongFromSong,
}