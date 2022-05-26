import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { NEWS_URL } from 'src/scripts/api';
import { NewsDto, NewsItem, TNewsDataItem } from './types';

@Injectable()
export class TjService {
  constructor(private readonly httpService: HttpService) {}

  public getParsedNews(news: NewsItem[], count: number) {
    return news
      .map(({ data }) => {
        const { title, id } = data;
        return {
          title,
          url: `${NEWS_URL}/${id}`,
        };
      })
      .filter(({ title }, index) => title && index < count);
  }

  public getNewsTextList(news: TNewsDataItem[]) {
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

    return res.data.result.items;
  }
}
