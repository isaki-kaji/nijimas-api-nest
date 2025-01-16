import { ImageUrl } from 'modules/common/domain/value-objects/image-url';

export class PhotoUrlList {
  private constructor(public readonly value: ImageUrl[]) {}

  public static create(value: string): PhotoUrlList {
    if (!value) {
      throw new Error('Photo URL list must not be empty');
    }
    const photoUrlList = value
      .split(',')
      .map((photoUrl) => ImageUrl.create(photoUrl));
    return new PhotoUrlList(photoUrlList);
  }

  public getStrValue(): string {
    return this.value.map((imageUrl) => imageUrl.value).join(',');
  }

  public getListValue(): string[] {
    return this.value.map((imageUrl) => imageUrl.value);
  }
}
