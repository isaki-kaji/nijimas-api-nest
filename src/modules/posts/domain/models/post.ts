import { ImageUrl } from 'modules/common/domain/value-objects/image-url';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { MainCategory } from '../../../common/domain/value-objects/main-category';
import { PhotoUrlList } from '../value-objects/photo-url-list';
import { Expense } from '../../../common/domain/value-objects/expense';
import { PublicTypeNo } from '../value-objects/public-type-no';
import { Uuid } from 'modules/common/domain/value-objects/uuid';

export class Post {
  constructor(
    private readonly postId: Uuid,
    private readonly uid: Uid,
    private readonly username: string,
    private readonly profileImageUrl: ImageUrl,
    private readonly mainCategory: MainCategory,
    private readonly isFavorite: boolean,
    private readonly publicTypeNo: PublicTypeNo,
    private readonly createdAt: Date,
    private readonly subCategory1?: string,
    private readonly subCategory2?: string,
    private readonly postText?: string,
    private readonly photoUrlList?: PhotoUrlList,
    private readonly expense?: Expense,
    private readonly location?: string,
  ) {}

  getPostId(): Uuid {
    return this.postId;
  }

  getUid(): Uid {
    return this.uid;
  }

  getUsername(): string {
    return this.username;
  }

  getProfileImageUrl(): ImageUrl {
    return this.profileImageUrl;
  }

  getMainCategory(): MainCategory {
    return this.mainCategory;
  }

  getIsFavorite(): boolean {
    return this.isFavorite;
  }

  getPublicTypeNo(): PublicTypeNo {
    return this.publicTypeNo;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getSubCategory1(): string | undefined {
    return this.subCategory1;
  }

  getSubCategory2(): string | undefined {
    return this.subCategory2;
  }

  getPostText(): string | undefined {
    return this.postText;
  }

  getPhotoUrlList(): PhotoUrlList | undefined {
    return this.photoUrlList;
  }

  getExpense(): Expense | undefined {
    return this.expense;
  }

  getLocation(): string | undefined {
    return this.location;
  }
}
