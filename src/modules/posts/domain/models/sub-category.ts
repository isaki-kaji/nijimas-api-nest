import { UUID } from 'modules/common/domain/value-objects/uuid';

export class SubCategory {
  constructor(
    public readonly id: UUID,
    public readonly name: string,
  ) {}
}
