const { Telegraf } = require("telegraf");

const bot = new Telegraf("1447743161:AAGTxI77FHGeoMBevp4xjuLDTmSQpPfv1e8");
const msg =
  "Demora, mas sempre vemos nossos progressos. E eu estou muito feliz por ter chegado até contigo! Sei que a cada dia que acordo me inspiro ainda mais para alcançar meus sonhos porque sei que você está ao meu lado. Eu não poderia pedir nada melhor e tenho certeza que vamos crescer demais juntos! Esse é apenas um enorme começo, simples, mas sempre exciting. Vamos colocar tudo que temos para frente meu amor. 🤖 Robôs também amam!";

bot.start((ctx) => ctx.reply(msg));

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
