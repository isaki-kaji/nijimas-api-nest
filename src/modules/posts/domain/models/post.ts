import { ImageUrl } from 'modules/common/domain/value-objects/image-url';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { MainCategory } from '../value-objects/main-category';
import { PhotoUrlList } from '../value-objects/photo-url-list';
import { Expense } from '../value-objects/expense';
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
    private readonly postText?: string,
    private readonly photoUrlList?: PhotoUrlList,
    private readonly expense?: Expense,
    private readonly location?: string,
  ) {}

  getPostId(): Uuid {
    return this.postId;
  }
}
