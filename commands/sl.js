// const fetch = require('node-fetch');

// module.exports = {
//   name: 'sl',
//   aliases: ['sl'],
//   description: 'sl',
//   async execute(message, args) {

//     if (args.length === 0) {
//       message.reply('please enter station');
//       return;
//     }

//     async function getSiteId(site) {
//       let siteIdData = await fetch(`https://api.sl.se/api2/typeahead.json?key=${api.sl_plats}&searchstring=${site}&stationsonly=True&maxresults=1`);
//       let siteIdJson = await siteIdData.json();
//       return siteIdJson;
//     }

//     async function getDepartures(siteId) {
//       let departuresData = await fetch(`https://api.sl.se/api2/realtimedeparturesV4.json?key=${api.sl_realtid}&siteid=${siteId}&timewindow=60`);
//       let departuresJson = await departuresData.json();
//       return departuresJson;
//     }

//     if (!args.includes('-')) {
//       let site = args[0];
//       let siteIdJson = await getSiteId(site);
//       let siteId = siteIdJson.ResponseData[0].SiteId;
//       console.log(siteId);
//       let departuresJson = await getDepartures(siteId);
//       let test = departuresJson.ResponseData.DataAge;
//       console.log(departuresJson);
//       message.channel.send(test);
//     }
//   }
// }

require('dotenv').config();
const fetch = require('node-fetch');
const moment = require('moment');
const { EmbedBuilder } = require('discord.js');

const HERE_KEY = process.env.HERE_KEY;
const CITY = process.env.CITY;

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sl')
    .setDescription('SL transit information')
    .addStringOption(option => 
      option.setName('departures')
        .setDescription('departure timetable')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('trip')
        .setDescription('from and to')
        .setRequired(false)),
  async execute(interaction) {

  }
}