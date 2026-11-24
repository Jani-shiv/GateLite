import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const IdempotencyKey = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const key = request.headers['idempotency-key'];
    
    if (!key) {
      throw new BadRequestException('Idempotency-Key header is required');
    }
    
    if (typeof key !== 'string') {
      throw new BadRequestException('Idempotency-Key must be a string');
    }
    
    return key;
  },
);