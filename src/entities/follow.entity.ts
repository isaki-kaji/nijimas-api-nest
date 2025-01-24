import { CreatedDates } from 'common/embedded/registry-dates.embedded';
import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity('follows')
@Index(['uid', 'followingUid'])
export class FollowEntity {
  @PrimaryColumn({ type: 'char', length: 28 })
  uid: string;

  @PrimaryColumn({ type: 'char', length: 28 })
  followingUid: string;

  @Column(() => CreatedDates, { prefix: false })
  createdDate: CreatedDates;
}
