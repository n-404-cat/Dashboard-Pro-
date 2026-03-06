import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { User, Role } from '../database/entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    async findAll(query: any) {
        const { page = 1, pageSize = 10, username, status } = query;

        const where: any = {};
        if (username) {
            where.username = Like(`%${username}%`);
        }
        if (status !== undefined && status !== '') {
            where.status = status;
        }

        const [list, total] = await this.userRepository.findAndCount({
            where,
            relations: ['roles'],
            order: { createTime: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            list,
            pagination: {
                total,
                page: Number(page),
                pageSize: Number(pageSize),
                totalPages: Math.ceil(total / pageSize),
            },
        };
    }

    async create(data: any) {
        const { roleIds, ...rest } = data;
        const existing = await this.userRepository.findOne({ where: { username: rest.username } });
        if (existing) {
            throw new BadRequestException('User already exists');
        }

        if (rest.password) {
            rest.password = await bcrypt.hash(rest.password, 10);
        }

        const user = this.userRepository.create(rest as object);
        if (roleIds && roleIds.length > 0) {
            user.roles = await this.roleRepository.find({
                where: { id: In(roleIds) }
            });
        }
        return await this.userRepository.save(user);
    }

    async update(id: number, data: any) {
        const { roleIds, ...rest } = data;
        const user = await this.userRepository.findOne({ where: { id }, relations: ['roles'] });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (rest.password) {
            delete rest.password; // Prevent password update via regular update endpoint
        }

        Object.assign(user, rest);
        if (roleIds) {
            user.roles = await this.roleRepository.find({
                where: { id: In(roleIds) }
            });
        }
        return await this.userRepository.save(user);
    }

    async changePassword(id: number, data: any) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!data.newPassword) {
            throw new BadRequestException('New password is required');
        }

        user.password = await bcrypt.hash(data.newPassword, 10);
        return await this.userRepository.save(user);
    }

    async remove(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.username === 'admin') {
            throw new BadRequestException('Super administrator cannot be deleted');
        }

        user.status = 0; // Disable instead of hard delete
        return await this.userRepository.save(user);
    }
}
