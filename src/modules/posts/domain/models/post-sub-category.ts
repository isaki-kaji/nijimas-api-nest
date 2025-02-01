import { Uuid } from 'modules/common/domain/value-objects/uuid';

export class PostSubCategory {
  constructor(
    private readonly postId: Uuid,
    private readonly categoryId: Uuid,
    private readonly categoryNo: string,
  ) {}
}
