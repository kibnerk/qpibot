import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { TelegramService } from '../telegram/telegram.service';
import { MyshowsService } from '../myshows/myshows.service';
import { TjService } from '../tj/tj.service';
import { Show, TAllShows } from 'src/myshows/types';
import { NewsItem, TNewsDataItem } from 'src/tj/types';

@Injectable()
export class MessageSenderService {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly myshowsService: MyshowsService,
    private readonly tjService: TjService,
  ) {}
  @Cron('2 00 * * *', {
    name: 'nightlyMessage',
    timeZone: 'Europe/Moscow',
  })
  public async sendNightlyMessage() {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    this.telegramService.launch();
    const showsPromise = this.myshowsService
      .getShowsWithAuth()
      .then((showsList: TAllShows) => {
        return this.myshowsService.getYesterdayShows(showsList);
      })
      .then((groupedShows: Show[] | undefined) => {
        return this.myshowsService.getShowsTextList(groupedShows);
      });

    const newsPromise = this.tjService
      .getLastNewsFromApi(25)
      .then((news: NewsItem[]) => {
        return this.tjService.getParsedNews(news, 3);
      })
      .then((newsParsed: TNewsDataItem[]) => {
        return this.tjService.getNewsTextList(newsParsed);
      });

    const [showsText, newsText] = await Promise.all([
      showsPromise,
      newsPromise,
    ]);

    const titleMessage = 'Доброй ночи, друзья! А вот и итоги дня:';
    const message = `<b>${titleMessage}</b>\n\n<b>Сериалы:</b>\n${
      showsText || 'Сериалы сегодня никто не смотрел'
    }\n\n<b>Бизнес-новости дня:</b>\n${newsText}\n\nНа этом всё, спокойной ночи!`;

    this.telegramService.sendMessage(message, chatId);
    this.telegramService.stop();
  }
}
