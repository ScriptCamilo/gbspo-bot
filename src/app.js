require('dotenv').config()
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.catch((err, ctx) => {
  return ctx.reply("ACCESS DENIED")
})
bot.start((ctx) => {
  if (ctx.chat.id !== Number(process.env.ADMIN_ID)) {
    throw new Error('Authentication error')
  }
  return ctx.reply(`ACCESS GRANTED`)
})

// bot.command('alarme', Telegraf.reply("Sua hora foi atualizada."))
// bot.command('tomei', (ctx) => ctx.reply(`${count++}`))

bot.launch()
