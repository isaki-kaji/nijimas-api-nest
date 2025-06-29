import { CreatedDates } from 'common/embedded/registry-dates.embedded';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user_blocks')
export class UserBlockEntity {
  @PrimaryColumn({ type: 'char', length: 28, nullable: false })
  blockerUid: string;

  @PrimaryColumn({ type: 'char', length: 28, nullable: false })
  blockedUid: string;

  @Column(() => CreatedDates, { prefix: false })
  registerDate: CreatedDates;
}
