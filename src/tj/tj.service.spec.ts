import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { TjService } from './tj.service';

jest.mock('axios');

const titleOfNews = ['Заголовок 1', 'Заголовок номер два'];

const jsonNews = [
  {
    title: titleOfNews[0],
    url: 'https://test.test',
  },
  {
    title: titleOfNews[1],
    url: 'https://test.test',
  },
];

const jsonApiNews = [
  {
    title: titleOfNews[0],
    url: 'https://test.test',
  },
  {
    title: titleOfNews[1],
    url: 'https://test.test',
  },
  {
    title: '',
    url: 'https://test.test',
  },
];

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('TjService', () => {
  let service: TjService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TjService],
    }).compile();

    service = module.get<TjService>(TjService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('check getLastNewsFromApi', async () => {
    mockAxios.get.mockResolvedValue({
      data: {
        result: jsonApiNews,
      },
    });
    const news = await service.getLastNewsFromApi(5);
    expect(news).toBe(jsonApiNews);
  });

  it('check getLastNewsFromApi with error', async () => {
    mockAxios.get.mockRejectedValue(new Error('Async error'));
    const news = await service.getLastNewsFromApi(5);
    expect(news).toStrictEqual([]);
  });

  it('check getNewsTextList method (json to string)', async () => {
    const parsedNews = service.getNewsTextList(jsonNews);
    const countLinks = parsedNews.match(/<a/g);

    expect(parsedNews).toContain(titleOfNews[0]);
    expect(parsedNews).toContain(titleOfNews[1]);
    expect(countLinks).toHaveLength(jsonNews.length);
  });

  it('check getParsedNews method (filter news without title)', async () => {
    const parsedNews = service.getParsedNews(jsonApiNews, 3);
    expect(parsedNews).toHaveLength(2);
  });
});
