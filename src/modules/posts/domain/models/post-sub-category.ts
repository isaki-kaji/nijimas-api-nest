import { Uuid } from 'modules/common/domain/value-objects/uuid';

export class PostSubCategory {
  constructor(
    public readonly postId: Uuid,
    public readonly categoryId: Uuid,
    public readonly categoryNo: string,
  ) {}
}
