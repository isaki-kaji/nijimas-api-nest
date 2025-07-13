import { RegistryDates } from 'common/embedded/registry-dates.embedded';
import { Column, Entity, Index, PrimaryColumn, VersionColumn } from 'typeorm';

@Entity('users')
@Index('idx_username', ['username'])
export class UserEntity {
  @PrimaryColumn({ type: 'char', length: 28 })
  uid: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  username: string;

  @Column({ type: 'char', length: 6, nullable: false, unique: true })
  userCode: string;

  @Column({ type: 'text', nullable: true })
  selfIntro?: string;

  @Column({ type: 'text', nullable: true })
  profileImageUrl?: string;

  @Column({ type: 'char', length: 2, nullable: true })
  countryCode?: string;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @Column(() => RegistryDates, { prefix: false })
  registerDate: RegistryDates;

  @VersionColumn()
  version: number;
}
