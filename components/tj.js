const axios = require('axios');
const api = require('../scripts/api');

const getNewsData = (news, count) => {
    return news.map(({ cover, title, badges, url }) => {
        return {
            image: cover ? cover.thumbnailUrl : '',
            title,
            badges: badges.map(({ text }) => text).join(','),
            url
        }
    }).filter(({ title }, index) => title && index < count);
};

const getLastNews = async () => {
    let news = [];
    await axios.get(`${api.lastNews}`, {
        params: {
            count: 15,
        }
    })
    .then((res) => {
        news = getNewsData(res.data.result, 3);
    })
    .catch(e => {
        console.error(e);
    });

    return news;
}

module.exports = getLastNews;
