export type CurrentUserResponseDto = {
  uid: string;
  username: string;
  profileImageUrl: string;
  selfIntro: string | undefined;
  countryCode: string | undefined;
  version: number;
};
