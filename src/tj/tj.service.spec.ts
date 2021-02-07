import { Test, TestingModule } from '@nestjs/testing';
import { TjService } from './tj.service';

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
});
