export class UserResponseDto {
  uid: string;

  username: string;

  selfIntro?: string;

  profileImageUrl?: string;

  countryCode?: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
