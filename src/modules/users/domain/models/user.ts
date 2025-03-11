import { Uid } from 'modules/common/domain/value-objects/uid';
import { CountryCode } from '../value-objects/country-code';
import { ImageUrl } from 'modules/common/domain/value-objects/image-url';

export class User {
  constructor(
    private readonly uid: Uid,
    private readonly username: string,
    private readonly version: number,
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

  getVersion(): number {
    return this.version;
  }

  getSelfIntro(): string | undefined {
    return this.selfIntro;
  }

  getProfileImageUrl(): ImageUrl | undefined {
    return this.profileImageUrl;
  }

  getCountryCode(): CountryCode | undefined {
    return this.countryCode;
  }
}
