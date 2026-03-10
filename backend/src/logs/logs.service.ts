import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { OperationLog } from '../database/entities/operation-log.entity';

@Injectable()
export class LogsService {
    constructor(
        @InjectRepository(OperationLog)
        private readonly logRepository: Repository<OperationLog>,
    ) { }

    async create(data: Partial<OperationLog>): Promise<OperationLog> {
        const log = this.logRepository.create(data);
        return await this.logRepository.save(log);
    }

    async findAll(query: any) {
        const { page = 1, pageSize = 20, userId, module, startTime, endTime } = query;

        const where: any = {};
        if (userId) where.userId = userId;
        if (module) where.module = Like(`%${module}%`);
        if (startTime && endTime) {
            where.createTime = Between(new Date(startTime), new Date(endTime));
        }

        const [list, total] = await this.logRepository.findAndCount({
            where,
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

    async findOne(id: string) {
        return await this.logRepository.findOne({ where: { id: id as any } });
    }

    async removeAll() {
        return await this.logRepository.delete({});
    }
}
