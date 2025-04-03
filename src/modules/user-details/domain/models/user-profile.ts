import { ImageUrl } from 'modules/common/domain/value-objects/image-url';
import { Uid } from 'modules/common/domain/value-objects/uid';

export class UserProfile {
  constructor(
    private readonly _uid: Uid,
    private readonly _username: string,
    private readonly _selfIntro?: string,
    private readonly _profileImageUrl?: ImageUrl,
  ) {}

  get uid(): Uid {
    return this._uid;
  }

  get username(): string {
    return this._username;
  }

  get selfIntro(): string | undefined {
    return this._selfIntro;
  }

  get profileImageUrl(): ImageUrl | undefined {
    return this._profileImageUrl;
  }
}
