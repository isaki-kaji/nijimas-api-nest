import uuid from 'ui7';

export class Uuid {
  private constructor(private readonly value: string) {}

  public static create(value: string): Uuid {
    if (!this.validateUuidV7(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new Uuid(value);
  }

  private static validateUuidV7(value: string): boolean {
    const uuidV7Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    // 正規表現で基本形式を検証
    if (!uuidV7Regex.test(value)) {
      return false;
    }

    // タイムスタンプ部分の解析
    try {
      const timestampHex = value.split('-')[0]; // 最初の部分（8文字）がタイムスタンプ
      const timestamp = parseInt(timestampHex, 16);

      // タイムスタンプが妥当なUNIXタイムであるか確認
      if (timestamp <= 0 || timestamp > Date.now()) {
        return false;
      }
    } catch (e) {
      return false;
    }

    return true;
  }

  public static generate(): Uuid {
    return new Uuid(uuid());
  }

  public getValue(): string {
    return this.value;
  }
}
