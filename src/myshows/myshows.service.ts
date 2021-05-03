import { HttpService, Injectable } from '@nestjs/common';
import setCookie from 'set-cookie-parser';
import { isYesterday } from 'date-fns';

import { MyshowsConfig } from './myshows.config';
import { NAME_BY_LOGIN, GENDERS } from '../scripts/constants';
import { declOfNum } from '../scripts/helpers';
import { Show } from './types';

@Injectable()
export class MyshowsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly myshowsConfig: MyshowsConfig,
  ) {}

  public getShowsTextList(shows: Show[]) {
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

  public async getLastShows(authData: setCookie.Cookie[]) {
    const getValueFromData = (
      title: string,
      data: { value: string; name: string }[],
    ) => `${title}=` + data.find(({ name }) => name === title).value;

    const res = await this.httpService
      .get(`/news/`, {
        headers: {
          Cookie: `${getValueFromData('PHPSESSID', authData)}`,
        },
      })
      .toPromise();

    return res.data;
  }

  public async getShowsWithAuth() {
    const authData = await this.getAuthData();
    return this.getLastShows(authData);
  }

  public async getYesterdayShows(shows: Show[]) {
    if (shows) {
      const days = Object.keys(shows);
      const lastWatchDay = days.length && days[0];

      if (isYesterday(new Date(lastWatchDay.split('.').reverse().join('.')))) {
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
  }

  private async getAuthData() {
    const res = await this.httpService
      .get(`/login`, {
        params: {
          login: this.myshowsConfig.login,
          password: this.myshowsConfig.password,
        },
      })
      .toPromise();

    return setCookie.parse(res as any);
  }
}
