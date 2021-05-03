import * as https from 'https';

import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TjService } from './tj.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('tj.url'),
        timeout: configService.get<number>('tj.requestTimeout'),
        responseType: 'json',
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TjService],
  exports: [TjService],
})
export class TjModule {}
