import { createReasonType, ReasonType } from './reason-type';

describe('ReasonType', () => {
  describe('createReasonType', () => {
    it('should return valid reason type for SPAM', () => {
      const result = createReasonType('0');
      expect(result).toBe(ReasonType.SPAM);
    });

    it('should return valid reason type for INAPPROPRIATE', () => {
      const result = createReasonType('1');
      expect(result).toBe(ReasonType.INAPPROPRIATE);
    });

    it('should return valid reason type for HARASSMENT', () => {
      const result = createReasonType('2');
      expect(result).toBe(ReasonType.HARASSMENT);
    });

    it('should return valid reason type for FALSE_INFO', () => {
      const result = createReasonType('3');
      expect(result).toBe(ReasonType.FALSE_INFO);
    });

    it('should return valid reason type for OTHER', () => {
      const result = createReasonType('9');
      expect(result).toBe(ReasonType.OTHER);
    });

    it('should throw error for invalid reason type', () => {
      expect(() => createReasonType('5')).toThrow('Invalid reason type');
    });

    it('should throw error for empty string', () => {
      expect(() => createReasonType('')).toThrow('Invalid reason type');
    });

    it('should throw error for non-numeric string', () => {
      expect(() => createReasonType('abc')).toThrow('Invalid reason type');
    });
  });
});
