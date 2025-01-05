export class PhotoUrl {
  private constructor(public readonly value: string) {}

  static create(value: string): PhotoUrl {
    if (!this.isValid(value)) {
      throw new Error('Invalid URL format');
    }
    return new PhotoUrl(value);
  }

  static isValid(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  equals(other: PhotoUrl): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
