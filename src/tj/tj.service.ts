import { Injectable } from '@nestjs/common';
import axios from 'axios';
import api from '../scripts/api';

interface NewsItemProps {
  title: string;
  cover?: { thumbnailUrl?: string };
  url: string;
}

@Injectable()
export class TjService {
  getParsedNews = (news: NewsItemProps[], count: number) => {
    return news
      .map(({ cover, title, url }) => {
        return {
          image: cover ? cover.thumbnailUrl : '',
          title,
          url,
        };
      })
      .filter(({ title }, index) => title && index <= count);
  };

  getNewsTextList(news: NewsItemProps[]) {
    const message = news
      .map(
        ({ title, url }, index) =>
          `<b>${index + 1}.</b> ${title} <a href="${url}">🔗</a>`,
      )
      .join('\n\n');

    return message;
  }

  getLastNewsFromApi = async (count: number) => {
    return axios
      .get(`${api.lastNews}`, {
        params: {
          count,
        },
      })
      .then((res) => {
        return res.data.result;
      })
      .catch((e) => {
        console.error(e);
        return [];
      });
  };
}
