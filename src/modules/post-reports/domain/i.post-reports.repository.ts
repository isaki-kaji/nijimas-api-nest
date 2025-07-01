import { PostReport } from './models/post-report';

export interface IPostReportsRepository {
  create(postReport: PostReport): Promise<void>;
}
