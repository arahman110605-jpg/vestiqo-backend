import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private lastContext?: ExecutionContext;

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    this.lastContext = context;
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.error('JWT Authentication Error:', err);
      console.error('JWT Info (reason):', info);
      
      // Decode the raw token from the request header
      try {
        if (this.lastContext) {
          const req = this.lastContext.switchToHttp().getRequest();
          const authHeader = req.headers['authorization'];
          if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.decode(token, { complete: true });
            console.error('RAW DECODED TOKEN:', JSON.stringify(decoded, null, 2));
          } else {
            console.error('NO BEARER TOKEN FOUND IN HEADER');
          }
        }
      } catch (decodeErr) {
        console.error('Failed to decode raw token:', decodeErr);
      }

      throw err || new UnauthorizedException('JWT Validation Failed');
    }
    return user;
  }
}
