import { Uid } from 'modules/common/domain/value-objects/uid';
import { CountryCode } from './value-objects/country-code';
import { Url } from 'modules/common/domain/value-objects/url';

export class User {
  constructor(
    public readonly uid: Uid,
    public readonly username: string,
    public readonly selfIntro?: string,
    public readonly profileImageUrl?: Url,
    public readonly countryCode?: CountryCode,
  ) {}
}
