import { PhotoUrlList } from './photo-url-list';

describe('PhotoUrlList', () => {
  describe('create', () => {
    it('should create an instance with valid input', () => {
      const input =
        'http://example.com/image1.jpg,http://example.com/image2.jpg';
      const photoUrlList = PhotoUrlList.create(input);
      expect(photoUrlList).toBeInstanceOf(PhotoUrlList);
    });

    it('should throw an error when input is empty', () => {
      expect(() => PhotoUrlList.create('')).toThrow(
        'Photo URL list must not be empty',
      );
    });
  });

  describe('getStrValue', () => {
    it('should return a comma-separated string of URLs', () => {
      const input =
        'http://example.com/image1.jpg,http://example.com/image2.jpg';
      const photoUrlList = PhotoUrlList.create(input);
      expect(photoUrlList.getStrValue()).toBe(input);
    });
  });

  describe('getListValue', () => {
    it('should return an array of URLs', () => {
      const input =
        'http://example.com/image1.jpg,http://example.com/image2.jpg';
      const photoUrlList = PhotoUrlList.create(input);
      const expectedOutput = [
        'http://example.com/image1.jpg',
        'http://example.com/image2.jpg',
      ];
      expect(photoUrlList.getListValue()).toEqual(expectedOutput);
    });
  });
});
