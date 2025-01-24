import { FollowRequestStatusEnum } from '../enums/follow-request-status.enum';

export class FollowRequestStatus {
  private constructor(private readonly value: FollowRequestStatusEnum) {}

  public static create(value: string): FollowRequestStatus {
    if (!value) {
      throw new Error('Follow request status is required');
    }

    if (!this.isValid(value)) {
      throw new Error('Invalid follow request status');
    }

    return new FollowRequestStatus(value as FollowRequestStatusEnum);
  }

  private static isValid(value: string): boolean {
    return Object.values(FollowRequestStatusEnum).includes(
      value as FollowRequestStatusEnum,
    );
  }

  public getValue(): string {
    return this.value;
  }
}
