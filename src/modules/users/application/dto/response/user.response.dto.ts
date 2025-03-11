export type UserResponseDto = {
  uid: string;
  username: string;
  profileImageUrl: string;
  selfIntro: string | undefined;
  countryCode: string | undefined;
  version: number;
};
