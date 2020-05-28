require('dotenv').config();
const https = require('https');

const CLIENT_ID = process.env.GeniusClientID;
const CLIENT_SECRET = process.env.GeniusClientSecret;
const CLIENT_ACCESS_TOKEN = process.env.GeniusAccessToken;

https.get()
