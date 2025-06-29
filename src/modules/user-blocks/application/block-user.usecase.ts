import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { UserBlocksService } from '../domain/user-blocks.service';
import { UserBlocksFactory } from './factory/user-blocks.factory';
import { IUserBlocksRepository } from '../domain/i.user-blocks.repository';
import { BlockUserDto } from './dto/request/block-user.dto';
import { FollowsUsecase } from '../../follows/application/follows.usecase';
import { FollowDto } from '../../follows/application/dto/request/follow-request.dto';

@Injectable()
export class BlockUserUseCase {
  constructor(
    private readonly service: UserBlocksService,
    private readonly factory: UserBlocksFactory,
    @Inject('IUserBlocksRepository')
    private readonly repository: IUserBlocksRepository,
    @Inject(forwardRef(() => FollowsUsecase))
    private readonly followsUsecase: FollowsUsecase,
  ) {}

  async execute(blockerUid: string, dto: BlockUserDto): Promise<void> {
    // 自分自身をブロックしようとした場合はエラー
    if (blockerUid === dto.blockedUid) {
      throw new BadRequestException('Cannot block yourself');
    }

    const userBlock = this.factory.createModel(blockerUid, dto);

    // すでにブロック済みの場合は何もしない
    const blockExists = await this.service.exists(
      userBlock.blockerUid,
      userBlock.blockedUid,
    );

    if (!blockExists) {
      await this.repository.create(userBlock);
    }

    // ブロック時に相互のフォロー関係があれば解除する
    await this.cancelFollowRelationships(blockerUid, dto.blockedUid);
  }

  /**
   * ブロッカーとブロック対象者の間のフォロー関係を解除する
   * ブロッカーがブロック対象者をフォローしている場合とその逆のケースの両方を処理
   */
  private async cancelFollowRelationships(
    blockerUid: string,
    blockedUid: string,
  ): Promise<void> {
    try {
      // ブロッカーがブロック対象者をフォローしている場合、そのフォローを解除
      const followDto = { targetUid: blockedUid } as FollowDto;
      // TypeScriptの型チェックを回避するため、実行時に uid をセット
      Object.defineProperty(followDto, 'uid', { value: blockerUid });
      await this.followsUsecase.cancelFollow(followDto);
    } catch (error) {
      // フォロー関係がない場合は無視
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    try {
      // ブロック対象者がブロッカーをフォローしている場合、そのフォローも解除
      const reverseFollowDto = { targetUid: blockerUid } as FollowDto;
      // TypeScriptの型チェックを回避するため、実行時に uid をセット
      Object.defineProperty(reverseFollowDto, 'uid', { value: blockedUid });
      await this.followsUsecase.cancelFollow(reverseFollowDto);
    } catch (error) {
      // フォロー関係がない場合は無視
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }
  }
}
