import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role, Permission } from '../database/entities';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) { }

    async findAll() {
        return await this.roleRepository.find({
            relations: ['permissions'],
            order: { createTime: 'ASC' }
        });
    }

    async findOne(id: number) {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: ['permissions']
        });
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return role;
    }

    async create(data: any) {
        const { permissionIds, ...rest } = data;
        const existing = await this.roleRepository.findOne({ where: { roleKey: rest.roleKey } });
        if (existing) {
            throw new BadRequestException('Role key already exists');
        }

        const role = this.roleRepository.create(rest as object);
        if (permissionIds && permissionIds.length > 0) {
            role.permissions = await this.permissionRepository.find({
                where: { id: In(permissionIds) }
            });
        }
        return await this.roleRepository.save(role);
    }

    async update(id: number, data: any) {
        const { permissionIds, ...rest } = data;
        const role = await this.findOne(id);

        if (rest.roleKey && rest.roleKey !== role.roleKey) {
            const existing = await this.roleRepository.findOne({ where: { roleKey: rest.roleKey } });
            if (existing) {
                throw new BadRequestException('Role key already exists');
            }
        }

        Object.assign(role, rest);
        if (permissionIds) {
            role.permissions = await this.permissionRepository.find({
                where: { id: In(permissionIds) }
            });
        }

        return await this.roleRepository.save(role);
    }

    async remove(id: number) {
        const role = await this.findOne(id);
        if (role.roleKey === 'admin') {
            throw new BadRequestException('Super administrator role cannot be deleted');
        }
        return await this.roleRepository.remove(role);
    }

    async assignPermissions(id: number, permissionIds: number[]) {
        const role = await this.findOne(id);
        role.permissions = await this.permissionRepository.find({
            where: { id: In(permissionIds) }
        });
        return await this.roleRepository.save(role);
    }
}
