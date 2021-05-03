import { Controller, Get } from '@nestjs/common';
import packageJson from '../package.json';

@Controller('')
export class AppController {
  @Get('ping')
  public async getPong(): Promise<{ pong: boolean; version: string }> {
    return {
      pong: true,
      version: packageJson.version,
    };
  }
}
