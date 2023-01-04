require('dotenv').config();
const fetch = require('node-fetch');
const moment = require('moment');
const { EmbedBuilder } = require('discord.js');

const HERE_KEY = process.env.HERE_KEY;
const CITY = process.env.CITY;

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Show current weather')
    .addStringOption(option => 
      option.setName('day')
        .setDescription('Show weather for specific day')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('city')
        .setDescription('Choose which city to show weather from')
        .setRequired(false)),
  async execute(interaction) {

    //weather now embed
    const createNowEmbed = (temperature, comfort, precipitation, precipitationDecription, description, city, country) => {
      const embed = new EmbedBuilder()
        .setTitle('Weather - Now')
        .addFields(
          { name: 'Temperature:', value: `${temperature} °C / feels like ${comfort} °C`, inline: true },
          { name: 'Precipitation:', value: `${precipitation} ${precipitationDecription}`, inline: true },
          // cm over the next few hours.
          { name: 'Description:', value: `${description}`, inline: true }
        )
        .setFooter({ text: `${city}, ${country}` });
      return embed;
    }

    //weather day embed
    const createDayEmbed = (currentWeekday, morning, afternoon, evening, state, city) => {
      const embed = new Discord.MessageEmbed()
        .setTitle(`Weather - ${currentWeekday}`)
        .addFields(
          { name: 'Morning:', value: `${morning}`, inline: true },
          { name: 'Afternoon:', value: `${afternoon}`, inline: true },
          { name: 'Evening:', value: `${evening}`, inline: true }
        )
        .setFooter({ text: `${state}, ${city}` });
      return embed;
    }

    let optionDay = interaction.options.getString('day');
    const optionCity = interaction.options.getString('city') ?? CITY;

    //show current weather
    if (optionDay === null) {
      try {
        const weatherData = await fetch(`https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=${HERE_KEY}&product=observation&name=${optionCity}`);
        const weatherJson = await weatherData.json();
        const temperature = parseFloat(weatherJson.observations.location[0].observation[0].temperature).toFixed(1);
        const comfort = parseFloat(weatherJson.observations.location[0].observation[0].comfort).toFixed(1);
        const precipitation3H = (weatherJson.observations.location[0].observation[0].precipitation3H === '*' ? '0' : parseFloat(weatherJson.observations.location[0].observation[0].precipitation3H).toFixed(2));
        const rainFall = weatherJson.observations.location[0].observation[0].rainFall === '*' ? '0' : weatherJson.observations.location[0].observation[0].rainFall;
        const snowFall = weatherJson.observations.location[0].observation[0].snowFall === '*' ? '0' : weatherJson.observations.location[0].observation[0].snowFall;
        const description = weatherJson.observations.location[0].observation[0].description;
        const city = weatherJson.observations.location[0].observation[0].city;
        const country = weatherJson.observations.location[0].observation[0].country;

        const precipitation = rainFall >= snowFall ? rainFall : snowFall;
        const precipitationDecription = rainFall >= snowFall ? 'cm rain.' : 'cm snow.';

        console.log('command: weather now');
        await interaction.reply({ embeds: [createNowEmbed(temperature, comfort, precipitation, precipitationDecription, description, city, country)]});
      } catch (error) {
        console.error(error)
        await interaction.reply(error);
      }
    //show weather for a specific day
    } else if (optionDay) {
      optionDay.toLowerCase();
      
      if (optionDay === 'today' || optionDay === 't') {
        optionDay = moment().format('dddd');
      }

      if (optionDay === 'tomorrow' || optionDay === 'tm') {
        optionDay = moment().add(1, 'days').format('dddd');
      }

      try {
        const weatherData = await fetch(`https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=${HERE_KEY}&product=forecast_7days&name=${optionCity}`);
        const weatherJson = await weatherData.json();
        const city = weatherJson.forecasts.forecastLocation.city;
        const country = weatherJson.forecasts.forecastLocation.country;
        const week = weatherJson.forecasts.forecastLocation.forecast;
        const day = week.filter((day) => day.weekday === currentWeekday);

        //formats temperature and feels like (comfort) to 1 decimal
        day.forEach(t => {
          t.temperature = parseFloat(t.temperature).toFixed(1);
          t.comfort = parseFloat(t.comfort).toFixed(1);
        });

        //fill missing element with null
        if (day.length != 4 && optionDay === moment().format('dddd')) {
          do {
            day.unshift(null)
          } while (day.length < 4);
        }

        //check rainfall and snowfall and returns data if it exists
        const allPercipitation = (percipitation) => {
          if (percipitation === null) {
            return 'no data';
          }

          if (percipitation.rainFall === "*" && percipitation.snowFall != '*') {
            return `${percipitation.snowFall} cm`;
          } else if (percipitation.snowFall === '*' && percipitation.rainFall != '*') {
            return `${percipitation.rainFall} cm`;
          } else {
            return '0 cm';
          }
        }

        const morning = () => {
          if (day[0] === null) {
            return 'no data';
          } else {
            let morningTemperature = `${day[0].temperature} °C`;
            let morningComfort = `~${day[0].comfort} °C`;
            let morningPrecipitation = allPercipitation(day[0]);
            let morningDescription = `${day[0].description}`;

            return `${morningTemperature} / ${morningComfort}\n${morningPrecipitation}\n${morningDescription}`;
          }
        };

        const afternoon = () => {
          if (day[1] === null) {
            return 'no data';
          } else {
            let afternoonTemperature = `${day[1].temperature} °C`;
            let afternoonComfort = `~${day[1].comfort} °C`;
            let afternoonPrecipitation = allPercipitation(day[1]);
            let afternoonDescription = `${day[1].description}`;

            return `${afternoonTemperature} / ${afternoonComfort}\n${afternoonPrecipitation}\n${afternoonDescription}`;
          }
        };

        const evening = () => {
          if (day[2] === null) {
            return 'no data';
          } else {
            let eveningTemperature = `${day[2].temperature} °C`;
            let eveningComfort = `~${day[2].comfort} °C`;
            let eveningPrecipitation = allPercipitation(day[2]);
            let eveningDescription = `${day[2].description}`;

            return `${eveningTemperature} / ${eveningComfort}\n${eveningPrecipitation}\n${eveningDescription}`;
          }
        };

        console.log('command: weather dayview');
        await interaction.reply({ embeds: [createDayEmbed(optionDay, morning(), afternoon(), evening(), city, country)]});
      } catch (error) {
        console.error(error);
        await interaction.reply(error);
      }

    } else {
      console.log('error')
    }
  }

  // async execute(message, args) {

  //   let weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  //   let options = ['today', 't', 'tomorrow', 'tm']

  //   //weather now
  //   if (!options.includes(args[args.length - 1].toLowerCase()) && !weekdays.includes(args[args.length - 1].toLowerCase())) {
  //     let cityInput = '';
  //     args.forEach(word => {
  //       cityInput += word + ' ';
  //     })

  //     try {
  //       let weatherData = await fetch(`https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=${HERE_KEY}&product=observation&name=${cityInput}`);
  //       let weatherJson = await weatherData.json();
  //       let temperature = parseFloat(weatherJson.observations.location[0].observation[0].temperature).toFixed(1);
  //       let comfort = parseFloat(weatherJson.observations.location[0].observation[0].comfort).toFixed(1);
  //       let precipitation6H = (weatherJson.observations.location[0].observation[0].precipitation6H === '*' ? '0' : parseFloat(weatherJson.observations.location[0].observation[0].precipitation6H).toFixed(2));
  //       let description = weatherJson.observations.location[0].observation[0].description;
  //       let city = weatherJson.observations.location[0].observation[0].city;
  //       let country = weatherJson.observations.location[0].observation[0].country;

  //       console.log('command weather now');
  //       message.channel.send(createNowEmbed(temperature, comfort, precipitation6H, description, city, country));
  //     } catch (error) {
  //       console.error(error);
  //       message.channel.send(error.message);
  //     }
  //     //weather day
  //   } else if (args.length > 1) {
  //     let cityInput = '';
  //     let city = args.splice(0, args.length - 1)
  //     city.forEach(word => {
  //       cityInput += word + ' ';
  //     })

  //     //set current weekday
  //     let currentWeekday = args[args.length - 1].charAt(0).toUpperCase() + args[args.length - 1].slice(1);

  //     //if using options, convert to weekday
  //     let day = args.pop();
  //     if (day.toLowerCase() === 'today' || day.toLowerCase() === 't') {
  //       currentWeekday = moment().format('dddd');
  //     } else if (day.toLowerCase() === 'tomorrow' || day.toLowerCase() === 'tm') {
  //       currentWeekday = moment().add(1, 'days').format('dddd');
  //     }

  //     try {
  //       let weatherData = await fetch(`https://weather.ls.hereapi.com/weather/1.0/report.json?apiKey=${HERE_KEY}&product=forecast_7days&name=${cityInput}`);
  //       let weatherJson = await weatherData.json();
  //       let city = weatherJson.forecasts.forecastLocation.city;
  //       let country = weatherJson.forecasts.forecastLocation.country;
  //       let week = weatherJson.forecasts.forecastLocation.forecast;
  //       let day = week.filter((day) => day.weekday === currentWeekday);

  //       //formats temperature and feels like (comfort) to 1 decimal
  //       day.forEach(t => {
  //         t.temperature = parseFloat(t.temperature).toFixed(1);
  //         t.comfort = parseFloat(t.comfort).toFixed(1);
  //       });

  //       //fill missing element with null
  //       if (day.length != 4 && currentWeekday === moment().format('dddd')) {
  //         do {
  //           day.unshift(null)
  //         } while (day.length < 4);
  //       }

  //       //check rainfall and snowfall and returns data if it exists
  //       const allPercipitation = (percipitation) => {
  //         if (percipitation === null) {
  //           return 'no data';
  //         }

  //         if (percipitation.rainFall === "*" && percipitation.snowFall != '*') {
  //           return `${percipitation.snowFall} cm`;
  //         } else if (percipitation.snowFall === '*' && percipitation.rainFall != '*') {
  //           return `${percipitation.rainFall} cm`;
  //         } else {
  //           return '0 cm';
  //         }
  //       }

  //       const morning = () => {
  //         if (day[0] === null) {
  //           return 'no data';
  //         } else {
  //           let morningTemperature = `${day[0].temperature} °C`;
  //           let morningComfort = `~${day[0].comfort} °C`;
  //           let morningPrecipitation = allPercipitation(day[0]);
  //           let morningDescription = `${day[0].description}`;

  //           return `${morningTemperature} / ${morningComfort}\n${morningPrecipitation}\n${morningDescription}`;
  //         }
  //       };

  //       const afternoon = () => {
  //         if (day[1] === null) {
  //           return 'no data';
  //         } else {
  //           let afternoonTemperature = `${day[1].temperature} °C`;
  //           let afternoonComfort = `~${day[1].comfort} °C`;
  //           let afternoonPrecipitation = allPercipitation(day[1]);
  //           let afternoonDescription = `${day[1].description}`;

  //           return `${afternoonTemperature} / ${afternoonComfort}\n${afternoonPrecipitation}\n${afternoonDescription}`;
  //         }
  //       };

  //       const evening = () => {
  //         if (day[2] === null) {
  //           return 'no data';
  //         } else {
  //           let eveningTemperature = `${day[2].temperature} °C`;
  //           let eveningComfort = `~${day[2].comfort} °C`;
  //           let eveningPrecipitation = allPercipitation(day[2]);
  //           let eveningDescription = `${day[2].description}`;

  //           return `${eveningTemperature} / ${eveningComfort}\n${eveningPrecipitation}\n${eveningDescription}`;
  //         }
  //       };

  //       console.log('command weather dayview');
  //       message.channel.send(createDayEmbed(currentWeekday, morning(), afternoon(), evening(), city, country));
  //     } catch (error) {
  //       console.error(error);
  //       message.channel.send(error.message);
  //     }
  //   } else {
  //     console.log('non');
  //   }
  // }
}
