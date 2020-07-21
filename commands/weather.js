require('dotenv').config();
const fetch = require('node-fetch');
const moment = require('moment');
const Discord = require('discord.js');

const HERE_KEY = process.env.HERE_KEY;

module.exports = {
  name: 'weather',
  aliases: ['w'],
  description: 'weather',
  async execute(message, args) {
    const createNowEmbed = (temperature, comfort, description, city, country) => {
      const embed = new Discord.MessageEmbed()
        .setTitle('Weather - Now')
        .addFields(
          { name: 'Temperature:', value: `${temperature} °C`, inline: true},
          { name: 'Feels like:', value: `${comfort} °C`, inline: true},
          { name: 'Description:', value: `${description}`, inline: true}
        )
        .setFooter(`${city}, ${country}`);
        return embed;
    }

    const createDayEmbed = (currentWeekday, morningTemperature, dayTemperature, eveningTemperature, nightTemperature, description, state, city) => {
      const embed = new Discord.MessageEmbed()
        .setTitle(`Weather - ${currentWeekday}`)
        .addFields(
          { name: 'Morning:', value: `${morningTemperature}`, inline: true },
          { name: 'Afternoon:', value: `${dayTemperature}`, inline: true },
          { name: 'Evening:', value: `${eveningTemperature}`, inline: true },
          { name: 'Description:', value: `${description}`, inline: false }
        )
        .setFooter(`${state}, ${city}`);
      return embed;
    }

    //check for input
    if (args.length === 0) {
      message.reply('please enter city');
      return;
    }

    let weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let options = ['today', 't', 'tomorrow', 'tm']

    //weather now
    if (!options.includes(args[args.length - 1].toLowerCase()) && !weekdays.includes(args[args.length - 1].toLowerCase())) {
      let cityInput = '';
      args.forEach(word => {
        cityInput += word + ' ';
      })
      
      try {
        let weatherData = await fetch(`https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=${HERE_KEY}&product=observation&name=${cityInput}`);
        let weatherJson = await weatherData.json();
        let temperature = parseFloat(weatherJson.observations.location[0].observation[0].temperature).toFixed(1);
        let comfort = parseFloat(weatherJson.observations.location[0].observation[0].comfort).toFixed(1);
        let description = weatherJson.observations.location[0].observation[0].description;
        let city = weatherJson.observations.location[0].observation[0].city;
        let country = weatherJson.observations.location[0].observation[0].country;

        console.log('command weather now');
        message.channel.send(createNowEmbed(temperature, comfort, description, city, country));
      } catch (error) {
        console.error(error);
        message.channel.send(error.message);
      }
    //weather day
    } else if (args.length > 1) {
      let cityInput = '';
      let city = args.splice(0, args.length - 1)
      city.forEach(word => {
        cityInput += word + ' ';
      })

      let currentWeekday = args[args.length - 1].charAt(0).toUpperCase() + args[args.length -1].slice(1);

      let day = args.pop();
      if (day.toLowerCase() === 'today' || day.toLowerCase() === 't') {
        currentWeekday = moment().format('dddd');
      } else if (day.toLowerCase() === 'tomorrow' || day.toLowerCase() === 'tm') {
        currentWeekday = moment().add(1, 'days').format('dddd');
      }

      try {
        let weatherData = await fetch(`https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=${HERE_KEY}&product=forecast_7days&name=${cityInput}`);
        let weatherJson = await weatherData.json();
        let city = weatherJson.forecasts.forecastLocation.city;
        let country = weatherJson.forecasts.forecastLocation.country;
        let week = weatherJson.forecasts.forecastLocation.forecast;
        let day = week.filter((day) => day.weekday === currentWeekday);

        day.forEach( x => {
          x.temperature = parseFloat(x.temperature).toFixed(1);
        });

        //fill empty space with null
        if (day.length != 4 && currentWeekday === moment().format('dddd')) {
          do {
            day.unshift(null)
          } while (day.length < 4);
        }

        let morningTemperature = day[0] ? `${day[0].temperature} °C` : 'no data';
        let dayTemperature = day[1] ? `${day[1].temperature} °C` : 'no data';
        let eveningTemperature = day[2] ? `${day[2].temperature} °C` : 'no data';
        let nightTemperature = day[3] ? `${day[3].temperature} °C` : 'no data';
        let description = day[1] ? day[1].description : 'no data';

        console.log('command weather dayview');
        message.channel.send(createDayEmbed(currentWeekday, morningTemperature, dayTemperature, eveningTemperature, nightTemperature, description, city, country));
      } catch (error) {
        console.error(error);
        message.channel.send(error.message);
      }
    } else {
      console.log('non');
    }
  }
}
