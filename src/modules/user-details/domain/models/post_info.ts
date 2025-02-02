import { Count } from '../../../common/domain/value-objects/count';

export class PostInfo {
  constructor(private readonly postCount: Count) {}

  getPostCount(): Count {
    return this.postCount;
  }
}
