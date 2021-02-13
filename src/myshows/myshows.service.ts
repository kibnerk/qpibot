import { Injectable } from '@nestjs/common';
import axios from 'axios';
import setCookie from 'set-cookie-parser';
import md5 from 'md5';
import { isYesterday } from 'date-fns';

import api from '../scripts/api';
import { NAME_BY_LOGIN, GENDERS } from '../scripts/constants';
import { declOfNum } from '../scripts/helpers';

interface Show {
  name: string;
  episodes: number;
  gender: string;
  showId: number;
  show: string;
}

@Injectable()
export class MyshowsService {
  getShowsTextList(shows: Show[]) {
    const message = shows
      ?.map(
        ({ name, episodes, gender, showId, show }) =>
          `${name} ${
            gender === GENDERS.FEMALE ? 'посмотрела' : 'посмотрел'
          } ${episodes} ${declOfNum(episodes, [
            'эпизод',
            'эпизода',
            'эпизодов',
          ])} сериала <a href="https://myshows.me/view/${showId}">${show}</a>`,
      )
      .join('\n');
    return message;
  }

  getValueFromData = (title: string, data: { value: string; name: string }[]) =>
    `${title}=` + data.find(({ name }) => name === title).value;

  getAuthData = (login: string, password: string) => {
    return axios
      .get(`${api.myshows}/login`, {
        params: {
          login,
          password: md5(password),
        },
      })
      .then((res: any) => {
        return setCookie.parse(res) as any;
      })
      .catch((error) => {
        return {
          error,
        };
      });
  };

  getLastShows = async (authData: []) => {
    return axios
      .get(`${api.myshows}/news/`, {
        headers: {
          Cookie: `${this.getValueFromData('PHPSESSID', authData)}`,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  };

  getShowsWithAuth = async (login: string, password: string) => {
    const authData = await this.getAuthData(login, password);
    if (!authData.error) return this.getLastShows(authData);
    return null;
  };

  getYesterdayShows = async (login: string, password: string) => {
    const shows = await this.getShowsWithAuth(login, password);

    if (shows) {
      const days = Object.keys(shows);
      const lastWatchDay = days.length && days[1];

      if (isYesterday(new Date(lastWatchDay))) {
        const last = lastWatchDay && shows[lastWatchDay];
        let lastOnce = [];

        last.forEach((item) => {
          const findItem = lastOnce.find(
            (el) => el.login === item.login && el.showId === item.showId,
          );
          if (findItem) {
            lastOnce = [
              ...lastOnce.filter(
                (el) => el.login !== item.login && el.showId !== item.showId,
              ),
              {
                ...findItem,
                episodes: item.episodes + findItem.episodes,
              },
            ];
          } else {
            lastOnce = [
              ...lastOnce,
              { ...item, name: NAME_BY_LOGIN[item.login] || item.login },
            ];
          }
        });
        return lastOnce;
      }

      return [];
    }

    return null;
  };
}
