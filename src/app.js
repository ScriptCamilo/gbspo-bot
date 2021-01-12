require('dotenv').config()
const { Telegraf } = require("telegraf");
const fs = require('fs');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.catch((err, ctx) => {
  return ctx.replyWithDocument({
    source: fs.readFileSync('./assets/stickers/denied.webp'),
    filename: 'denied.webp'
  })
})

bot.start((ctx) => {
  if (ctx.chat.id !== Number(process.env.ADMIN_ID)) {
    throw new Error('Authentication error')
  }
  return ctx.replyWithDocument({
    source: fs.readFileSync('./assets/stickers/granted.webp'),
    filename: 'granted.webp'
  })
})

bot.command('tomei', (ctx, next) => {
  if (ctx.chat.id !== Number(process.env.ADMIN_ID)) {
    throw new Error('Authentication error')
  }
  return ctx.replyWithDocument({
    source: fs.readFileSync('./assets/stickers/baby.webp'),
    filename: 'baby.webp'
  })
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));