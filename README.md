# Boten

## Usage

Create new Discord application and get token  
https://discordapp.com/developers/applications

Get a Here Destination Weather API key  
https://developer.here.com/projects

Get transit data API key from Trafiklab  
https://www.trafiklab.se/

Fix dependencies
```
npm install
```

Setup .env file
```
DISCORD_TOKEN=YOUR_DISCORD_TOKEN_HERE
API_HERE=YOUR_API_KEY_HERE
POLLEN_URL=
```

Start bot
```
npm start
```

## Commands

-help  
-pollen  
-weather  

## TODO
-command for SATS, show opening hours and show predicted graph  
-add option to set default value for input  
-command for SL, search departure and trip  
-add dynamic icons for weather  
-help command