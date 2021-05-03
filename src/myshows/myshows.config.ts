import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyshowsConfig {
  constructor(private readonly configService: ConfigService) {}

  get login(): string {
    return this.configService.get<string>('myshows.login');
  }

  get password(): string {
    return this.configService.get<string>('myshows.password');
  }
}
