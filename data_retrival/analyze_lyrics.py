from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk import tokenize
import json
import sys
import time

# Read the file and convert it into a json object
f = open("data/lyrics.json")
lyrics = json.load(f)

f2 = open('data/tracks.json')
songs = json.load(f2)

def get_song_features(song_title):
    for song in songs:
        if song['name'] == song_title:
            return song
    return -1


# Create the Senitment Analysis Analyzer using the Vader lexicon table
sid = SentimentIntensityAnalyzer()
# Iterate over each song lyric and calculate the polarity scores
analyzed_songs = [] # Store the analyzed songs in a list
progress = 0
loading_bar = ['/', '-', '\\', '|']
successful_songs = 0

for lyric in lyrics:
    progress += 1
    song_features = get_song_features(lyric['song-title'])
    if song_features != -1:
        sentences = tokenize.sent_tokenize(lyric['lyrics'])
        if len(sentences) > 0:
            successful_songs += 1
            mean_compound = sum([sid.polarity_scores(i)['compound'] for i in sentences])/len(sentences)
            analyzed_songs.append({'song-title': lyric['song-title'], 'song-artists': lyric['artists'], 'song-lyrics': lyric['lyrics'], 'song-features': song_features, 'song-polarity': mean_compound})
    time.sleep(0.01)
    sys.stdout.write(f"Processing {progress}/{len(lyrics)} songs {loading_bar[progress % 4]}\r")
    sys.stdout.flush()

analyzed_songs_file = open('data/analyzed-songs.json', 'w')
json.dump(analyzed_songs, analyzed_songs_file)

# Last run resulted in: 1397 / 1417 songs processed

print(f"Successfully processed {successful_songs}/{progress} songs")
