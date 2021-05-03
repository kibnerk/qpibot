import { HttpService, Injectable } from '@nestjs/common';
import { NewsDto, NewsItem } from './types';

@Injectable()
export class TjService {
  constructor(private readonly httpService: HttpService) {}

  public getParsedNews(news: NewsItem[], count: number) {
    return news
      .map(({ cover, title, url }) => {
        return {
          image: cover ? cover.thumbnailUrl : '',
          title,
          url,
        };
      })
      .filter(({ title }, index) => title && index < count);
  }

  public getNewsTextList(news: NewsItem[]) {
    const message = news
      .map(
        ({ title, url }, index) =>
          `<b>${index + 1}.</b> ${title} <a href="${url}">🔗</a>`,
      )
      .join('\n\n');

    return message;
  }

  public async getLastNewsFromApi(count: number) {
    const res = await this.httpService
      .get<NewsDto>(`/`, {
        params: {
          count,
        },
      })
      .toPromise();

    return res.data.result;
  }
}
