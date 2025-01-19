import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const OwnUid = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const uid = request['ownUid'];
    if (!uid) {
      throw new Error('UID is not available in the request');
    }

    return uid;
  },
);
