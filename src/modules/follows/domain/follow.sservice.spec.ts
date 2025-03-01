import { Test, TestingModule } from '@nestjs/testing';
import { FollowsService } from './follows.service';
import { IFollowsRepository } from './i.follows.repository';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { mock } from 'jest-mock-extended';
import { genUid } from 'testing/utils/common-test-util';

describe('FollowsService', () => {
  let service: FollowsService;
  const followsRepository = mock<IFollowsRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowsService,
        {
          provide: 'IFollowsRepository',
          useValue: followsRepository,
        },
      ],
    }).compile();

    service = module.get<FollowsService>(FollowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exists', () => {
    it('should return true if follow relationship exists', async () => {
      const uid = Uid.create(genUid());
      const followingUid = Uid.create(genUid());
      followsRepository.findOne.mockResolvedValueOnce({} as any);

      const result = await service.exists(uid, followingUid);

      expect(followsRepository.findOne).toHaveBeenCalledWith(uid, followingUid);
      expect(result).toBe(true);
    });

    it('should return false if follow relationship does not exist', async () => {
      const uid = Uid.create(genUid());
      const followingUid = Uid.create(genUid());
      followsRepository.findOne.mockResolvedValueOnce(null);

      const result = await service.exists(uid, followingUid);

      expect(followsRepository.findOne).toHaveBeenCalledWith(uid, followingUid);
      expect(result).toBe(false);
    });
  });
});
