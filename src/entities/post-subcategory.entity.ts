import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('post_subcategories')
export class PostSubcategoryEntity {
  @PrimaryColumn('uuid')
  postId: string;

  @PrimaryColumn({
    type: 'char',
    length: 1,
  })
  categoryNo: string;

  @Column('uuid', { nullable: false })
  categoryId: string;
}
