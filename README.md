# Spotify Song Recommender

This is a Spotify Song Recommender API that recommends a song from a spotify playlist based on "mood" given from a sentence.
Sentiment analysis is performed on the sentence, which then produces a target song matched against a variety of different songs.

## How to use

### If you are not an authorized user

* Clone the repo and install dependencies with `npm install`
* Fill in the `.env` folder with your own information and details
  * `SpotifyClientID` - Obtained from the Spotify API Dashboard (free)
  * `SpotifyClientSecret` - Obtained from the Spotify API Dashboard (free)
  * `AUTH_TOKEN` - Your own authentication token - included for my private deployed API
  * `SPOTIFYPLAYLIST` - The playlist you want the service to pull from. Can be found on spotify by getting the URI of a playlist
* visit `/api/v1/recommender`
  * include `auth` which is the `AUTH_TOKEN`
  * include `sentence` which is the sentence the "mood" will be pulled from

### If you are an authorized user

* Visit [my deployed version](https://spotify-mood.herokuapp.com/)
