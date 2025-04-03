import { CountryCode } from './country-code';

describe('CountryCode', () => {
  describe('create', () => {
    it('should create a valid CountryCode instance', () => {
      const countryCode = CountryCode.create('JP');
      expect(countryCode).toBeInstanceOf(CountryCode);
      expect(countryCode.value).toBe('JP');
    });

    it('should throw an error if the value is empty', () => {
      expect(() => CountryCode.create('')).toThrow(
        'Country code must not be empty',
      );
    });

    it('should throw an error if the value is not exactly 2 characters long', () => {
      expect(() => CountryCode.create('J')).toThrow(
        'Country code must be 2 characters long',
      );
      expect(() => CountryCode.create('JPN')).toThrow(
        'Country code must be 2 characters long',
      );
    });

    it('should throw an error if the value contains lowercase letters', () => {
      expect(() => CountryCode.create('jp')).toThrow(
        'Country code must consist of two uppercase letters',
      );
    });

    it('should throw an error if the value contains non-alphabet characters', () => {
      expect(() => CountryCode.create('J1')).toThrow(
        'Country code must consist of two uppercase letters',
      );
      expect(() => CountryCode.create('J!')).toThrow(
        'Country code must consist of two uppercase letters',
      );
    });
  });

  describe('equals', () => {
    it('should return true if two instances have the same value', () => {
      const code1 = CountryCode.create('JP');
      const code2 = CountryCode.create('JP');

      expect(code1.equals(code2)).toBe(true);
    });

    it('should return false if two instances have different values', () => {
      const code1 = CountryCode.create('JP');
      const code2 = CountryCode.create('US');

      expect(code1.equals(code2)).toBe(false);
    });
  });
});
