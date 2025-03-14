import { faker } from '@faker-js/faker/.';
import { Uid } from './uid';
import { genUid } from 'testing/utils/common-test-util';

describe('Uid', () => {
  describe('create', () => {
    it('should create an instance with a valid UID', () => {
      const validUid = genUid();
      const uid = Uid.create(validUid);

      expect(uid).toBeInstanceOf(Uid);
      expect(uid.getValue()).toBe(validUid);
    });

    it('should throw an error if UID is empty', () => {
      expect(() => Uid.create('')).toThrow('UID must not be empty');
    });

    it('should throw an error if UID is not 28 characters long', () => {
      expect(() => Uid.create('short')).toThrow(
        'UID must be 28 characters long',
      );
      expect(() => Uid.create('a'.repeat(29))).toThrow(
        'UID must be 28 characters long',
      );
    });

    it('should throw an error if UID contains invalid characters', () => {
      expect(() => Uid.create('abcd-1234_efghijklmnopqrstuv')).toThrow(
        'UID must contain only alphanumeric characters',
      );
    });
  });

  describe('equals', () => {
    it('should return true if UIDs are equal', () => {
      const validUid = genUid();
      const uid1 = Uid.create(validUid);
      const uid2 = Uid.create(validUid);

      expect(uid1.equals(uid2)).toBe(true);
    });

    it('should return false if UIDs are different', () => {
      const uid1 = Uid.create(genUid());
      const uid2 = Uid.create(genUid());

      expect(uid1.equals(uid2)).toBe(false);
    });
  });

  describe('getValue', () => {
    it('should return the correct value', () => {
      const validUid = genUid();
      const uid = Uid.create(validUid);

      expect(uid.getValue()).toBe(validUid);
    });
  });
});
