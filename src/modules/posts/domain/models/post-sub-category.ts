import { UUID } from 'modules/common/domain/value-objects/uuid';

export class PostSubCategory {
  constructor(
    public readonly postId: UUID,
    public readonly categoryId: UUID,
    public readonly categoryNo: string,
  ) {}
}
