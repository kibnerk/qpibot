import * as https from 'https';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MyshowsService } from './myshows.service';
import { MyshowsConfig } from './myshows.config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('myshows.url'),
        timeout: configService.get<number>('myshows.requestTimeout'),
        responseType: 'json',
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MyshowsService, MyshowsConfig],
  exports: [MyshowsService],
})
export class MyshowsModule {}
