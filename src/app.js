require('dotenv').config();

const { Telegraf } = require("telegraf");
const fs = require('fs');
const schedule = require("node-schedule");

const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "https://gbspo-bot.herokuapp.com";

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.telegram.setWebhook(`${URL}/bot${process.env.BOT_TOKEN}`);
bot.startWebhook(`/bot${process.env.BOT_TOKEN}`, null, PORT)

// Condição para o schedule ser criado ou não, evitando repetição caso haja mais de um comando start bem sucedido
let pillScheduleOn = false;
let cautionScheduleOn = false;
// Ao mesmo tempo que também quero fazer um outro comando dá a condição de parada do caution schedule 

// Função para criar os schedules que o bot irá mandar mensagens
function createSchedule(ctx) {
  const pillSchedule = schedule.scheduleJob('0 0 0 * * *', () => {
    // Estou eviando um sticker diretamente para um chat específico
    ctx.telegram.sendDocument(process.env.OWNER_ID, {
      source: fs.readFileSync('./assets/stickers-bot/pill.webp'),
      filename: 'pill.webp'
    })
    
    // Criando um schedule para continuar alertando ao usuário caso ainda não tenha tomado o remédio
    let count = 0; // Para poder alternar entre o nível de caution para o usuário
    cautionScheduleOn = true;
    const cautionSchedule = schedule.scheduleJob('0 */30 * * * *', () => {
      // Condição de parada para o schedule continuar avisando ao usuário
      if (!cautionScheduleOn) {
        console.log("Cancelado.");
        return cautionSchedule.cancel();
      }
      // Processo entre a troca de níveis para o caution
      if (count++ < 3) {
        ctx.telegram.sendDocument(process.env.OWNER_ID, {
          source: fs.readFileSync('./assets/stickers-bot/alert.webp'),
          filename: 'alert.webp'
        })
      } else {
        ctx.telegram.sendDocument(process.env.OWNER_ID, {
          source: fs.readFileSync('./assets/stickers-bot/danger.webp'),
          filename: 'danger.webp'
        })
      }
    })
  })
}

// A message that will be sent everytime the server restart with a possible update
function botUpdate() {
  bot.telegram.sendMessage(process.env.OWNER_ID, `We have been updated, can you please use the start command again?`)
}

// Erro caso não seja a pessoa certa acessando o BOT
bot.catch((err, ctx) => {
  console.log(`Ooops, encoutered an error for ${ctx.updateType}`, err);
  ctx.replyWithDocument({
    source: fs.readFileSync('./assets/stickers-bot/denied.webp'),
    filename: 'denied.webp'
  })
})

botUpdate()
// O start está presente em todos os BOTS, mas nesse também filtramos se o ID corresponde ao da pessoa certa
bot.start((ctx) => {
  if (ctx.chat.id !== Number(process.env.OWNER_ID) && ctx.chat.id !== Number(process.env.ADMIN_ID)) {
    throw new Error('Authentication error');
  }
  ctx.replyWithDocument({
    source: fs.readFileSync('./assets/stickers-bot/granted.webp'),
    filename: 'granted.webp'
  })
  
  // A partir do comando start o bot criará um schedule de mensagens que se repetirá em um horário específico
  // Estou evitando também que vários comandos start crie vários schedules
  if (!pillScheduleOn) {
    pillScheduleOn = true;
    createSchedule(ctx)
  }
})

// Command para quando ela tiver tomado o remédio avisar ao BOT e condição de parada para o caution schedule
bot.command('tomei', (ctx, next) => {
  if (ctx.chat.id !== Number(process.env.OWNER_ID)) {
    throw new Error('Authentication error');
  }
  // Here we are canceling the caution schedule
  cautionScheduleOn = false;

  ctx.replyWithDocument({
    source: fs.readFileSync('./assets/stickers-bot/baby.webp'),
    filename: 'baby.webp'
  })
  ctx.telegram.sendDocument(process.env.ADMIN_ID, {
    source: fs.readFileSync('assets/stickers-bot/master.webp'),
    filename: 'master.webp'
  })
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));