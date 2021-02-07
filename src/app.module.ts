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
    const shows = this.myshowsService.getYesterdayShows();
    const showsText = this.myshowsService.getShowsTextList(shows);

    const news = this.tjService.getNews();
    const newsText = this.tjService.getNewsTextList(news);

    this.telegramService.listenMessages(`${showsText}\n ${newsText}`);
  }
}
