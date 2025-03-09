export const CategoryNo = {
  ONE: '1',
  TWO: '2',
} as const;

export type CategoryNo = (typeof CategoryNo)[keyof typeof CategoryNo];

export function createCategoryNo(categoryNo: number): CategoryNo {
  const categoryNos = Object.values(CategoryNo);
  if (categoryNos.includes(categoryNo.toString() as CategoryNo)) {
    return categoryNo.toString() as CategoryNo;
  }
  throw new Error('Invalid categoryNo');
}
