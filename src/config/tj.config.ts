import { registerAs } from '@nestjs/config';
import { apiLink, API_NAME } from '../scripts/api';

export default registerAs('tj', () => ({
  url: apiLink.get(API_NAME.TJ),
  requestTimeout: 30000,
}));
