import { RegexUtils } from 'common/util/regex-utils';

export class Uid {
  constructor(public readonly value: string) {
    if (!value) {
      throw new Error('UID must not be empty');
    }

    if (value.length != 28) {
      throw new Error('UID must be 28 characters long');
    }

    if (!RegexUtils.UID.test(value)) {
      throw new Error('UID must contain only alphanumeric characters');
    }
  }

  equals(other: Uid): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
