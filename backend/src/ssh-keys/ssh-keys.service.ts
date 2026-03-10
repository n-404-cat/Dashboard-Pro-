import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SshKey } from '../database/entities/ssh-key.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class SshKeysService {
    private readonly logger = new Logger(SshKeysService.name);

    constructor(
        @InjectRepository(SshKey)
        private readonly sshKeyRepository: Repository<SshKey>
    ) { }

    async findAll(page: number = 1, pageSize: number = 20, status?: number) {
        this.logger.log(`findAll called with page=${page}, pageSize=${pageSize}, status=${status}`);
        
        try {
            const queryBuilder = this.sshKeyRepository.createQueryBuilder('sshKey');

            if (status !== undefined) {
                queryBuilder.andWhere('sshKey.status = :status', { status });
            }

            queryBuilder.orderBy('sshKey.createTime', 'DESC');

            const total = await queryBuilder.getCount();
            const totalPages = Math.ceil(total / pageSize);
            const list = await queryBuilder
                .skip((page - 1) * pageSize)
                .take(pageSize)
                .getMany();

            this.logger.log(`Found ${list.length} SSH keys`);

            // 隐藏私钥内容，只返回基本信息
            const sanitizedList = list.map(key => ({
                ...key,
                privateKey: '***HIDDEN***',
                keyPassword: '***HIDDEN***'
            }));

            return {
                list: sanitizedList,
                pagination: { total, page: Number(page), pageSize: Number(pageSize), totalPages }
            };
        } catch (error) {
            this.logger.error(`Error in findAll: ${error.message}`, error.stack);
            throw error;
        }
    }

    async findOne(id: number) {
        const sshKey = await this.sshKeyRepository.findOne({ where: { id } });
        if (!sshKey) throw new NotFoundException('SSH key not found');
        
        // 返回完整密钥信息用于使用
        return sshKey;
    }

    async create(data: Partial<SshKey>, createUserId: number) {
        this.logger.log(`create called with data:`, data);
        
        try {
            const sshKey = this.sshKeyRepository.create({
                ...data,
                status: data.status ?? 1,
                createUserId,
                createTime: new Date()
            });
            
            const saved = await this.sshKeyRepository.save(sshKey);
            this.logger.log(`SSH key created successfully with id: ${saved.id}`);
            return saved;
        } catch (error) {
            this.logger.error(`Error in create: ${error.message}`, error.stack);
            throw error;
        }
    }

    async update(id: number, data: Partial<SshKey>) {
        const sshKey = await this.findOne(id);
        
        // 如果更新私钥内容，需要验证
        if (data.privateKey && data.privateKey !== sshKey.privateKey) {
            // 可以添加密钥格式验证
            if (!this.validatePrivateKey(data.privateKey)) {
                throw new BadRequestException('Invalid SSH private key format');
            }
        }
        
        Object.assign(sshKey, data);
        return await this.sshKeyRepository.save(sshKey);
    }

    async remove(id: number) {
        const sshKey = await this.findOne(id);
        await this.sshKeyRepository.remove(sshKey);
        return { message: 'SSH key deleted successfully' };
    }

    // 验证私钥格式
    private validatePrivateKey(privateKey: string): boolean {
        try {
            const key = privateKey.trim();
            if (key.length < 50) return false;
            
            // 检查常见的私钥标识
            const validPatterns = [
                '-----BEGIN RSA PRIVATE KEY-----',
                '-----BEGIN PRIVATE KEY-----',
                '-----BEGIN OPENSSH PRIVATE KEY-----',
                '-----BEGIN EC PRIVATE KEY-----',
                '-----BEGIN DSA PRIVATE KEY-----'
            ];
            
            return validPatterns.some(pattern => key.includes(pattern));
        } catch (error) {
            return false;
        }
    }
}