const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const getLastNews = require('./components/tj');
const getYesterdayShows = require('./components/myshows');

const token = process.env.BOT_TOKEN;
const chatId = process.env.BOT_CHAT_ID;

const myshowsLogin = process.env.MYSHOWS_LOGIN;
const myshowsPassword = process.env.MYSHOWS_PASSWORD;

const bot = new TelegramBot(token, {
    polling: true
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    let news = [];
    let shows = [];

    const getSuccess = lastNews => {
        news = lastNews;
    };

    const getSuccessShows = lastShows => {
        shows = lastShows;
    };

    await getLastNews().then(getSuccess);
    await getYesterdayShows(myshowsLogin, myshowsPassword).then(getSuccessShows);

    let message = `<b>Доброй ночки, ребята! Вот и итоги дня:</b> \n\n<b>Сериалы:</b>\n`;

    if (shows.length) {
        shows.forEach(({ showId, show, name, episodes }, index) => {
            message += `<b>${index+1}.</b> ${name} посмотрел ${episodes} эпизодов сериала <a href="https://myshows.me/view/${showId}">${show}</a>\n`
        });
    } else {
        message += 'Сериалы сегодня никто не смотрел\n\n'
    }

    message += `\n<b>Топ новостей c TJ:\n</b>`;

    news.forEach(({ title, badges, url, image }, index) => {
        message += `<b>${index+1}.</b> ${title} <a href="${url}">🔗</a>\n\n`
    });

    bot.sendMessage(chatId, message, {
        parse_mode: 'HTML'
    });
});

bot.on('polling_error', (err) => console.log(err));
