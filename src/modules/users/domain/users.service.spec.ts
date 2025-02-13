import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { mock } from 'jest-mock-extended';
import { IUsersRepository } from './i.users.repository';
import { genUid } from 'testing/utils/users-test-utils';

describe('UsersService', () => {
  let service: UsersService;
  const usersRepository = mock<IUsersRepository>();

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'IUsersRepository',
          useValue: usersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exists', () => {
    it('should return true if user exists', async () => {
      const uid = Uid.create(genUid());
      usersRepository.findByUid.mockResolvedValueOnce({} as any);

      const result = await service.exists(uid);

      expect(usersRepository.findByUid).toHaveBeenCalledWith(uid);
      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      const uid = Uid.create(genUid());
      usersRepository.findByUid.mockResolvedValueOnce(null);

      const result = await service.exists(uid);

      expect(usersRepository.findByUid).toHaveBeenCalledWith(uid);
      expect(result).toBe(false);
    });
  });
});
