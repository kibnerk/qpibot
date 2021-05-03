import { Module } from '@nestjs/common';

import { ConfigModule } from './config';
import { AppController } from './app.controller';
import { TjModule } from './tj/tj.module';
import { MessageSenderModule } from './message-sender/message-sender.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [ConfigModule, TjModule, MessageSenderModule, TelegramModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
