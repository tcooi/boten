const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: 'pollen',
  aliases: ['p'],
  description: 'pollen',
  async execute(message, args) {

    const pollenEmbed = (area, pollenData, fetchTime) => {
      const embed = new Discord.MessageEmbed()
        .setTitle(`Pollen forecast`)
        .addFields(
          { name: `${area}`, value: `${pollenData}`, inline: true }
        )
        .setFooter(`Last update: ${fetchTime}`);
      return embed;
    }

    if (args.length === 0) {
      message.reply('please enter area');
      return;
    }

    if (args[0].toLowerCase() === 'list') {
      message.reply('Stockholm');
      return;
    }

    if (args.length > 0) {
      try {
        let pollen = await fetch('http://192.168.1.29:3000/pollen/Stockholm');
        let pollenJSON = await pollen.json();
        console.log(pollenJSON);
        message.channel.send(pollenEmbed('stockh', 'asasasa', '34234'));
      } catch (error) {

      }
    }
  }
}
