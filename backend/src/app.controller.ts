import { Controller, Get, Put, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('system/ui-config')
  getUiConfig() {
    return this.appService.getConfig();
  }

  @Put('system/ui-config')
  updateUiConfig(@Body() body: any) {
    return this.appService.updateConfig(body);
  }

  @Post('auth/login')
  login(@Body() body: any) {
    return this.appService.login(body);
  }
}
