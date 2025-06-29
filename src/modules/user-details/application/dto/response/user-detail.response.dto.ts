export interface UserDetailResponseDto {
  readonly uid: string;
  readonly username: string;
  readonly userCode: string;
  readonly selfIntro?: string;
  readonly profileImageUrl?: string;
  readonly followingStatus: string;
  readonly followingCount: number;
  readonly followersCount: number;
  readonly postCount: number;
  readonly isBlocked: boolean; // ユーザーがブロックされているかどうかのフラグ
  // readonly userFavoriteSubcategories: UserFavoriteSubcategory[];
}

export interface UserFavoriteSubcategory {
  readonly categoryNo: string;
  readonly categoryId: string;
  readonly categoryName: string;
}
