import { Uid } from 'modules/common/domain/value-objects/uid';
import { PhotoUrlList } from '../value-objects/photo-url-list';
import { Expense } from '../../../common/domain/value-objects/expense';
import { PublicTypeNo } from '../value-objects/public-type-no';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { MainCategory } from 'modules/common/domain/value-objects/main-category';

export class Post {
  constructor(
    private readonly _postId: Uuid,
    private readonly _uid: Uid,
    private readonly _mainCategory: MainCategory,
    private readonly _publicTypeNo: PublicTypeNo,
    private readonly _createdAt: Date,
    private readonly _version: number,
    private readonly _subCategories: string[],
    private readonly _postText?: string,
    private readonly _photoUrlList?: PhotoUrlList,
    private readonly _expense?: Expense,
    private readonly _location?: string,
  ) {}

  isOwnedBy(uid: Uid): boolean {
    return this.uid.equals(uid);
  }

  get postId(): Uuid {
    return this._postId;
  }

  get uid(): Uid {
    return this._uid;
  }

  get mainCategory(): MainCategory {
    return this._mainCategory;
  }

  get publicTypeNo(): PublicTypeNo {
    return this._publicTypeNo;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get version(): number {
    return this._version;
  }

  get subCategories(): string[] {
    return this._subCategories;
  }

  get postText(): string | undefined {
    return this._postText;
  }

  get photoUrlList(): PhotoUrlList | undefined {
    return this._photoUrlList;
  }

  get expense(): Expense | undefined {
    return this._expense;
  }

  get location(): string | undefined {
    return this._location;
  }
}
