export const FollowingStatus = {
  NOT_FOLLOWING: '0',
  FOLLOWING: '1',
  REQUESTED: '2',
  BLOCKED: '3',
} as const;

export type FollowingStatus =
  (typeof FollowingStatus)[keyof typeof FollowingStatus];

export function createFollowingStatus(status: string): FollowingStatus {
  const statuses = Object.values(FollowingStatus);
  if (statuses.includes(status as FollowingStatus)) {
    return status as FollowingStatus;
  }
  throw new Error('Invalid status');
}
