module.exports = {
  name: 'pollen',
  aliases: ['p'],
  description: 'pollen',
  async execute(message, args) {

    if (args.length === 0) {
      message.reply('please enter area');
      return;
    }
  }
}
