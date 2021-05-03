import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TjModule } from '../tj/tj.module';
import { MyshowsModule } from '../myshows/myshows.module';
import { TelegramModule } from '../telegram/telegram.module';
import { MessageSenderService } from './message-sender.service';

@Module({
  imports: [ScheduleModule.forRoot(), TjModule, TelegramModule, MyshowsModule],
  providers: [MessageSenderService],
})
export class MessageSenderModule {}
