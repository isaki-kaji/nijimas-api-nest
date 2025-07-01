import { CreatedDates } from 'common/embedded/registry-dates.embedded';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('post_reports')
export class PostReportEntity {
  @PrimaryColumn({ type: 'uuid' })
  postReportsId: string;

  @Column({ type: 'char', length: 28, nullable: false })
  reporterUid: string;

  @Column({ type: 'uuid', nullable: false })
  postId: string;

  @Column({ type: 'char', length: 1, nullable: false })
  reasonType: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column(() => CreatedDates, { prefix: false })
  createdAt: CreatedDates;
}
