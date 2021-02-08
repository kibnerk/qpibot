import { Telegraf } from 'telegraf';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramService {
  private bot: any;

  constructor() {
    const botToken = process.env.BOT_TOKEN;
    this.bot = new Telegraf(botToken);
  }

  public launch(): void {
    this.bot.launch();
  }

  public listenMessages(message: string): void {
    this.bot.command('news', (ctx) => ctx.replyWithHTML(message));
  }
}
