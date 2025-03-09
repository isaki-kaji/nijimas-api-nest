import { Test, TestingModule } from '@nestjs/testing';
import { PostSubCategoryHelper } from './post-subcategory.helper';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { mock } from 'jest-mock-extended';
import { ISubCategoriesRepository } from 'posts/domain/i.sub-categories.repository';
import { IPostSubCategoriesRepository } from 'posts/domain/i.post-sub-category.repository';
import { genUUID } from 'testing/utils/common-test-util';
import { Uuid } from 'modules/common/domain/value-objects/uuid';
import { SubCategory } from 'posts/domain/models/sub-category';
import { createCategoryNo } from 'posts/domain/value-objects/category-no';

describe('PostSubCategoryHelper', () => {
  let helper: PostSubCategoryHelper;
  const dataSource = mock<DataSource>();
  const queryRunner = mock<QueryRunner>();
  const subCategoriesRepository = mock<ISubCategoriesRepository>();
  const postSubCategoriesRepository = mock<IPostSubCategoriesRepository>();

  beforeEach(async () => {
    dataSource.createQueryRunner.mockReturnValue(queryRunner);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostSubCategoryHelper,
        {
          provide: 'ISubCategoriesRepository',
          useValue: subCategoriesRepository,
        },
        {
          provide: 'IPostSubCategoriesRepository',
          useValue: postSubCategoriesRepository,
        },
      ],
    }).compile();

    helper = module.get<PostSubCategoryHelper>(PostSubCategoryHelper);
    jest.clearAllMocks();
  });

  describe('handleSubCategories', () => {
    it('should be defined', () => {
      expect(helper).toBeDefined();
    });

    it('should return early if subCategories is null or undefined', async () => {
      await helper.handleSubCategories(
        null,
        Uuid.create(genUUID()),
        queryRunner.manager,
      );
      expect(subCategoriesRepository.findByName).not.toHaveBeenCalled();
    });

    it('should handle new subcategories', async () => {
      const subCategoryName1 = 'newCategory1';
      const subCategoryName2 = 'newCategory2';
      subCategoriesRepository.findByName.mockResolvedValue(null);

      const postId = Uuid.create(genUUID());
      await helper.handleSubCategories(
        [subCategoryName1, subCategoryName2],
        postId,
        queryRunner.manager,
      );

      expect(subCategoriesRepository.save).toHaveBeenCalledTimes(2);
      expect(subCategoriesRepository.save).toHaveBeenCalledWith(
        expect.any(SubCategory),
        queryRunner.manager,
      );

      expect(postSubCategoriesRepository.save).toHaveBeenNthCalledWith(
        1,
        expect.any(SubCategory),
        postId,
        createCategoryNo(1),
        queryRunner.manager,
      );

      expect(postSubCategoriesRepository.save).toHaveBeenNthCalledWith(
        2,
        expect.any(SubCategory),
        postId,
        createCategoryNo(2),
        queryRunner.manager,
      );
    });

    describe('handleSubCategories', () => {
      it('should handle new and existing subcategories', async () => {
        const existingSubCategory = mock<SubCategory>();
        const newSubCategoryName = 'newCategory';

        subCategoriesRepository.findByName
          .mockResolvedValueOnce(existingSubCategory)
          .mockResolvedValueOnce(null);

        const postId = Uuid.create(genUUID());

        await helper.handleSubCategories(
          ['existingCategory', newSubCategoryName],
          postId,
          queryRunner.manager,
        );

        expect(subCategoriesRepository.save).not.toHaveBeenCalledWith(
          existingSubCategory,
          queryRunner.manager,
        );

        expect(subCategoriesRepository.save).toHaveBeenCalledWith(
          expect.any(SubCategory),
          queryRunner.manager,
        );

        expect(postSubCategoriesRepository.save).toHaveBeenNthCalledWith(
          1,
          existingSubCategory,
          postId,
          createCategoryNo(1),
          queryRunner.manager,
        );

        expect(postSubCategoriesRepository.save).toHaveBeenNthCalledWith(
          2,
          expect.any(SubCategory),
          postId,
          createCategoryNo(2),
          queryRunner.manager,
        );
      });
    });
  });
});
