import { PublicTypeEnum } from '../enums/public-type-no.enum';

export class PublicTypeNo {
  private constructor(private readonly value: PublicTypeEnum) {}

  public static create(value: string): PublicTypeNo {
    if (!value) {
      throw new Error('Public type must not be empty');
    }

    if (!this.isValid(value)) {
      throw new Error(`Invalid public type: ${value}`);
    }

    return new PublicTypeNo(value as PublicTypeEnum);
  }

  private static isValid(value: string): boolean {
    return Object.values(PublicTypeEnum).includes(value as PublicTypeEnum);
  }

  public getValue(): string {
    return this.value;
  }
}
