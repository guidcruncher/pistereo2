import { UserService } from '@data/user.service'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { AuthService } from './auth.service'
import { PublicKey } from './decorators'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PublicKey, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const [authType, token] = request.headers.authorization?.split(' ') ?? []
    const authToken = authType === 'Bearer' ? token : undefined

    if (authToken) {
      const session = await this.userService.getSession(authToken)
      if (session) {
        request['user'] = session.user
        return true
      }
      throw new UnauthorizedException()
    }

    throw new UnauthorizedException()
    return false
  }
}
