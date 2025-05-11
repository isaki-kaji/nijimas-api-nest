import { randomBytes } from 'crypto';

export class UCode {
  private constructor(private readonly _value: string) {}

  static generate(): UCode {
    return new UCode(UCode.genCode());
  }

  static create(value: string): UCode {
    if (!value) {
      throw new Error('UCode cannot be empty');
    }

    if (value.length !== 6) {
      throw new Error('UCode must be 6 characters long');
    }

    return new UCode(value);
  }

  get value(): string {
    return this._value;
  }

  private static genCode(length = 6): string {
    const ALPHANUMERIC =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const bytes = randomBytes(length);
    let code = '';

    for (let i = 0; i < length; i++) {
      const index = bytes[i] % ALPHANUMERIC.length;
      code += ALPHANUMERIC[index];
    }

    return code;
  }
}
