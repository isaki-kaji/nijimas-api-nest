import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersUsecase } from './users.usecase';
import { mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker/.';
import { CreateUserDto } from './dto/request/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  const usersService = mock<UsersUsecase>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersUsecase,
          useValue: usersService,
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

        expect(usersService.create).toHaveBeenCalledWith(dto);
      });
    });
  });
});

const genUid = () => faker.string.alphanumeric(28);

const genCreateDto = (uid: string): CreateUserDto => ({
  uid,
  username: faker.person.firstName(),
});

