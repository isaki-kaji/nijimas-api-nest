export const PublicTypeNo = {
  Public: '0',
  FollowersOnly: '1',
  Private: '2',
} as const;

export type PublicTypeNo = (typeof PublicTypeNo)[keyof typeof PublicTypeNo];

export function createPublicTypeNo(publicTypeNo: string): PublicTypeNo {
  const publicTypeNos = Object.values(PublicTypeNo);
  if (publicTypeNos.includes(publicTypeNo as PublicTypeNo)) {
    return publicTypeNo as PublicTypeNo;
  }
  throw new Error('Invalid publicTypeNo');
}
