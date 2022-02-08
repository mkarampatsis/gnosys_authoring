import { Test, TestingModule } from '@nestjs/testing';
import { AuthoringController } from './authoring.controller';

describe('AuthoringController', () => {
  let controller: AuthoringController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthoringController],
    }).compile();

    controller = module.get<AuthoringController>(AuthoringController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
