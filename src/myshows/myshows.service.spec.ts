import { Test, TestingModule } from '@nestjs/testing';
import { MyshowsService } from './myshows.service';

describe('MyshowsService', () => {
  let service: MyshowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyshowsService],
    }).compile();

    service = module.get<MyshowsService>(MyshowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
