import { ImageUrl } from 'modules/common/domain/value-objects/image-url';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { MainCategory } from '../value-objects/main-category';
import { PhotoUrlList } from '../value-objects/photo-url-list';
import { Expense } from '../value-objects/expense';
import { PublicTypeNo } from '../value-objects/public-type-no';
import { UUID } from 'modules/common/domain/value-objects/uuid';

export class Post {
  constructor(
    readonly postId: UUID,
    readonly uid: Uid,
    readonly username: string,
    readonly profileImageUrl: ImageUrl,
    readonly mainCategory: MainCategory,
    readonly isFavorite: boolean,
    readonly publicTypeNo: PublicTypeNo,
    readonly createdAt: Date,
    readonly subCategory1?: string,
    readonly subCategory2?: string,
    readonly postText?: string,
    readonly photoUrlList?: PhotoUrlList,
    readonly expense?: Expense,
    readonly location?: string,
  ) {}
}
