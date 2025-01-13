import { Inject, Injectable } from '@nestjs/common';
import { ISubCategoriesRepository } from './i.sub-categories.repository';

@Injectable()
export class PostsService {
  constructor(
    @Inject('ISubCategoriesRepository')
    private readonly repository: ISubCategoriesRepository,
  ) {}
}
