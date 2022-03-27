import { registerAs } from '@nestjs/config';
import md5 from 'md5';
import { apiLink, API_NAME } from '../scripts/api';

export default registerAs('myshows', () => ({
  url: apiLink.get(API_NAME.MY_SHOWS),
  requestTimeout: 30000,
  login: process.env.MYSHOWS_LOGIN,
  password: md5(process.env.MYSHOWS_PASSWORD),
}));
