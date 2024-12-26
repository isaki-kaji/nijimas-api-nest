import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from 'users/users.module';
import { CreateUserDto } from 'users/dto/request/create-user.dto';
import { faker } from '@faker-js/faker/.';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TEST_ENV_VALIDATION_SCHEMA } from 'testing/util/testing.constants';
import testDbConfig from 'testing/config/test-db.config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { VALIDATION_PIPE_OPTIONS } from 'common/util/common.constants';
import { LoggingFilter } from 'common/filter/logging.filter';

function generateCreateDto(): CreateUserDto {
  return {
    uid: faker.string.alphanumeric(28),
    username: faker.person.firstName(),
  };
}

function generateExpectedUser(createUserDto: CreateUserDto) {
  return {
    uid: createUserDto.uid,
    username: createUserDto.username,
  };
}

const createDto = generateCreateDto();
const expectedUser = generateExpectedUser(createDto);

describe('Users [/users]', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        ConfigModule.forRoot({
          expandVariables: true,
          validationSchema: TEST_ENV_VALIDATION_SCHEMA,
        }),
        TypeOrmModule.forRootAsync(testDbConfig.asProvider()),
      ],
      providers: [
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe(VALIDATION_PIPE_OPTIONS),
        },
        {
          provide: APP_FILTER,
          useClass: LoggingFilter,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('OK - Create [POST /]', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createDto);

    const { status } = response;

    expect(status).toBe(HttpStatus.CREATED);
  });

  // it('NG (Conflict) - Create [POST /]', async () => {
  //   const createDto = generateCreateDto();

  //   await request(app.getHttpServer()).post('/users').send(createDto);

  //   const response = await request(app.getHttpServer())
  //     .post('/users')
  //     .send(createDto);

  //   const { status } = response;
  //   expect(status).toBe(HttpStatus.CONFLICT);
  // });

  it('OK - Find by uid [GET /:uid]', async () => {
    const response = await request(app.getHttpServer()).get(
      `/users/${createDto.uid}`,
    );

    const { status, body } = response;

    expect(status).toBe(HttpStatus.OK);
    expect(body).toEqual(
      expect.objectContaining({
        uid: expectedUser.uid,
        username: expectedUser.username,
      }),
    );
  });

  // it('NG (Not found) - Find by uid [GET /:uid]', async () => {
  //   const createDto = generateCreateDto();

  //   const response = await request(app.getHttpServer()).get(
  //     `/users/${createDto.uid}`,
  //   );

  //   const { status } = response;

  //   expect(status).toBe(HttpStatus.NOT_FOUND);
  // });

  afterAll(async () => {
    await app.close();
  });
});
