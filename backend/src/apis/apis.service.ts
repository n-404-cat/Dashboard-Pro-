import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiConfig } from '../database/entities/api-config.entity';
import { DatasourcesService } from '../datasources/datasources.service';

@Injectable()
export class ApisService {
    constructor(
        @InjectRepository(ApiConfig)
        private readonly apiConfigRepository: Repository<ApiConfig>,
        private readonly datasourcesService: DatasourcesService
    ) { }

    async findByTemplateId(templateId: number) {
        const apis = await this.apiConfigRepository.find({
            where: { templateId },
            order: { createTime: 'DESC' }
        });
        return { list: apis };
    }

    async findAll(page: number = 1, pageSize: number = 20, queryType?: string, keyword?: string, templateId?: number) {
        const queryBuilder = this.apiConfigRepository.createQueryBuilder('apiConfig');

        if (templateId) {
            queryBuilder.andWhere('apiConfig.templateId = :templateId', { templateId });
        }

        if (queryType) {
            queryBuilder.andWhere('apiConfig.queryType = :queryType', { queryType });
        }

        if (keyword) {
            queryBuilder.andWhere('(apiConfig.name LIKE :keyword OR apiConfig.queryContent LIKE :keyword)', { keyword: `%${keyword}%` });
        }

        queryBuilder.orderBy('apiConfig.createTime', 'DESC');

        const total = await queryBuilder.getCount();
        const totalPages = Math.ceil(total / pageSize);
        const list = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getMany();

        return {
            list,
            pagination: { total, page: Number(page), pageSize: Number(pageSize), totalPages }
        };
    }

    async findOne(id: number) {
        const apiConfig = await this.apiConfigRepository.findOne({ where: { id } });
        if (!apiConfig) throw new NotFoundException('API config not found');
        return apiConfig;
    }

    async createForTemplate(templateId: number, data: Partial<ApiConfig>) {
        const datasource = await this.datasourcesService.findOne(data.dataSourceId);

        const apiConfig = this.apiConfigRepository.create({
            ...data,
            templateId,
            createTime: new Date()
        });
        return await this.apiConfigRepository.save(apiConfig);
    }

    async create(data: Partial<ApiConfig>) {
        if (data.dataSourceId) {
            await this.datasourcesService.findOne(data.dataSourceId);
        }

        const apiConfig = this.apiConfigRepository.create({
            ...data,
            paramsMapping: data.paramsMapping || null,
            resultMapping: data.resultMapping || null,
            cacheConfig: data.cacheConfig || null,
            createTime: new Date()
        });
        
        return await this.apiConfigRepository.save(apiConfig);
    }

    async update(id: number, data: Partial<ApiConfig>) {
        const apiConfig = await this.findOne(id);
        Object.assign(apiConfig, data);
        return await this.apiConfigRepository.save(apiConfig);
    }

    async remove(id: number) {
        const apiConfig = await this.findOne(id);
        await this.apiConfigRepository.remove(apiConfig);
        return { message: 'API config deleted successfully' };
    }

    async testApi(id: number, params?: any) {
        const apiConfig = await this.findOne(id);
        const datasource = await this.datasourcesService.findOne(apiConfig.dataSourceId);

        const startTime = Date.now();

        try {
            const result = await this.executeQuery(datasource, apiConfig, params);
            const responseTime = Date.now() - startTime;

            return {
                success: true,
                data: result,
                responseTime
            };
        } catch (error) {
            const responseTime = Date.now() - startTime;
            const errorMessage = error.message || 'API test failed';

            return {
                success: false,
                message: errorMessage,
                responseTime
            };
        }
    }

    private async executeQuery(datasource: any, apiConfig: ApiConfig, params?: any): Promise<any> {
        const { queryType, queryContent, paramsMapping, resultMapping } = apiConfig;

        let result: any;

        switch (queryType) {
            case 'query':
            case 'raw':
                // For SQL query, we pass params directly for now
                // Note: params should be an array for SQL parameters if using ? placeholders
                // If params is an object, it might need conversion depending on the query
                const sqlParams = Array.isArray(params) ? params : (params ? Object.values(params) : []);
                result = await this.datasourcesService.executeQuery(datasource.id, queryContent, sqlParams);
                break;
            case 'api':
                result = await this.datasourcesService.executeApi(datasource.id, queryContent, params);
                break;
            default:
                throw new BadRequestException(`Unsupported query type: ${queryType}`);
        }

        if (resultMapping) {
            result = this.applyResultMapping(result, resultMapping);
        }

        return result;
    }

    private applyResultMapping(data: any, mapping: any): any {
        return data;
    }
}
