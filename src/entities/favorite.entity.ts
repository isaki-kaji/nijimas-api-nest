import { CreatedDates } from 'common/embedded/registry-dates.embedded';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('favorites')
export class FavoriteEntity {
  @PrimaryColumn('uuid')
  postId: string;

  @PrimaryColumn({ type: 'char', length: 28, nullable: false })
  uid: string;

  @Column(() => CreatedDates, { prefix: false })
  registerDate: CreatedDates;
}
