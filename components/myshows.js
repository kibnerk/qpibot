const axios = require('axios');
const setCookie = require('set-cookie-parser');
const { isYesterday, format } = require('date-fns');

const api = require('../scripts/api');
const { NAME_BY_LOGIN } = require('../scripts/constants');

const getValueFromData = (title, data) => `${title}=` + data.find(({ name }) => name === title).value;

const getAuthData = (login, password) => {
   return axios.get(`${api.myshows}/login`, {
        params: {
            login,
            password
        }
    })
    .then(res => {
        return setCookie.parse(res);
    }).catch(error => {
        return {
            error
        };
    });
};

const getLastShows = async authData => {
    return axios.get(`${api.myshows}/news/`, {
        headers: {
            Cookie: `${getValueFromData('PHPSESSID', authData)}`
        },
    }).then(res => {
        return res.data;
    }).catch(e => {
        console.error(e);
        return null;
    })
};

const getShowsWithAuth = async (login, password) => {
    const authData = await getAuthData(login, password);
    if (!authData.error) return getLastShows(authData);
    return null;
};

const getYesterdayShows = async (login, password) => {
    const shows = await getShowsWithAuth(login, password);

    if (shows) {
        const days = Object.keys(shows);
        const lastWatchDay = days.length && days[1];

        if (!isYesterday(new Date(lastWatchDay))) {
            const last = lastWatchDay && shows[lastWatchDay];
            let lastOnce = [];

            last.forEach(item => {
                const findItem = lastOnce.find(el => el.login === item.login && el.showId === item.showId);
                if (findItem) {
                    lastOnce = [...lastOnce.filter(el => el.login !== item.login && el.showId !== item.showId), {
                        ...findItem,
                        episodes: item.episodes + findItem.episodes
                    }];
                } else {
                    lastOnce = [...lastOnce, {...item, name: NAME_BY_LOGIN[item.login] || item.login}];
                }
            })
            return lastOnce;
        }

        return [];
    }

    return null
}

module.exports.getYesterdayShows = getYesterdayShows;
