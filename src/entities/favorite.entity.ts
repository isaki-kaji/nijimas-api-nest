import { CreatedDates } from 'common/embedded/registry-dates.embedded';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('favorites')
export class FavoriteEntity {
  @PrimaryGeneratedColumn('uuid')
  postId: string;

  @Column({ type: 'char', length: 28, nullable: false })
  uid: string;

  @Column(() => CreatedDates, { prefix: false })
  registerDate: CreatedDates;
}
