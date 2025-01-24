import { RegistryDates } from 'common/embedded/registry-dates.embedded';
import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity('follow_requests')
@Index(['uid', 'followingUid'])
export class FollowRequestEntity {
  @PrimaryColumn('uuid')
  requestId: string;

  @Column({ type: 'char', length: 28, nullable: false })
  uid: string;

  @Column({ type: 'char', length: 28, nullable: false })
  followingUid: string;

  @Column({ type: 'char', length: 1, comment: '0:申請中, 1:承認済, 2:拒否済' })
  status: string;

  @Column(() => RegistryDates, { prefix: false })
  registerDate: RegistryDates;
}
