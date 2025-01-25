import { Uuid } from 'modules/common/domain/value-objects/uuid';

export class SubCategory {
  constructor(
    public readonly id: Uuid,
    public readonly name: string,
  ) {}
}
