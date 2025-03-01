export const FollowRequestStatus = {
  Pending: '0',
  Accepted: '1',
  Rejected: '2',
} as const;

export type FollowRequestStatus =
  (typeof FollowRequestStatus)[keyof typeof FollowRequestStatus];

export function createFollowRequestStatus(status: string): FollowRequestStatus {
  const statuses = Object.values(FollowRequestStatus);
  if (statuses.includes(status as FollowRequestStatus)) {
    return status as FollowRequestStatus;
  }
  throw new Error('Invalid status');
}
