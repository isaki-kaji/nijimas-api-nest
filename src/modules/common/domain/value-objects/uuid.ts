import { validate as isUuid } from 'uuid';
import uuid from 'ui7';

export class UUID {
  private constructor(private readonly value: string) {}

  public static create(value: string): UUID {
    if (!isUuid(value)) {
      throw new Error(`Invalid UUID format: ${value}`);
    }
    return new UUID(value);
  }

  public static generate(): UUID {
    return new UUID(uuid());
  }

  public toString(): string {
    return this.value;
  }
}
