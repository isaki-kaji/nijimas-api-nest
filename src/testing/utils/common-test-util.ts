import { faker } from '@faker-js/faker/.';
import { QueryRunner } from 'typeorm';
import uuid from 'ui7';

export const genUid = (): string => faker.string.alphanumeric(28);

export const genUUID = (): string => uuid();

export function assertTransactionSuccess(queryRunner: QueryRunner) {
  expect(queryRunner.connect).toHaveBeenCalled();
  expect(queryRunner.startTransaction).toHaveBeenCalled();
  expect(queryRunner.commitTransaction).toHaveBeenCalled();
  expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
  expect(queryRunner.release).toHaveBeenCalled();
}

export function assertTransactionRollback(queryRunner: QueryRunner) {
  expect(queryRunner.connect).toHaveBeenCalled();
  expect(queryRunner.startTransaction).toHaveBeenCalled();
  expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
  expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
  expect(queryRunner.release).toHaveBeenCalled();
}
