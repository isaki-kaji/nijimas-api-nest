export const ReasonType = {
  SPAM: '0',
  INAPPROPRIATE: '1',
  HARASSMENT: '2',
  FALSE_INFO: '3',
  OTHER: '9',
} as const;

export type ReasonType = (typeof ReasonType)[keyof typeof ReasonType];

export function createReasonType(reasonType: string): ReasonType {
  const types = Object.values(ReasonType);
  if (types.includes(reasonType as ReasonType)) {
    return reasonType as ReasonType;
  }
  throw new Error('Invalid reason type');
}
