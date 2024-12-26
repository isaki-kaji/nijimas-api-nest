import { RegistryDates } from 'common/embedded/registry-dates.embedded';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sub_categories')
export class SubCategory {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  categoryName: string;

  @Column(() => RegistryDates, { prefix: false })
  registerDate: RegistryDates;
}
