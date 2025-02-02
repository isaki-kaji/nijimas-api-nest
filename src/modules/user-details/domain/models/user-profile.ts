import { ImageUrl } from 'modules/common/domain/value-objects/image-url';
import { Uid } from 'modules/common/domain/value-objects/uid';

export class UserProfile {
  constructor(
    private readonly uid: Uid,
    private readonly username: string,
    private readonly selfIntro?: string,
    private readonly profileImageUrl?: ImageUrl,
  ) {}

  getUid(): Uid {
    return this.uid;
  }

  getUsername(): string {
    return this.username;
  }

  getSelfIntro(): string | undefined {
    return this.selfIntro;
  }

  getProfileImageUrl(): ImageUrl | undefined {
    return this.profileImageUrl;
  }
}
