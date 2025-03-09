import { createPublicTypeNo, PublicTypeNo } from './public-type-no';

describe('createPublicTypeNo', () => {
  it('should return "0" when input is "0"', () => {
    const result = createPublicTypeNo('0');
    expect(result).toBe(PublicTypeNo.Public);
  });

  it('should return "1" when input is "1"', () => {
    const result = createPublicTypeNo('1');
    expect(result).toBe(PublicTypeNo.FollowersOnly);
  });

  it('should return "2" when input is "2"', () => {
    const result = createPublicTypeNo('2');
    expect(result).toBe(PublicTypeNo.Private);
  });

  it('should throw an error when input is invalid', () => {
    expect(() => createPublicTypeNo('3')).toThrow('Invalid publicTypeNo');
  });
});
