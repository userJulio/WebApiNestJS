import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { jwtPayload } from 'src/auth/dto/interfaces';

@Injectable()
export class AutheticationGuard implements CanActivate {

  constructor(private jwtService: JwtService, private authservice: AuthService) {

  }
  async canActivate(
    context: ExecutionContext): Promise<boolean> {
     
      const request = context.switchToHttp().getRequest();
   const token = this.extractTokenFromHeader(request);
   if (!token) {
    throw new UnauthorizedException();
  }
  try {
    const payload = await this.jwtService.verifyAsync<jwtPayload>(
      token,
      {
        secret: process.env.JWT_SECRET
      }
    );
    console.log("request:",request);
    const user= await this.authservice.findUserById(payload.id);
   if(!user) throw new UnauthorizedException();
   if(!user.isActive) throw new UnauthorizedException();

    request['user'] =user;
    request['token']=token;
  } catch {
    throw new UnauthorizedException();
  }
 
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
