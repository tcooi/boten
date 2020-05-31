const { api } = require('../config.json');
const fetch = require('node-fetch');
const moment = require('moment');
const Discord = require('discord.js');

module.exports = {
  name: 'weather',
  aliases: ['w'],
  description: 'weather',
  async execute(message, args) {
    const createNowEmbed = (temperature, comfort, description, city, country) => {
      const embed = new Discord.MessageEmbed()
        .setTitle('Now')
        .addFields(
          { name: 'Temperature:', value: `${temperature} °C`, inline: true},
          { name: 'Feels like:', value: `${comfort} °C`, inline: true},
          { name: 'Description:', value: `${description}`, inline: true}
        )
        .setFooter(`${city}, ${country}`);
        return embed;
    }

    const createDayEmbed = (weekday, morningTemperature, dayTemperature, eveningTemperature, nightTemperature, description, state, city) => {
      const embed = new Discord.MessageEmbed()
        .setTitle(`${weekday}`)
        .addFields(
          { name: 'Morning:', value: `${morningTemperature}`, inline: true },
          { name: 'Afternoon:', value: `${dayTemperature}`, inline: true },
          { name: 'Evening:', value: `${eveningTemperature}`, inline: true },
          { name: 'Description:', value: `${description}`, inline: false }
        )
        .setFooter(`${state}, ${city}`);
      return embed;
    }

    const createWeekEmbed = (locationName) => {
      const embed = new Discord.MessageEmbed()
        .setTitle('test')
        .addFields(
          { name: 'feels like', value: 'test', inline: true },
          { name: 'low high', value: 'test', inline: true },
          { name: 'description', value: 'test', inline: true }
        )
        .setFooter(`${locationName}`);
      return embed;
    }

    if (args.length === 0) {
      message.reply('please input city');
      return;
    }

    let cityInput = args[0];

    if (args.length === 1) {
      try {
        let weatherData = await fetch(`https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=${api.here}&product=observation&name=${cityInput}`);
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
      }
    } else if (args.includes('"')) {
      console.log("long name");
      console.log(args);
  
    } else if (args.length === 2 && (args.includes('today') || args.includes('t'))) {
      let currentWeekday = moment().format('dddd');
      let weatherData = await fetch(`https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=${api.here}&product=forecast_7days&name=${cityInput}`);
      let weatherJson = await weatherData.json();
      let city = weatherJson.forecasts.forecastLocation.city;
      let country = weatherJson.forecasts.forecastLocation.country;
      let week = weatherJson.forecasts.forecastLocation.forecast;
      let day = week.filter((day) => day.weekday === currentWeekday);

      day.forEach( x => {
        x.temperature = parseFloat(x.temperature).toFixed(1)
      });

      do {
        day.unshift(null)
      } while (day.length < 4);

      let morningTemperature = day[0] ? `${day[0].temperature} °C` : 'no data';
      let dayTemperature = day[1] ? `${day[1].temperature} °C` : 'no data';
      let eveningTemperature = day[2] ? `${day[2].temperature} °C` : 'no data';
      let nightTemperature = day[3] ? `${day[3].temperature} °C` : 'no data';
      let description = day[1] ? day[1].description : 'no data';

      console.log('command weather today');
      message.channel.send(createDayEmbed(currentWeekday, morningTemperature, dayTemperature, eveningTemperature, nightTemperature, description, city, country));
    } else if (args.length === 2 && (args.includes('tomorrow') || args.includes('tm'))) {
      let currentWeekday = moment().add(1, 'days').format('dddd');
      let weatherData = await fetch(`https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=${api.here}&product=forecast_7days&name=${cityInput}`);
      let weatherJson = await weatherData.json();
      let city = weatherJson.forecasts.forecastLocation.city;
      let country = weatherJson.forecasts.forecastLocation.country;
      let week = weatherJson.forecasts.forecastLocation.forecast;
      let day = week.filter((day) => day.weekday === currentWeekday);

      day.forEach( x => {
        x.temperature = parseFloat(x.temperature).toFixed(1)
        console.log(x.temperature)
      });

      if (day.length != 4) {
        do {
          day.unshift(null)
        } while (day.length < 4);
      }

      let morningTemperature = day[0] ? `${day[0].temperature} °C` : 'no data';
      let dayTemperature = day[1] ? `${day[1].temperature} °C` : 'no data';
      let eveningTemperature = day[2] ? `${day[2].temperature} °C` : 'no data';
      let nightTemperature = day[3] ? `${day[3].temperature} °C` : 'no data';
      let description = day[1] ? day[1].description : 'no data';

      console.log('command weather tomorrow');
      message.channel.send(createDayEmbed(currentWeekday, morningTemperature, dayTemperature, eveningTemperature, nightTemperature, description, city, country));
    } else if (args.length === 2 && (args.includes(moment().format('dddd')))) {
      console.log('week');
    } else {
      console.log(moment().format('dddd'));
    }
  }
}
