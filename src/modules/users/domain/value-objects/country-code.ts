export class CountryCode {
  private constructor(public readonly value: string) {}

  static create(value: string): CountryCode {
    if (!value) {
      throw new Error('Country code must not be empty');
    }

    if (value.length !== 2) {
      throw new Error('Country code must be 2 characters long');
    }

    if (!/^[A-Z]{2}$/.test(value)) {
      throw new Error('Country code must consist of two uppercase letters');
    }

    return new CountryCode(value);
  }

  equals(other: CountryCode): boolean {
    return this.value === other.value;
  }

  getValue(): string {
    return this.value;
  }
}
