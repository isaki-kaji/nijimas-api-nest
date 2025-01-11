import { Uid } from 'modules/common/domain/value-objects/uid';
import { CountryCode } from '../value-objects/country-code';
import { ImageUrl } from 'modules/common/domain/value-objects/image-url';

export class User {
  constructor(
    readonly uid: Uid,
    readonly username: string,
    readonly selfIntro?: string,
    readonly profileImageUrl?: ImageUrl,
    readonly countryCode?: CountryCode,
  ) {}
}
