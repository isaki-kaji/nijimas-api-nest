import { Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('main_categories')
export class MainCategoryEntity {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  categoryName: string;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
