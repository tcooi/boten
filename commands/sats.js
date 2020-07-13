const Discord = require('discord.js');
const puppeteer = require('puppeteer');

module.exports = {
    name: 'sats',
    aliases: ['sats'],
    description: 'sats',
    execute(message, args) {

        retrievePredicted()

        const retrievePredicted() {

            url = '';

            const browser = await puppeteer.launch({ executablePath: 'chromium-browser' });
            const page = await browser.newPage();

            page.evaluate(() => {
                let pred = document.querySelector('section.predicted-center-load');
            });

            let embed = new Discord.MessageEmbed()
                .setColor(0x42b0f4)
                .setTitle("available commands")
                .setDescription("description")
                .addField("/help", "todo")
                .addField("/sl", "todo")
                .addField("/weather", "todo")
            message.channel.send(embed);

        }

    }
}
