import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, Role, Permission } from './database/entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) { }

    async onApplicationBootstrap() {
        await this.seedPermissions();
        await this.seedRoles();
        await this.seedAdminUser();
        console.log('Database seeding completed.');
    }

    private async seedPermissions() {
        const permissions = [
            // Dashboard
            { name: '数据概览', key: 'dashboard:view', type: 'menu', parentId: 0 },

            // Templates
            { name: '模板管理', key: 'templates:list', type: 'menu', parentId: 0 },
            { name: '模板新增', key: 'templates:create', type: 'button', parentId: 'templates:list' },
            { name: '模板编辑', key: 'templates:update', type: 'button', parentId: 'templates:list' },
            { name: '模板删除', key: 'templates:delete', type: 'button', parentId: 'templates:list' },

            // DataSources
            { name: '数据源管理', key: 'datasources:list', type: 'menu', parentId: 0 },
            { name: '数据源新增', key: 'datasources:create', type: 'button', parentId: 'datasources:list' },
            { name: '数据源编辑', key: 'datasources:update', type: 'button', parentId: 'datasources:list' },
            { name: '数据源删除', key: 'datasources:delete', type: 'button', parentId: 'datasources:list' },

            // APIs
            { name: '接口配置', key: 'apis:list', type: 'menu', parentId: 0 },
            { name: '接口新增', key: 'apis:create', type: 'button', parentId: 'apis:list' },
            { name: '接口编辑', key: 'apis:update', type: 'button', parentId: 'apis:list' },
            { name: '接口删除', key: 'apis:delete', type: 'button', parentId: 'apis:list' },

            // Users
            { name: '用户管理', key: 'users:list', type: 'menu', parentId: 0 },
            { name: '用户新增', key: 'users:create', type: 'button', parentId: 'users:list' },
            { name: '用户编辑', key: 'users:update', type: 'button', parentId: 'users:list' },
            { name: '用户删除', key: 'users:delete', type: 'button', parentId: 'users:list' },

            // Roles
            { name: '角色权限', key: 'roles:list', type: 'menu', parentId: 0 },
            { name: '角色新增', key: 'roles:create', type: 'button', parentId: 'roles:list' },
            { name: '角色编辑', key: 'roles:update', type: 'button', parentId: 'roles:list' },
            { name: '角色删除', key: 'roles:delete', type: 'button', parentId: 'roles:list' },

            // Settings
            { name: '系统配置', key: 'settings:view', type: 'menu', parentId: 0 },
            { name: '配置修改', key: 'settings:update', type: 'button', parentId: 'settings:view' },

            // Logs
            { name: '操作日志', key: 'logs:list', type: 'menu', parentId: 0 },
            { name: '日志清除', key: 'logs:delete', type: 'button', parentId: 'logs:list' },
        ];

        for (const p of permissions) {
            let parentId = 0;
            if (typeof p.parentId === 'string') {
                const parent = await this.permissionRepository.findOne({ where: { permissionKey: p.parentId } });
                parentId = parent ? Number(parent.id) : 0;
            }

            const existing = await this.permissionRepository.findOne({ where: { permissionKey: p.key } });
            if (!existing) {
                await this.permissionRepository.save(this.permissionRepository.create({
                    permissionName: p.name,
                    permissionKey: p.key,
                    resourceType: p.type,
                    parentId: parentId,
                    status: 1
                }));
            } else {
                // Update parentId and names if changed
                existing.permissionName = p.name;
                existing.parentId = parentId;
                existing.resourceType = p.type;
                await this.permissionRepository.save(existing);
            }
        }
    }

    private async seedRoles() {
        const adminRole = await this.roleRepository.findOne({ where: { roleKey: 'admin' } });
        if (!adminRole) {
            const role = this.roleRepository.create({
                roleName: '超级管理员',
                roleKey: 'admin',
                description: '拥有系统所有权限',
                status: 1
            });
            role.permissions = await this.permissionRepository.find();
            await this.roleRepository.save(role);
        } else {
            // Update admin role permissions to include all
            adminRole.permissions = await this.permissionRepository.find();
            await this.roleRepository.save(adminRole);
        }
    }

    private async seedAdminUser() {
        const admin = await this.userRepository.findOne({ where: { username: 'admin' }, relations: ['roles'] });
        const adminRole = await this.roleRepository.findOne({ where: { roleKey: 'admin' } });

        if (admin) {
            if (!admin.roles || !admin.roles.find(r => r.roleKey === 'admin')) {
                admin.roles = admin.roles || [];
                admin.roles.push(adminRole);
                await this.userRepository.save(admin);
            }
        } else {
            const password = await bcrypt.hash('password', 10);
            const newUser = this.userRepository.create({
                username: 'admin',
                password,
                nickname: '管理员',
                status: 1,
                roles: [adminRole]
            });
            await this.userRepository.save(newUser);
        }
    }
}
