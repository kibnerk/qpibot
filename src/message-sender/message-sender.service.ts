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
    const isNastyaBirthday = this.checkDate('May 6, 2023');
    if (isNastyaBirthday) {
      const titleMessage =
        'Друзья, здравствуйте! Сегодня у нашей Насти день рождения, и мы не могли пропустить этот праздник!';
      const message = `<b>${titleMessage}</b>\n\n<b>Поздравления дня:</b>\n<b>1.</b> Мы знаем, что музыка - это одна из главных страстей Насти, и мы хотим пожелать ей, чтобы она продолжала создавать прекрасные мелодии и наслаждаться своим творчеством <a href="https://kish.su/wp-content/uploads/2019/08/gorshok-birthday.jpg">🔗</a>\n\n<b>2.</b> Настя также обожает путешествия и приключения, и мы хотим пожелать ей, чтобы каждый ее следующий отдых был полным новых открытий и впечатлений! Пусть она продолжает исследовать мир и находить красоту в каждом его уголке <a href="https://s4-goods.ozstatic.by/2000/477/21/101/101021477_0.jpg">🔗</a>\n\n<b>3.</b> И, конечно же, мы не можем забыть о том, что Насте нужно отдыхать и заботиться о своем здоровье. Поэтому мы желаем ей побольше времени для отдыха и релаксации, чтобы она всегда чувствовала себя здоровой, энергичной и готовой к новым подвигам <a href="https://telegraf.com.ua/static/storage/thumbs/700-*/8/a4/9c695bbd-494b504bb135be52d1c2076ad89b1a48.webp?v=5885_1">🔗</a>\n\nС днем рождения, Настя! Желаем тебе счастья, любви, творческих успехов и незабываемых приключений! 🎉🎂🎁`;

      return this.telegramService.sendMessage(message, chatId);
    }

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

  private checkDate(date: string) {
    const today = new Date();
    const targetDate = new Date(date);

    return today.toDateString() === targetDate.toDateString();
  }
}
