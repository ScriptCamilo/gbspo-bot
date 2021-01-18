require('dotenv').config()

const { Telegraf } = require("telegraf");
const fs = require('fs');
const schedule = require("node-schedule")

const bot = new Telegraf(process.env.BOT_TOKEN);

// Erro caso não seja a pessoa certa acessando o BOT
bot.catch((err, ctx) => {
  console.log(`Ooops, encoutered an error for ${ctx.updateType}`, err)
  ctx.replyWithDocument({
    source: fs.readFileSync('./assets/stickers-bot/denied.webp'),
    filename: 'denied.webp'
  })
  return ctx.leaveChat();
})

// O start presente em todos os BOTS, mas também filtrando se o ID corresponde ao da pessoa certa
bot.start((ctx) => {
  if (ctx.chat.id !== Number(process.env.ADMIN_ID)) {
    throw new Error('Authentication error')
  }
  ctx.replyWithDocument({
    source: fs.readFileSync('./assets/stickers-bot/granted.webp'),
    filename: 'granted.webp'
  })
  
  // A partir do comando start o bot criará um schedule de mensagens que se repetirá em um horário específico
  schedule.scheduleJob('* 35 * * * *', () => {
    console.log("Foi, amém");
    // Estou eviando um sticker diretamente para um chat específico
    ctx.telegram.sendDocument(process.env.ADMIN_ID, {
      source: fs.readFileSync('./assets/stickers-bot/pill.webp'),
      filename: 'pill.webp'
    })
    // schedule.scheduleJob('/6 * * * *', () => {
    //   ctx.telegram.sendDocument(process.env.ADMIN_ID, {
    //     source: fs.readFileSync('./assets/stickers-bot/alert.webp'),
    //     filename: 'alert.webp'
    //   })
    // })
  })
})


// Command para quando ela tiver tomando o remédio avisar ao BOT
bot.command('tomei', (ctx, next) => {
  if (ctx.chat.id !== Number(process.env.ADMIN_ID)) {
    throw new Error('Authentication error')
  }
  return ctx.replyWithDocument({
    source: fs.readFileSync('./assets/stickers-bot/baby.webp'),
    filename: 'baby.webp'
  })
})

// Preciso criar também o fato de não ter tomado o remédio em determinado tempo

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));