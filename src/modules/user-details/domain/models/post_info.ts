import { Count } from '../../../common/domain/value-objects/count';

export class PostInfo {
  constructor(private readonly _postCount: Count) {}

  get postCount(): Count {
    return this._postCount;
  }
}
