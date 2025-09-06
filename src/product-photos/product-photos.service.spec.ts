import { Test, TestingModule } from '@nestjs/testing';
import { ProductPhotosService } from './product-photos.service';

describe('ProductPhotosService', () => {
  let service: ProductPhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPhotosService],
    }).compile();

    service = module.get<ProductPhotosService>(ProductPhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
