from dotenv import load_dotenv
import os
import json
import sys
import time
import requests

load_dotenv(verbose=True)

f = open('data/tracks.json')
songs = json.load(f)

MUSIX_API_KEY=os.getenv('MusixAPIKey')
URL = 'https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?'
FORMAT = "format=json"
total_count = 0
loading_bar = ['/', '-', '\\', '|']
all_lyrics = []
lyrics = open("lyrics.json", 'w')

successful_total = 0
error_total = 0

for i in range(len(songs)):
    song_artists = json.loads(songs[i]["artists"])
    title = songs[i]["name"]
    artists = "%20".join([song_artists[j]["name"] for j in range(len(song_artists))])
    total_count += 1
    query = f"{URL + FORMAT}&q_track={title}&q_artist={artists}&apikey={MUSIX_API_KEY}"
    results = requests.get(query)
    
    if results.json()["message"]["header"]["status_code"] == 200:
        song_data = {"song-title" : title, "artists" : artists, "lyrics" : results.json()["message"]["body"]["lyrics"]["lyrics_body"]}
        all_lyrics.append(song_data)
        successful_total += 1
    else :
        error_total += 1

    sys.stdout.write("Got lyrics for " + str(total_count) + "/" + str(len(songs)) + " " + loading_bar[i % 4] + "\r")
    time.sleep(0.01)
    sys.stdout.flush()

print("writing lyrics to file..")
json.dump(all_lyrics, lyrics)
print(f"Done. Wrote {successful_total} songs - could not find lyrics for {error_total} songs")
