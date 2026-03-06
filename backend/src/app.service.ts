import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

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
    return { ...config, year: currentYear };
  }

  updateConfig(config: any) {
    const current = this.getConfig();
    const newConfig = { ...current, ...config };
    fs.writeFileSync(this.configPath, JSON.stringify(newConfig, null, 2));
    return { success: true };
  }

  async login(body: any) {
    const { username, password } = body;

    // Find user and explicitly select password, and include roles and their permissions
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password', 'status', 'nickname', 'avatar', 'email'],
      relations: ['roles', 'roles.permissions']
    });

    if (!user || user.status === 0) {
      throw new UnauthorizedException('Invalid credentials or account disabled');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update login info
    user.lastLoginTime = new Date();
    await this.userRepository.save(user);

    // Flatten permissions
    const permissions = new Set<string>();
    user.roles.forEach(role => {
      if (role.status === 1) {
        role.permissions.forEach(p => {
          if (p.status === 1) {
            permissions.add(p.permissionKey);
          }
        });
      }
    });

    // Determine if super admin (by role key 'admin' or username 'admin')
    const isSuperAdmin = user.username === 'admin' || user.roles.some(r => r.roleKey === 'admin');

    return {
      access_token: 'fake-jwt-token-' + Date.now(),
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        email: user.email,
        roles: user.roles.map(r => r.roleKey),
        permissions: isSuperAdmin ? ['*:*:*'] : Array.from(permissions),
        isSuperAdmin
      }
    };
  }
}
