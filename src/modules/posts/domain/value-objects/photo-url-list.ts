import { ImageUrl } from 'modules/common/domain/value-objects/image-url';

export class PhotoUrlList {
  private constructor(private readonly _value: ImageUrl[]) {}

  public static create(value: string): PhotoUrlList {
    if (!value) {
      throw new Error('Photo URL list must not be empty');
    }
    const photoUrlList = value
      .split(',')
      .map((photoUrl) => ImageUrl.create(photoUrl));
    return new PhotoUrlList(photoUrlList);
  }

  get strValue(): string {
    return this._value.map((imageUrl) => imageUrl.value).join(',');
  }

  get listValue(): string[] {
    return this._value.map((imageUrl) => imageUrl.value);
  }
}
