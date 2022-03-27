const NEWS_SUBSITE_ID = 245416;
const NEWS_CATEGORY_NAME = 'news';
export const NEWS_URL = `https://tjournal.ru/${NEWS_CATEGORY_NAME}`;

export enum API_NAME {
  TJ = 'tj',
  MY_SHOWS = 'myShows',
}

export const apiLink = new Map([
  [
    API_NAME.TJ,
    `https://api.tjournal.ru/v2.1/timeline?allSite=false&sorting=hotness&subsitesIds=${NEWS_SUBSITE_ID}`,
  ],
  [API_NAME.MY_SHOWS, 'http://api.myshows.me/profile'],
]);
