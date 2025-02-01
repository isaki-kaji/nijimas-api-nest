import { Uid } from 'modules/common/domain/value-objects/uid';
import { CountryCode } from '../value-objects/country-code';
import { ImageUrl } from 'modules/common/domain/value-objects/image-url';

export class User {
  constructor(
    private readonly uid: Uid,
    private readonly username: string,
    private readonly selfIntro?: string,
    private readonly profileImageUrl?: ImageUrl,
    private readonly countryCode?: CountryCode,
  ) {}

  getUid(): Uid {
    return this.uid;
  }

  getUsername(): string {
    return this.username;
  }

  getSelfIntro(): string | null {
    return this.selfIntro;
  }

  getProfileImageUrl(): ImageUrl | null {
    return this.profileImageUrl;
  }

  getCountryCode(): CountryCode | null {
    return this.countryCode;
  }
}
