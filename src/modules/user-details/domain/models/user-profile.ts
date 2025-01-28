import { ImageUrl } from 'modules/common/domain/value-objects/image-url';
import { Uid } from 'modules/common/domain/value-objects/uid';

export class UserProfile {
  constructor(
    readonly uid: Uid,
    readonly username: string,
    readonly selfIntro?: string,
    readonly profileImageUrl?: ImageUrl,
  ) {}
}
