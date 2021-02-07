import { Injectable } from '@nestjs/common';

@Injectable()
export class MyshowsService {
  private yesterdayShows = [
    {
      id: 1,
      name: 'TestUser1',
      episodes: 15,
    },
    {
      id: 2,
      name: 'TestUser2',
      episodes: 45,
    },
  ];

  getYesterdayShows() {
    return this.yesterdayShows;
  }

  getShowsTextList(shows) {
    const message = shows
      .map(({ name, episodes }) => `${name} посмотрел ${episodes} серий`)
      .join('\n');
    return message;
  }
}
