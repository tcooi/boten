require('dotenv').config();
const { prefix } = require('./config.json');
const fs = require('fs');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds]});
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const token = process.env.DISCORD_TOKEN;

console.log(`Loading ${commandFiles.length} commands`);

commandFiles.forEach((file, i) => {
  let command = require(`./commands/${file}`);
  console.log(`${i+1}. ${file}`);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command)
  } else {
    console.log(`command ${file} is missing data or execute`);
  }
});

client.once(Events.ClientReady, c => {
  console.log(`\n${c.user.tag} is online`);

  // try {
  //   let link = client.generateInvite({
  //     permissions: [
  //       PermissionFlagsBits.SendMessages,
  //       PermissionFlagsBits.ManageGuild,
  //       PermissionFlagsBits.MentionEveryone
  //     ],
  //     scopes: [OAuth2Scopes.Bot],
  //   });
  //   console.log(`Use this link to invite the bot: ${link}`);
  // } catch (error) {
  //   console.error(error);
  // }
});

client.on(Events.InteractionCreate, interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  // let args = message.content.slice(prefix.length).split(' ');
  // let commandName = args.shift().toLowerCase();

  // let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  // if (!command) return;

  // try {
  //   command.execute(message, args);
  // } catch (error) {
  //   console.error(error);
  //   message.reply('There was an error trying to execute that command')
  // }
});

client.login(token);