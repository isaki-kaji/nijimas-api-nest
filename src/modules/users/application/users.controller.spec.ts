import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersUsecase } from './users.usecase';
import { DeleteUserUseCase } from './delete-user.usecase';
import { mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker/.';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { CurrentUserResponseDto } from './dto/response/current-user.response.dto';

describe('UsersController', () => {
  let controller: UsersController;
  const usersUsecase = mock<UsersUsecase>();
  const deleteUserUseCase = mock<DeleteUserUseCase>();
  const usersQueryService = mock<UsersUsecase>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersUsecase,
          useValue: usersUsecase,
        },
        {
          provide: DeleteUserUseCase,
          useValue: deleteUserUseCase,
        },
        {
          provide: 'IUsersQueryService',
          useValue: usersQueryService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    describe('when no error occurs', () => {
      it('should create the user', async () => {
        const uid = genUid();
        const dto = genCreateDto(uid);

        await controller.create(dto);

        expect(usersUsecase.create).toHaveBeenCalledWith(dto);
      });
    });
  });

  describe('update', () => {
    describe('when no error occurs', () => {
      it('should update the user', async () => {
        const dto = genUpdateDto();

        await controller.update(dto);

        expect(usersUsecase.update).toHaveBeenCalledWith(dto);
      });
    });
  });

  describe('getOwnUser', () => {
    describe('when no error occurs', () => {
      it('should return the user', async () => {
        const uid = genUid();
        const user = mock<CurrentUserResponseDto>();
        usersUsecase.getOwnUser.mockResolvedValue(user);

        const result = await controller.getOwnUser(uid);

        expect(result).toEqual(user);
      });
    });
  });

  describe('deleteUser', () => {
    describe('when no error occurs', () => {
      it('should delete the user', async () => {
        const uid = genUid();

        await controller.deleteUser(uid);

        expect(deleteUserUseCase.execute).toHaveBeenCalledWith(uid);
      });
    });
  });
});

const genUid = () => faker.string.alphanumeric(28);

const genCreateDto = (uid: string): CreateUserDto => ({
  uid,
  username: faker.person.firstName(),
});

const genUpdateDto = (uid: string = genUid()): UpdateUserDto => ({
  uid,
  username: faker.person.firstName(),
  userCode: faker.string.alphanumeric(6),
  selfIntro: faker.lorem.sentence(),
  version: faker.number.int(),
});
