const axios = require('axios');
const setCookie = require('set-cookie-parser');
const api = require('../scripts/api');
const { NAME_BY_LOGIN } = require('../scripts/constants');

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
    let episodes;
    const getValue = title => `${title}=` + authData.find(({ name }) => name === title).value;
    await axios.get(`${api.myshows}/news/`, {
        headers: {
            Cookie: `${getValue('PHPSESSID')}`
        },
    }).then(res => {
        episodes = res.data;
    }).catch(e => {
        console.error(e)
    })

    return episodes;
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
        const lastWatchDay = days.length && days[0];
        const last = lastWatchDay && shows[lastWatchDay];
        let lastOnce = [];

        last.forEach(item => {
            const findItem = lastOnce.find(el => el.login === item.login);
            if (findItem) {
                lastOnce = [...lastOnce.filter(el => el.login !== item.login), {
                    ...findItem,
                    episodes: item.episodes + findItem.episodes
                }];
            } else {
                lastOnce = [...lastOnce, {...item, name: NAME_BY_LOGIN[item.login] || item.login}];
            }
        })
        return lastOnce;
    }

    return null
}

module.exports = getYesterdayShows;
