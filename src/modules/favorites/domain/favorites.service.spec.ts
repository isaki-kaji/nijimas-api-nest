import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { IFavoritesRepository } from './i.favorites.repository';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { mock } from 'jest-mock-extended';
import { genUid } from 'testing/utils/common-test-util';

describe('FavoritesService', () => {
  let service: FavoritesService;
  const repository = mock<IFavoritesRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: 'IFavoritesRepository',
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  describe('exists', () => {
    it('should return true if favorite exists', async () => {
      const uid = Uid.create(genUid());
      const postId = Uuid.generate();

      repository.findOne.mockResolvedValueOnce({} as any);

      const result = await service.exists(uid, postId);

      expect(repository.findOne).toHaveBeenCalledWith(uid, postId);
      expect(result).toBe(true);
    });

    it('should return false if favorite does not exist', async () => {
      const uid = Uid.create(genUid());
      const postId = Uuid.generate();

      repository.findOne.mockResolvedValueOnce(null);

      const result = await service.exists(uid, postId);

      expect(repository.findOne).toHaveBeenCalledWith(uid, postId);
      expect(result).toBe(false);
    });
  });
});
