import { ImageUrl } from './image-url';

describe('ImageUrl', () => {
  describe('create', () => {
    it('should create an instance with a valid URL', () => {
      const url = 'https://example.com/image.png';
      const imageUrl = ImageUrl.create(url);

      expect(imageUrl).toBeInstanceOf(ImageUrl);
      expect(imageUrl.getValue()).toBe(url);
    });

    it('should throw if the URL is empty', () => {
      expect(() => ImageUrl.create('')).toThrow('Image URL must not be empty');
    });

    it('should throw if the URL is invalid', () => {
      expect(() => ImageUrl.create('invalid-url')).toThrow(
        'Invalid Image URL format',
      );
    });
  });

  describe('equals', () => {
    it('should return true for two ImageUrl instances with the same value', () => {
      const url1 = ImageUrl.create('https://example.com/image.png');
      const url2 = ImageUrl.create('https://example.com/image.png');

      expect(url1.equals(url2)).toBe(true);
    });

    it('should return false for two ImageUrl instances with different values', () => {
      const url1 = ImageUrl.create('https://example.com/image1.png');
      const url2 = ImageUrl.create('https://example.com/image2.png');

      expect(url1.equals(url2)).toBe(false);
    });
  });

  describe('getValue', () => {
    it('should return the correct URL value', () => {
      const url = 'https://example.com/image.png';
      const imageUrl = ImageUrl.create(url);

      expect(imageUrl.getValue()).toBe(url);
    });
  });
});
