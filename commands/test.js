const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('replies pong'),
    async execute(interaction) {
        await interaction.reply('pong');
    }
};