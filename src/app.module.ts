import { Module } from '@nestjs/common';
import { CronJob } from 'cron';
import { TelegramService } from './telegram/telegram.service';
import { MyshowsService } from './myshows/myshows.service';
import { TjService } from './tj/tj.service';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [TelegramService, MyshowsService, TjService],
})
export class AppModule {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly myshowsService: MyshowsService,
    private readonly tjService: TjService,
  ) {}

  onModuleInit() {
    this.telegramService.launch();
    let shows = [];

    const myshowsLogin = process.env.MYSHOWS_LOGIN;
    const myshowsPassword = process.env.MYSHOWS_PASSWORD;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const sendNightlyMessage = async () => {
      const allShows = await this.myshowsService.getShowsWithAuth(
        myshowsLogin,
        myshowsPassword,
      );

      await this.myshowsService
        .getYesterdayShows(allShows)
        .then((lastShows) => {
          shows = lastShows;
        });

      const showsText = this.myshowsService.getShowsTextList(shows);

      const news = await this.tjService.getLastNewsFromApi(15);
      const newsParsed = this.tjService.getParsedNews(news, 3);
      const newsText = this.tjService.getNewsTextList(newsParsed);
      const titleMessage = 'Доброй ночи, друзья! А вот и итоги дня:';

      this.telegramService.sendMessage(
        `<b>${titleMessage}</b>\n\n<b>Сериалы:</b>\n${
          showsText || 'Сериалы сегодня никто не смотрел'
        }\n\n<b>Новости дня</b>\n${newsText}`,
        chatId,
      );
    };

    const job = new CronJob(
      '00 02 00 * * *',
      sendNightlyMessage,
      'Europe/Moscow',
    );
    job.start();
  }
}
