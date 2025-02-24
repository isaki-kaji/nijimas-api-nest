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
    private readonly mainCategory: MainCategory,
    private readonly publicTypeNo: PublicTypeNo,
    private readonly createdAt: Date,
    private readonly version: number,
    private readonly subCategories: string[],
    private readonly postText?: string,
    private readonly photoUrlList?: PhotoUrlList,
    private readonly expense?: Expense,
    private readonly location?: string,
  ) {}

  isOwnedBy(uid: Uid): boolean {
    return this.uid.equals(uid);
  }

  getPostId(): Uuid {
    return this.postId;
  }

  getUid(): Uid {
    return this.uid;
  }

  getMainCategory(): MainCategory {
    return this.mainCategory;
  }

  getPublicTypeNo(): PublicTypeNo {
    return this.publicTypeNo;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getVersion(): number {
    return this.version;
  }

  getSubCategories(): string[] {
    return this.subCategories;
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
