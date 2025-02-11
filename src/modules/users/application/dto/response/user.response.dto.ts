export interface UserResponseDto {
  uid: string;
  username: string;
  profileImageUrl: string;
  selfIntro: string | null;
  countryCode: string | null;
  version: number | null;
}
