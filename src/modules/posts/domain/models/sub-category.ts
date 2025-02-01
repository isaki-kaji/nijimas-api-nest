import { Uuid } from 'modules/common/domain/value-objects/uuid';

export class SubCategory {
  constructor(
    private readonly id: Uuid,
    private readonly name: string,
  ) {}
}
