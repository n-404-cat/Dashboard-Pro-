import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Permission } from '../database/entities';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) { }

    async findAll() {
        return await this.permissionRepository.find({
            order: { parentId: 'ASC', id: 'ASC' }
        });
    }

    async getTree() {
        const all = await this.findAll();
        return this.buildTree(all, 0);
    }

    private buildTree(permissions: Permission[], parentId: number) {
        return permissions
            .filter(p => Number(p.parentId) === parentId)
            .map(p => ({
                ...p,
                children: this.buildTree(permissions, Number(p.id))
            }));
    }

    async findByIds(ids: number[]) {
        return await this.permissionRepository.find({
            where: { id: In(ids) }
        });
    }
}
