import axios from 'axios';
import api from '../scripts/api.js';

const getParsedNews = (news, count) => {
    return news.map(({ cover, title, badges, url }) => {
        return {
            image: cover ? cover.thumbnailUrl : '',
            title,
            badges: badges.map(({ text }) => text).join(','),
            url
        }
    }).filter(({ title }, index) => title && index < count);
};

const getLastNewsFromApi = async (count) => {
    return axios.get(`${api.lastNews}`, {
        params: {
            count,
        }
    })
    .then((res) => {
        return res.data.result;
    })
    .catch(e => {
        console.error(e);
        return [];
    });
}

export const getLastNews = async (countToShow) => {
    const countToHandle = countToShow*2;
    const newsFromApi = await getLastNewsFromApi(countToHandle);

    return getParsedNews(newsFromApi, countToShow);
}
