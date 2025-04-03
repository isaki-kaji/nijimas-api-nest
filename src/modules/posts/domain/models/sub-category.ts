import { Uuid } from 'modules/common/domain/value-objects/uuid';

export class SubCategory {
  constructor(
    private readonly _id: Uuid,
    private readonly _name: string,
  ) {}

  get id(): Uuid {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
}
