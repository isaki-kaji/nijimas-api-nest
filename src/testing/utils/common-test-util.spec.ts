import { genUid } from './common-test-util';

describe('common-test-util', () => {
  describe('genUid', () => {
    it('should generate a 28-character alphanumeric UID', () => {
      // Act
      const uid = genUid();

      // Assert
      expect(uid).toHaveLength(28);
      expect(uid).toMatch(/^[a-zA-Z0-9]{28}$/);
    });

    it('should generate different UIDs on each call', () => {
      // Act
      const uid1 = genUid();
      const uid2 = genUid();

      // Assert
      expect(uid1).toHaveLength(28);
      expect(uid2).toHaveLength(28);
      expect(uid1).not.toEqual(uid2);
    });
  });
});
