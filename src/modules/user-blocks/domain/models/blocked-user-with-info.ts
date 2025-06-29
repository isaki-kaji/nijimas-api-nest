import { Uid } from 'modules/common/domain/value-objects/uid';
import { ImageUrl } from 'modules/common/domain/value-objects/image-url';

export class BlockedUserWithInfo {
  constructor(
    private readonly _blockerUid: Uid,
    private readonly _blockedUid: Uid,
    private readonly _username: string,
    private readonly _profileImageUrl?: ImageUrl,
  ) {}

  get blockerUid(): Uid {
    return this._blockerUid;
  }

  get blockedUid(): Uid {
    return this._blockedUid;
  }

  get username(): string {
    return this._username;
  }

  get profileImageUrl(): ImageUrl | undefined {
    return this._profileImageUrl;
  }
}
