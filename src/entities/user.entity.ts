import { RegistryDates } from 'common/embedded/registry-dates.embedded';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('users')
@Index('idx_username', ['username'])
export class User {
  @PrimaryColumn({ type: 'char', length: 28 })
  uid: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  username: string;

  @Column({ type: 'text', nullable: true })
  selfIntro?: string;

  @Column({ type: 'text', nullable: true })
  profileImageUrl?: string;

  @Column({ type: 'char', length: 2, nullable: true })
  countryCode?: string;

  @Column(() => RegistryDates, { prefix: false })
  registerDate: RegistryDates;
}