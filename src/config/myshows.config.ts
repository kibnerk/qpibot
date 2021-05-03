import { registerAs } from '@nestjs/config';
import md5 from 'md5';
import api from '../scripts/api';

export default registerAs('myshows', () => ({
  url: api.myshows,
  requestTimeout: 30000,
  login: process.env.MYSHOWS_LOGIN,
  password: md5(process.env.MYSHOWS_PASSWORD),
}));
