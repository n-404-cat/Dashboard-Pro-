import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  private configPath = path.join(process.cwd(), 'ui-config.json');

  getConfig() {
    const currentYear = new Date().getFullYear();
    if (!fs.existsSync(this.configPath)) {
      return { 
        footerText: `© {{year}} Dashboard Pro. All rights reserved.`, 
        year: currentYear 
      };
    }
    const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    // Ensure year is dynamic if not explicitly overridden (or just return current year separately)
    return { ...config, year: currentYear };
  }

  updateConfig(config: any) {
    // Merge with existing
    const current = this.getConfig();
    const newConfig = { ...current, ...config };
    fs.writeFileSync(this.configPath, JSON.stringify(newConfig, null, 2));
    return { success: true };
  }

  login(body: any) {
    const { username, password } = body;
    if (username === 'admin' && password === 'password') {
      return { 
        access_token: 'fake-jwt-token-123456', 
        user: { username: 'admin', role: 'admin' } 
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
