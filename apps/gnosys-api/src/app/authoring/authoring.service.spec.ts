import { Test, TestingModule } from '@nestjs/testing';
import { AuthoringService } from './authoring.service';

describe('AuthoringService', () => {
  let service: AuthoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthoringService],
    }).compile();

    service = module.get<AuthoringService>(AuthoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
