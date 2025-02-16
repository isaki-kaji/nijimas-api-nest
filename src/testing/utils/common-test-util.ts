import { faker } from '@faker-js/faker/.';
import uuid from 'ui7';

export const genUid = (): string => faker.string.alphanumeric(28);

export const genUUID = (): string => uuid();
