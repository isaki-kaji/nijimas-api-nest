import { faker } from '@faker-js/faker/.';

export const genUid = (): string => faker.string.alphanumeric(28);
