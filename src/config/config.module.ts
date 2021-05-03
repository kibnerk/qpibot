import { Module } from '@nestjs/common';
import { ConfigModule as CoreConfigModule } from '@nestjs/config';

import tjConfig from './tj.config';
import myshowsConfig from './myshows.config';

@Module({
  imports: [
    CoreConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [tjConfig, myshowsConfig],
    }),
  ],
  exports: [CoreConfigModule],
})
export class ConfigModule {}
