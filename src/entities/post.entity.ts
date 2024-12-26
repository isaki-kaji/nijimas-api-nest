import { RegistryDates } from 'common/embedded/registry-dates.embedded';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('posts')
@Index(['uid'])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  postId: string;

  @Column({ type: 'char', length: 28, nullable: false })
  uid: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  mainCategory: string;

  @Column({ type: 'text', nullable: true })
  postText?: string;

  @Column({ type: 'text', nullable: true })
  photoUrl?: string;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2,
    nullable: false,
    default: 0,
  })
  expense: number;

  @Column({ type: 'text', nullable: true })
  location?: string;

  @Column({
    type: 'char',
    length: 1,
    nullable: false,
  })
  publicTypeNo: string;

  @Column(() => RegistryDates, { prefix: false })
  registerDate: RegistryDates;
}
