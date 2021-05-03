import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { TelegramService } from '../telegram/telegram.service';
import { MyshowsService } from '../myshows/myshows.service';
import { TjService } from '../tj/tj.service';

@Injectable()
export class MessageSenderService {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly myshowsService: MyshowsService,
    private readonly tjService: TjService,
  ) {}
  @Cron('00 02 00 * * *', {
    name: 'nightlyMessage',
    timeZone: 'Europe/Moscow',
  })
  public async sendNightlyMessage() {
    this.telegramService.launch();
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const allShows = await this.myshowsService.getShowsWithAuth();

    const shows = await this.myshowsService.getYesterdayShows(allShows);
    const showsText = this.myshowsService.getShowsTextList(shows);

    const news = await this.tjService.getLastNewsFromApi(25);
    const newsParsed = this.tjService.getParsedNews(news, 3);
    const newsText = this.tjService.getNewsTextList(newsParsed);

    const titleMessage = 'Доброй ночи, друзья! А вот и итоги дня:';
    const message = `<b>${titleMessage}</b>\n\n<b>Сериалы:</b>\n${
      showsText || 'Сериалы сегодня никто не смотрел'
    }\n\n<b>Новости дня</b>\n${newsText}`;

    this.telegramService.sendMessage(message, chatId);
  }
}
