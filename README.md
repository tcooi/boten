# Boten

## Usage

Create new Discord application and get token  
https://discord.com/developers/applications

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
APPLICATION_ID=YOUR_DISCORD_APPLICATION_ID_HERE
HERE_API=YOUR_API_KEY_HERE
CITY=YOUR_CITY
SL_API=YOUR_SL_API_HERE
```

Deploy commands
```
node deploy-commands.js
```

Start bot
```
npm start
```

## Commands

-weather  
-SL