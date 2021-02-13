import { Test, TestingModule } from '@nestjs/testing';
import { TjService } from './tj.service';

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
    service.getLastNewsFromApi(5);
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
