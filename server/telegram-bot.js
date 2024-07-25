const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();
const webAppUrl = process.env.HOST;
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN_APP);

bot.command("start", (ctx) => {
  ctx.reply(
    `Добро пожаловать в Гудс-шоп!
Нажмите кнопку ниже, чтобы открыть каталог в телеграм.`,
    Markup.keyboard([
      Markup.button.webApp("Открыть каталог", webAppUrl),
    ]).resize(),
  );
});

bot.launch();
