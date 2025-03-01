import {
  createFollowRequestStatus,
  FollowRequestStatus,
} from './follow-request-status';

describe('createFollowRequestStatus', () => {
  it('should return the correct status for valid input', () => {
    expect(createFollowRequestStatus('0')).toBe(FollowRequestStatus.Pending);
    expect(createFollowRequestStatus('1')).toBe(FollowRequestStatus.Accepted);
    expect(createFollowRequestStatus('2')).toBe(FollowRequestStatus.Rejected);
  });

  it('should throw an error for invalid input', () => {
    expect(() => createFollowRequestStatus('3')).toThrow('Invalid status');
    expect(() => createFollowRequestStatus('invalid')).toThrow(
      'Invalid status',
    );
  });
});
