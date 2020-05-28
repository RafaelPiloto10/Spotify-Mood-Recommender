import json
import matplotlib.pyplot as plt
import numpy as np

f = open('data/tracks.json')
data = json.load(f)
print(f'Loaded a total of {len(data)} songs')

danceability = []
energy = []
valence = []

for i in range(len(data)):
    danceability.append(data[i]["features"]["danceability"])
    energy.append(data[i]["features"]["energy"])
    valence.append(data[i]["features"]["valence"])

plt.style.use("fivethirtyeight")
fig, axs = plt.subplots(3)
fig.tight_layout(pad=3.0)
fig.suptitle('Song Analysis')

axs[0].set_title("Danceability")
axs[1].set_title("Energy")
axs[2].set_title("Valence")

axs[0].boxplot(danceability, vert=False)
axs[1].boxplot(energy, vert=False)
axs[2].boxplot(valence, vert=False)

plt.show()

f.close()
