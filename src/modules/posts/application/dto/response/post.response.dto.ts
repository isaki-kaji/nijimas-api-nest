export interface PostResponseDto {
  postId: string;
  uid: string;
  username: string;
  profileImageUrl: string;
  mainCategory: string;
  isFavorite: boolean;
  publicTypeNo: string;
  createdAt: Date;
  subCategory1: string | null;
  subCategory2: string | null;
  postText: string | null;
  photoUrlList: string[];
  expense: number | null;
  location: string | null;
  version: number | null;
}
