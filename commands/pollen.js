const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: 'pollen',
  aliases: ['p'],
  description: 'pollen',
  async execute(message, args) {

    const pollenEmbed = (area, pollenForecast, pollenLevel, fetchTime) => {
      const embed = new Discord.MessageEmbed()
        .setTitle(`Pollen forecast`)
        .addFields(
          { name: `${area}`, value: `${pollenForecast}`, inline: true },
          { name: `Levels:`, value: `${pollenLevel}`, inline: true }
        )
        .setFooter(`Last update: ${fetchTime}`);
      return embed;
    }

    function levelsMeter(level) {
      let meter = ''
      switch (level) {
        case '0':
          meter = '⦾⦾⦾⦾⦾⦾⦾';
          break;
        case '1':
          meter = '⦿⦾⦾⦾⦾⦾⦾';
          break;
        case '2':
          meter = '⦿⦿⦾⦾⦾⦾⦾';
          break;
        case '3':
          meter = '⦿⦿⦿⦾⦾⦾⦾';
          break;
        case '4':
          meter = '⦿⦿⦿⦿⦾⦾⦾';
          break;
        case '5':
          meter = '⦿⦿⦿⦿⦿⦾⦾';
          break;
        case '6':
          meter = '⦿⦿⦿⦿⦿⦿⦾';
          break;
        case '7':
          meter = '⦿⦿⦿⦿⦿⦿⦿';
          break;
      }
      return meter;
    }

    if (args.length === 0) {
      message.reply('please enter area');
      return;
    }

    if (args[0].toLowerCase() === 'list') {
      message.reply('Stockholm');
      return;
    }

    const POLLEN_API = process.env.POLLEN_API;

    if (args.length > 0) {
      try {
        const areaInput = args[0];
        let pollen = await fetch(`${POLLEN_API}${areaInput}`);
        let pollenJSON = await pollen.json();
        console.log(pollenJSON);

        const area = `${pollenJSON.area}:`;
        const fetchTime = pollenJSON.fetchTime;

        let pollenForecast = '';
        let pollenLevel = '';

        pollenJSON.forecasts.forEach(forecastObj => {
          pollenForecast += `${forecastObj.type}: ${forecastObj.forecast}\n`
          pollenLevel += `${levelsMeter(forecastObj.level)}\n`;
        });

        message.channel.send(pollenEmbed(area, pollenForecast, pollenLevel, fetchTime));
      } catch (error) {
        console.error(error);
        message.channel.send(error.message);
      }
    }
  }
}
