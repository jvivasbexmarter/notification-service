import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadI } from 'src/websockets/entities/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateToken(token: string) {
    try {
      const secretKey = this.configService.get('JWT_SECRET');

      const payload = (await this.jwtService.verifyAsync(
        token,
        secretKey,
      )) as JwtPayloadI;

      return payload;
    } catch (error) {
      throw error;
    }
  }
}
