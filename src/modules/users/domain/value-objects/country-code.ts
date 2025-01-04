export class CountryCode {
  private constructor(public readonly value: string) {
    if (!value) {
      throw new Error('Country code must not be empty');
    }

    if (value.length != 2) {
      throw new Error('Country code must be 2 characters long');
    }
  }

  equals(other: CountryCode): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
