import { registerAs } from '@nestjs/config';
import api from '../scripts/api';

export default registerAs('tj', () => ({
  url: api.lastNews,
  requestTimeout: 30000,
}));
