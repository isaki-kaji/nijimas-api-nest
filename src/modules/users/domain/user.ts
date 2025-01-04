import { Uid } from 'modules/common/domain/value-objects/uid';
import { CountryCode } from './value-objects/country-code';
import { Url } from 'modules/common/domain/value-objects/url';

export class User {
  uid: Uid;

  username: string;

  selfIntro?: string;

  profileImageUrl?: Url;

  countryCode?: CountryCode;
}
