import { Module } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';
import { MyshowsService } from './myshows/myshows.service';
import { TjService } from './tj/tj.service';

@Module({
  imports: [],
  controllers: [],
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

    (async () => {
      await this.myshowsService
        .getYesterdayShows(myshowsLogin, myshowsPassword)
        .then((lastShows) => {
          shows = lastShows;
        });

      const showsText = this.myshowsService.getShowsTextList(shows);

      const news = await this.tjService.getLastNewsFromApi(15);
      const newsParsed = this.tjService.getParsedNews(news, 3);
      const newsText = this.tjService.getNewsTextList(newsParsed);
      const titleMessage = 'Доброй ночи, друзья! А вот и итоги дня:';

      this.telegramService.listenMessages(
        `<b>${titleMessage}</b>\n\n${
          showsText || 'Сериалы сегодня никто не смотрел'
        }\n\n ${newsText}`,
      );
    })();
  }
}
