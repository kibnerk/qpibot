const SUBSITE_ID = {
  TECH: 199117,
  OFFLINE: 199132,
  MEDIA: 199130,
  HR: 199121,
  SOCIAL: 199129,
  MARKETING: 199113,
};
const subsitesIds = Object.values(SUBSITE_ID).join(',');
export const NEWS_URL = `https://vc.ru`;

export enum API_NAME {
  TJ = 'tj',
  MY_SHOWS = 'myShows',
}

export const apiLink = new Map([
  [
    API_NAME.TJ,
    `https://api.vc.ru/v2.1/timeline?allSite=false&sorting=hotness&subsitesIds=${subsitesIds}`,
  ],
  [API_NAME.MY_SHOWS, 'http://api.myshows.me/profile'],
]);
