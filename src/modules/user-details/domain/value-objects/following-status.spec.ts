import { createFollowingStatus, FollowingStatus } from './following-status';

describe('createFollowingStatus', () => {
  it('should return the correct status for valid input', () => {
    expect(createFollowingStatus('0')).toBe(FollowingStatus.NOT_FOLLOWING);
    expect(createFollowingStatus('1')).toBe(FollowingStatus.FOLLOWING);
    expect(createFollowingStatus('2')).toBe(FollowingStatus.REQUESTED);
    expect(createFollowingStatus('3')).toBe(FollowingStatus.BLOCKED);
  });

  it('should throw an error for invalid input', () => {
    expect(() => createFollowingStatus('4')).toThrow('Invalid status');
    expect(() => createFollowingStatus('invalid')).toThrow('Invalid status');
  });
});
