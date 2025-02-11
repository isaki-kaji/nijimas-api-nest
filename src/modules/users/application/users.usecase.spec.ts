import { Test, TestingModule } from '@nestjs/testing';
import { UsersUsecase } from './users.usecase';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserDto } from './dto/request/create-user.dto';
import { faker } from '@faker-js/faker';
import {
  ConflictException,
} from '@nestjs/common/exceptions';
import { UsersService } from 'users/domain/users.service';
import { User } from 'users/domain/models/user';
import { UsersFactory } from './factory/users.factory';
import { mock } from 'jest-mock-extended';


describe('UsersUsecase', () => {
  let usecase: UsersUsecase;
  const usersRepository = mock<UsersRepository>();
  const usersService = mock<UsersService>();
  const usersFactory = mock<UsersFactory>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersUsecase,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: UsersFactory,
          useValue: usersFactory,
        },
        {
          provide: 'IUsersRepository',
          useValue: usersRepository,
        },
      ],
    }).compile();

    usecase = module.get<UsersUsecase>(UsersUsecase);
  });

  it('should be defined', () => {
    expect(usecase).toBeDefined();
  });

  describe('create', () => {
    describe('when no error occurs', () => {
      it('should create the user', async () => {
        const uid = genUid();
        const dto = genCreateDto(uid);
        const user = mock<User>();

        usersFactory.create.mockReturnValueOnce(user);
        usersService.exists.mockResolvedValueOnce(false);

        await usecase.create(dto);

        expect(usersFactory.create).toHaveBeenCalledWith(dto);
        expect(usersService.exists).toHaveBeenCalledWith(user.getUid());
        expect(usersRepository.create).toHaveBeenCalledWith(user);

      });
    });

    describe('when user already exists', () => {
      it('should throw the exception', async () => {
        const uid = genUid();
        const dto = genCreateDto(uid);
        const user = mock<User>();

        usersFactory.create.mockReturnValueOnce(user);
        usersService.exists.mockResolvedValueOnce(true);

        await expect(usecase.create(dto)).rejects.toThrow(ConflictException);
        expect(usersFactory.create).toHaveBeenCalledWith(dto);
      });
    });
  });
});

const genUid = (): string => faker.string.alphanumeric(28);

const genCreateDto = (uid: string = genUid()): CreateUserDto => ({
  uid,
  username: faker.person.firstName(),
});

