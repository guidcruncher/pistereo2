import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

export const PublicKey = 'IsPublicKey'

export const Public = (...args: string[]) => SetMetadata(PublicKey, true)

export const Private = (...args: string[]) => SetMetadata(PublicKey, false)

export const AuthToken = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const [authType, token] = request.headers.authorization?.split(' ') ?? []
  const authToken = authType === 'Bearer' ? token : ''
  request['authtoken'] = authToken
  return authToken
})

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user = request['user']
  if (user) {
    return user
  }
  return {}
})

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

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
      request['authtoken'] = authToken
      request['user'] = { token: authToken }
      return true
    } else {
      throw new UnauthorizedException()
    }

    throw new UnauthorizedException()
    return false
  }
}
