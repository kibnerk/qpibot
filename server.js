const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const { getLastNews } = require('./components/tj');
const { getYesterdayShows } = require('./components/myshows');

const { declOfNum } = require('./scripts/helpers');
const { GENDERS } = require('./scripts/constants');

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

    await getLastNews(3).then(lastNews => {
        news = lastNews;
    });

    await getYesterdayShows(myshowsLogin, myshowsPassword).then(lastShows => {
        shows = lastShows;
    });

    let message = `<b>Доброй ночки, ребята! Вот и итоги дня:</b> \n\n<b>Сериалы:</b>\n`;

    if (shows.length) {
        shows.forEach(({ showId, show, name, episodes, gender}, index) => {
            message += `${name} ${gender === GENDERS.FEMALE ? 'посмотрела' : 'посмотрел'} ${episodes} ${declOfNum(episodes, ['эпизод', 'эпизода', 'эпизодов'])} сериала <a href="https://myshows.me/view/${showId}">${show}</a>\n`
        });
    } else {
        message += 'Сериалы сегодня никто не смотрел\n'
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
