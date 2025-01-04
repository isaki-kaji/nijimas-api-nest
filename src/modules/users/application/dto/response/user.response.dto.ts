import { User } from 'users/domain/user';

export class UserResponseDto {
  constructor(user: User) {
    this.uid = user.uid.value;
    this.username = user.username;
    this.selfIntro = user.selfIntro;
    this.profileImageUrl = user.profileImageUrl?.value ?? null;
    this.countryCode = user.countryCode?.value ?? null;
  }

  readonly uid: string;
  readonly username: string;
  readonly selfIntro?: string;
  readonly profileImageUrl?: string;
  readonly countryCode?: string;
}
