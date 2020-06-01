const Discord = require('discord.js');

module.exports = {
  name: 'help',
  aliases: ['h'],
  description: 'help',
  execute(message, args) {
    let embed = new Discord.MessageEmbed()
      .setColor(0x42b0f4)
      .setTitle("available commands")
      .setDescription("description")
      .addField("/help", "todo")
      .addField("/transit", "todo")
      .addField("/weather", "todo")
    message.channel.send(embed);
  }
}
