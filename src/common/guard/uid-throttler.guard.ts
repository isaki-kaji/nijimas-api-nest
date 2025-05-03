import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class UidThrottlerGuard extends ThrottlerGuard {
  async getTracker(req: Record<string, any>): Promise<string> {
    const uid = req['ownUid'];
    if (!uid) {
      throw new UnauthorizedException('Missing Firebase UID');
    }
    return uid;
  }
}
