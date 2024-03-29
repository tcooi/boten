require('dotenv').config();
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

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found`);
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error trying to execute this command', ephemeral: true });
  }
});

client.login(token);