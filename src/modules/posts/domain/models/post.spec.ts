import { create } from 'domain';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { genUid, genUUID } from 'testing/utils/common-test-util';
import { createPublicTypeNo } from '../value-objects/public-type-no';
import { Post } from './post';
import { Uuid } from 'modules/common/domain/value-objects/uuid';

describe('Post', () => {
  describe('isOwnedBy', () => {
    it('should return true if the Uid matches', () => {
      const uid = Uid.create(genUid());
      const post = new Post(
        Uuid.create(genUUID()),
        uid,
        'food',
        createPublicTypeNo('1'),
        new Date(),
        1,
        [],
      );

      expect(post.isOwnedBy(uid)).toBe(true);
    });

    it('should return false if the Uid does not match', () => {
      const uid = Uid.create(genUid());
      const post = new Post(
        Uuid.create(genUUID()),
        uid,
        'food',
        createPublicTypeNo('1'),
        new Date(),
        1,
        [],
      );

      expect(post.isOwnedBy(Uid.create(genUid()))).toBe(false);
    });
  });
});
