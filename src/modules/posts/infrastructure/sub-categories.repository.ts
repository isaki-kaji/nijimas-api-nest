import { InjectRepository } from '@nestjs/typeorm';
import { ISubCategoriesRepository } from '../domain/i.sub-categories.repository';
import { SubCategoryEntity } from 'entities/sub-category.entity';
import { EntityManager, Repository } from 'typeorm';
import { SubCategory } from '../domain/models/sub-category';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubCategoriesRepository implements ISubCategoriesRepository {
  constructor(
    @InjectRepository(SubCategoryEntity)
    private readonly postRepository: Repository<SubCategoryEntity>,
  ) {}

  async save(
    subCategory: SubCategory,
    manager?: EntityManager,
  ): Promise<SubCategory> {
    const entity = this.toEntity(subCategory);
    if (manager) {
      const row = await manager.getRepository(SubCategoryEntity).save(entity);
      return this.toModel(row);
    } else {
      const row = await this.postRepository.save(entity);
      return this.toModel(row);
    }
  }

  async findByName(
    name: string,
    manager?: EntityManager,
  ): Promise<SubCategory | undefined> {
    if (manager) {
      const row = await manager.getRepository(SubCategoryEntity).findOne({
        where: { categoryName: name },
      });
      return row ? this.toModel(row) : undefined;
    }
    const row = await this.postRepository.findOne({
      where: { categoryName: name },
    });
    return row ? this.toModel(row) : undefined;
  }

  private toEntity(subCategory: SubCategory): SubCategoryEntity {
    const entity = new SubCategoryEntity();
    entity.categoryId = subCategory.id.value;
    entity.categoryName = subCategory.name;
    return entity;
  }

  private toModel(entity: SubCategoryEntity): SubCategory {
    const categoryId = Uuid.create(entity.categoryId);
    return new SubCategory(categoryId, entity.categoryName);
  }
}
