import { Test, TestingModule } from '@nestjs/testing';
import { UsersUsecase } from './users.usecase';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserDto } from './dto/request/create-user.dto';
import { faker } from '@faker-js/faker';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { mock } from 'jest-mock-extended';
import { UsersService } from 'users/domain/users.service';
import { UsersFactory } from 'users/domain/factory/users.factory';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { User } from 'users/domain/models/user';
import { UserResponseDto } from './dto/response/user.response.dto';

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
        const user = genUserFromCreateDto(dto);

        usersFactory.create.mockReturnValueOnce(user);
        usersService.exists.mockResolvedValueOnce(false);

        await usecase.create(dto);

        expect(usersFactory.create).toHaveBeenCalledWith(dto);
        expect(usersService.exists).toHaveBeenCalledWith(user);
      });
    });

    describe('when user already exists', () => {
      it('should throw the exception', async () => {
        const uid = genUid();
        const dto = genCreateDto(uid);
        const user = genUserFromCreateDto(dto);

        usersFactory.create.mockReturnValueOnce(user);
        usersService.exists.mockResolvedValueOnce(true);

        await expect(usecase.create(dto)).rejects.toThrow(ConflictException);
        expect(usersFactory.create).toHaveBeenCalledWith(dto);
      });
    });
  });

  describe('findByUid', () => {
    describe('when user exists', () => {
      it('should return the user-response-dto', async () => {
        const uid = genUid();
        const user = genUserFromUid(uid);
        const userResponse = genUserResponseFromUser(user);

        usersRepository.findByUid.mockResolvedValueOnce(user);
        usersFactory.createResponse.mockReturnValueOnce(userResponse);

        const result = await usecase.findByUid(uid);

        expect(result).toEqual(userResponse);
      });
    });

    describe('when user not exists', () => {
      it('should throw the exception', async () => {
        const uid = genUid();

        usersRepository.findByUid.mockResolvedValueOnce(null);

        usersRepository.findByUid.mockResolvedValueOnce(null);

        await expect(usecase.findByUid(uid)).rejects.toThrow(NotFoundException);
        expect(usersRepository.findByUid).toHaveBeenCalledWith(Uid.create(uid));
      });
    });
  });
});

const genUid = (): string => faker.string.alphanumeric(28);

const genCreateDto = (uid: string = genUid()): CreateUserDto => ({
  uid,
  username: faker.person.firstName(),
});

const genUserFromCreateDto = (dto: CreateUserDto): User => ({
  uid: Uid.create(dto.uid),
  username: dto.username,
  selfIntro: null,
  profileImageUrl: null,
  countryCode: null,
});

const genUserFromUid = (uid: string): User => ({
  uid: Uid.create(uid),
  username: faker.person.firstName(),
  selfIntro: null,
  profileImageUrl: null,
  countryCode: null,
});

const genUserResponseFromUser = (user: User): UserResponseDto => ({
  uid: user.uid.value,
  username: user.username,
  selfIntro: user.selfIntro,
  profileImageUrl: user.profileImageUrl?.value ?? null,
  countryCode: user.countryCode?.value ?? null,
});
