require('dotenv').config();
const { prefix } = require('./config.json');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const token = process.env.DISCORD_TOKEN;

console.log(`Loading ${commandFiles.length} commands`);

commandFiles.forEach((file, i) => {
  let command = require(`./commands/${file}`);
  console.log(`${i+1}. ${file}`);
  client.commands.set(command.name, command)
});

client.on('ready', async () => {
  console.log(`\n${client.user.tag} is online`);

  try {
    let link = await client.generateInvite(['ADMINISTRATOR']);
    console.log(`Use this link to invite the bot: ${link}`);
  } catch (error) {
    console.error(error);
  }
});

client.on('message', message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  let args = message.content.slice(prefix.length).split(' ');
  let commandName = args.shift().toLowerCase();

  let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command')
  }
});

client.login(token);
