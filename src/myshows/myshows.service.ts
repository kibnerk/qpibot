import { HttpService, Injectable } from '@nestjs/common';
import setCookie from 'set-cookie-parser';
import { isYesterday } from 'date-fns';

import { MyshowsConfig } from './myshows.config';
import { NAME_BY_LOGIN, GENDER } from '../scripts/constants';
import { declOfNum } from '../scripts/helpers';
import { Show, TAllShows } from './types';

function getEpisodeTitle(episodes: number): string {
  return `${episodes} ${declOfNum(episodes, [
    'эпизод',
    'эпизода',
    'эпизодов',
  ])}`;
}

function getWordByGender(gender: GENDER) {
  return gender === GENDER.FEMALE ? 'посмотрела' : 'посмотрел';
}

function getName(login: string) {
  return NAME_BY_LOGIN[login] || login;
}

@Injectable()
export class MyshowsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly myshowsConfig: MyshowsConfig,
  ) {}

  public getShowsTextList(shows: Show[] | undefined) {
    if (!shows) return;

    const message = shows
      .map(
        ({ login, episodes, gender, showId, show }) =>
          `${getName(login)} ${getWordByGender(gender)} ${getEpisodeTitle(
            episodes,
          )} сериала <a href="https://myshows.me/view/${showId}">${show}</a>`,
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

  public getYesterdayShows(shows: TAllShows): Show[] | undefined {
    if (!shows) return;

    const days = Object.keys(shows);
    const lastWatchDay = days.length ? days[0] : null;
    const lastWatchDate = new Date(lastWatchDay.split('.').reverse().join('.'));

    if (!isYesterday(lastWatchDate)) return;

    const lastDayEpisodes = lastWatchDay ? shows[lastWatchDay] : [];
    let showsUsersList: Show[] = [];

    for (const episode of lastDayEpisodes) {
      const { login, showId, episodes } = episode;

      const checkShow = (show: Show) => {
        return show.showId === showId && show.login === login;
      };

      const episodeInList = showsUsersList.find(checkShow);

      if (episodeInList) {
        const changedEpisode = {
          ...episodeInList,
          episodes: episodeInList.episodes + episodes,
        };

        showsUsersList = showsUsersList.map((show) => {
          return checkShow(show) ? changedEpisode : show;
        });
      } else {
        showsUsersList.push(episode);
      }
    }

    return showsUsersList;
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
