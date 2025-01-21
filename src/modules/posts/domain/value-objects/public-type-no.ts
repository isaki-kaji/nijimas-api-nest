import { PublicTypeNoEnum } from '../enums/public-type-no.enum';

export class PublicTypeNo {
  private constructor(private readonly value: PublicTypeNoEnum) {}

  public static create(value: string): PublicTypeNo {
    if (!value) {
      throw new Error('Public type must not be empty');
    }

    if (!this.isValid(value)) {
      throw new Error(`Invalid public type: ${value}`);
    }

    return new PublicTypeNo(value as PublicTypeNoEnum);
  }

  private static isValid(value: string): boolean {
    return Object.values(PublicTypeNoEnum).includes(value as PublicTypeNoEnum);
  }

  public getValue(): string {
    return this.value;
  }
}
