import { Uuid } from './uuid';
import uuid from 'ui7';

describe('Uuid', () => {
  describe('create', () => {
    it('should create a valid UUID instance', () => {
      const validUuid = uuid();
      const uuidInstance = Uuid.create(validUuid);
      expect(uuidInstance.getValue()).toBe(validUuid);
    });

    it('should throw an error for invalid UUID format', () => {
      expect(() => Uuid.create('invalid-uuid')).toThrow(
        'Invalid UUID format: invalid-uuid',
      );
    });

    it('should throw an error for UUID without version 7', () => {
      expect(() =>
        Uuid.create('12345678-1234-4123-8123-123456789abc'),
      ).toThrow();
    });

    it('should throw an error for empty value', () => {
      expect(() => Uuid.create('')).toThrow('Invalid UUID format: ');
    });
  });

  describe('generate', () => {
    it('should generate a valid UUID v7 instance', () => {
      const uuidInstance = Uuid.generate();
      expect(Uuid.create(uuidInstance.getValue())).toBeInstanceOf(Uuid);
    });
  });

  describe('getValue', () => {
    it('should return the correct UUID string', () => {
      const validUuid = uuid();
      const uuidInstance = Uuid.create(validUuid);
      expect(uuidInstance.getValue()).toBe(validUuid);
    });
  });
});
