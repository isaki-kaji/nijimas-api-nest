import { Uid } from 'modules/common/domain/value-objects/uid';
import { UCode } from 'modules/common/domain/value-objects/u-code';
import { CountryCode } from '../value-objects/country-code';
import { ImageUrl } from 'modules/common/domain/value-objects/image-url';

export class User {
  constructor(
    private readonly _uid: Uid,
    private readonly _username: string,
    private readonly _userCode: UCode,
    private readonly _version: number,
    private readonly _selfIntro?: string,
    private readonly _profileImageUrl?: ImageUrl,
    private readonly _countryCode?: CountryCode,
  ) {}

  get uid(): Uid {
    return this._uid;
  }

  get username(): string {
    return this._username;
  }

  get userCode(): UCode {
    return this._userCode;
  }

  get version(): number {
    return this._version;
  }

  get selfIntro(): string | undefined {
    return this._selfIntro;
  }

  get profileImageUrl(): ImageUrl | undefined {
    return this._profileImageUrl;
  }

  get countryCode(): CountryCode | undefined {
    return this._countryCode;
  }
}
