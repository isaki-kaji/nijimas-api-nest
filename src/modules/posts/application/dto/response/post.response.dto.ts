export type PostResponseDto = {
  postId: string;
  uid: string;
  username: string;
  profileImageUrl: string;
  mainCategory: string;
  isFavorite: boolean;
  favoriteCount: number;
  publicTypeNo: string;
  createdAt: Date;
  subCategory1: string | undefined;
  subCategory2: string | undefined;
  postText: string | undefined;
  photoUrlList: string[];
  expense: number | undefined;
  location: string | undefined;
  version: number | undefined;
};
