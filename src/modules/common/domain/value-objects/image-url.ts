export class ImageUrl {
  private constructor(public readonly value: string) {}

  static create(value: string): ImageUrl {
    if (!value) {
      throw new Error('Image URL must not be empty');
    }

    if (!this.isValid(value)) {
      throw new Error('Invalid Image URL format');
    }

    return new ImageUrl(value);
  }

  private static isValid(value: string): boolean {
    try {
      new URL(value); // URLの構文をチェック
      return true;
    } catch {
      return false;
    }
  }

  equals(other: ImageUrl): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}