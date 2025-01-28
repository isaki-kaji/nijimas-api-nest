import { FollowingStatusEnum } from '../enums/following-status.enum';

export class FollowingStatus {
  private constructor(readonly value: FollowingStatusEnum) {}

  static create(value: string): FollowingStatus {
    if (!value) {
      throw new Error('Following status is required');
    }

    if (!this.isValid) {
      throw new Error('Invalid following status');
    }

    return new FollowingStatus(value as FollowingStatusEnum);
  }

  static isValid(value: string): boolean {
    return Object.values(FollowingStatusEnum).includes(
      value as FollowingStatusEnum,
    );
  }

  getValue(): FollowingStatusEnum {
    return this.value;
  }
}
