import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
import { UserEntity } from '../../../entities/user.entity';
import { PostEntity } from '../../../entities/post.entity';
import { FollowEntity } from '../../../entities/follow.entity';
import { FollowRequestEntity } from '../../../entities/follow-request.entity';
import { UserBlockEntity } from '../../../entities/user-block.entity';
import { FavoriteEntity } from '../../../entities/favorite.entity';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * ユーザーを削除する
   * - 関係性データ（follow, follow_request, user_block, favorites）は物理削除
   * - ユーザーとその投稿は論理削除
   */
  async execute(userId: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // ユーザーの存在確認
      const user = await manager.findOne(UserEntity, {
        where: { uid: userId, deletedAt: IsNull() },
      });

      if (!user) {
        throw new NotFoundException('User not found or already deleted');
      }

      // 1. 物理削除（関係性データ）

      // フォロー関係の削除（自分がフォローしている、自分がフォローされている）
      await manager.delete(FollowEntity, [
        { uid: userId },
        { followingUid: userId },
      ]);

      // フォローリクエストの削除（自分が送った、自分が受けた）
      await manager.delete(FollowRequestEntity, [
        { uid: userId },
        { followingUid: userId },
      ]);

      // ブロック関係の削除（自分がブロックしている、自分がブロックされている）
      await manager.delete(UserBlockEntity, [
        { blockerUid: userId },
        { blockedUid: userId },
      ]);

      // 削除ユーザーが行ったfavoriteのみ物理削除
      await manager.delete(FavoriteEntity, { uid: userId });

      // 2. 論理削除

      // ユーザーの投稿を論理削除
      await manager.update(
        PostEntity,
        { uid: userId, deletedAt: IsNull() },
        { deletedAt: new Date() },
      );

      // ユーザーを論理削除
      await manager.update(
        UserEntity,
        { uid: userId },
        { deletedAt: new Date() },
      );
    });
  }
}
