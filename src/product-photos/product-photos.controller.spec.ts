import { Test, TestingModule } from '@nestjs/testing';
import { ProductPhotosController } from './product-photos.controller';

describe('ProductPhotosController', () => {
  let controller: ProductPhotosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductPhotosController],
    }).compile();

    controller = module.get<ProductPhotosController>(ProductPhotosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
