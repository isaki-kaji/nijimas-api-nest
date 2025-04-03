import { RegexUtils } from 'common/util/regex-utils';

export class Uid {
  private constructor(public readonly _value: string) {}

  static create(value?: string): Uid {
    if (!value) {
      throw new Error('UID must not be empty');
    }

    if (value.length !== 28) {
      throw new Error('UID must be 28 characters long');
    }

    if (!RegexUtils.UID.test(value)) {
      throw new Error('UID must contain only alphanumeric characters');
    }

    return new Uid(value);
  }

  equals(other: Uid): boolean {
    return this.value === other.value;
  }

  get value(): string {
    return this._value;
  }
}
