export type CurrentUserResponseDto = {
  uid: string;
  username: string;
  userCode: string;
  profileImageUrl: string;
  selfIntro: string | undefined;
  countryCode: string | undefined;
  version: number;
};
