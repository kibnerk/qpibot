import { Injectable } from '@nestjs/common';

@Injectable()
export class TjService {
  private news: any;

  getNews() {
    return [{ id: 1, title: 'lol', descr: 'kek' }];
  }

  getNewsTextList(news) {
    const message = news
      .map(({ title }, index) => `${index}. ${title}`)
      .join('\n');
    return message;
  }
}
