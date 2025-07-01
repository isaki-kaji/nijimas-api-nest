import { Uid } from 'modules/common/domain/value-objects/uid';
import { ReasonType } from '../value-objects/reason-type';

export class PostReport {
  constructor(
    private readonly _postReportsId: string,
    private readonly _reporterUid: Uid,
    private readonly _postId: string,
    private readonly _reasonType: ReasonType,
    private readonly _comment?: string,
  ) {}

  get postReportsId(): string {
    return this._postReportsId;
  }

  get reporterUid(): Uid {
    return this._reporterUid;
  }

  get postId(): string {
    return this._postId;
  }

  get reasonType(): ReasonType {
    return this._reasonType;
  }

  get comment(): string | undefined {
    return this._comment;
  }
}
