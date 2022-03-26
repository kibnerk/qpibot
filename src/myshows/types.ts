import { GENDER } from 'src/scripts/constants';

export interface Show {
  login: string;
  name: string;
  episodes: number;
  gender: GENDER;
  showId: number;
  show: string;
}

export type TAllShows = {
  [key: string]: Show[];
};
