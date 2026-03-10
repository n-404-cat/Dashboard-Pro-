import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../database/entities/template.entity';

@Injectable()
export class TemplatesService implements OnModuleInit {
    constructor(
        @InjectRepository(Template)
        private readonly templateRepository: Repository<Template>
    ) { }

    async onModuleInit() {
        await this.seedTemplates();
    }

    async findAll(page: number = 1, pageSize: number = 10, industry?: string, status?: string) {
        const queryBuilder = this.templateRepository.createQueryBuilder('template');

        if (industry) {
            queryBuilder.andWhere('template.industry = :industry', { industry });
        }

        if (status) {
            queryBuilder.andWhere('template.status = :status', { status });
        }

        queryBuilder.orderBy('template.createTime', 'DESC');

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
        const template = await this.templateRepository.findOne({ where: { id } });
        if (!template) throw new NotFoundException('Template not found');
        return template;
    }

    async create(data: Partial<Template>) {
        // Provide defaults for required fields
        const template = this.templateRepository.create({
            ...data,
            color_theme: data.color_theme || 'blue',
            views: 0,
            status: data.status || 'draft'
        });
        return await this.templateRepository.save(template);
    }

    async update(id: number, data: Partial<Template>) {
        const template = await this.findOne(id);
        Object.assign(template, data);
        return await this.templateRepository.save(template);
    }

    async remove(id: number) {
        const template = await this.findOne(id);
        // Soft delete is handled by TypeORM's softRemove when DeleteDateColumn is present
        await this.templateRepository.softRemove(template);
        return { message: 'Template successfully deleted (soft delete)' };
    }

    private async seedTemplates() {
        // Count including soft-deleted ones so we never re-seed even if they deleted everything
        const count = await this.templateRepository.count({ withDeleted: true });
        if (count > 0) return;

        console.log('Seeding 20 diverse templates...');
        const baseTemplates: Partial<Template>[] = [
            // 零售类 (Retail)
            { name: '销售数据大屏', industry: 'retail', color_theme: 'blue', thumbnail: '📊', status: 'published', views: 1205 },
            { name: '门店业绩分析', industry: 'retail', color_theme: 'orange', thumbnail: '🏬', status: 'published', views: 890 },
            { name: '双十一战报看板', industry: 'retail', color_theme: 'red', thumbnail: '🛍️', status: 'published', views: 5040 },
            { name: '库存监控预警', industry: 'retail', color_theme: 'purple', thumbnail: '📦', status: 'draft', views: 0 },
            { name: '商品画像分析', industry: 'retail', color_theme: 'cyan', thumbnail: '👕', status: 'published', views: 320 },

            // 金融类 (Finance)
            { name: '实时监控看板', industry: 'finance', color_theme: 'green', thumbnail: '📈', status: 'published', views: 2400 },
            { name: '财务分析报告', industry: 'finance', color_theme: 'blue', thumbnail: '💰', status: 'published', views: 1850 },
            { name: '风控反欺诈大屏', industry: 'finance', color_theme: 'red', thumbnail: '🛡️', status: 'published', views: 960 },
            { name: '投资组合收益看板', industry: 'finance', color_theme: 'purple', thumbnail: '💹', status: 'draft', views: 0 },

            // 互联网/SaaS (Internet)
            { name: '数据分析看板', industry: 'internet', color_theme: 'purple', thumbnail: '📱', status: 'published', views: 4200 },
            { name: '用户核心指标看板', industry: 'internet', color_theme: 'blue', thumbnail: '👥', status: 'published', views: 3100 },
            { name: 'APP日活趋势', industry: 'internet', color_theme: 'cyan', thumbnail: '🚀', status: 'published', views: 1560 },
            { name: '流量漏斗转化', industry: 'internet', color_theme: 'orange', thumbnail: ' funnel', status: 'published', views: 2200 },

            // 制造类 (Manufacturing)
            { name: '生产线能效看板', industry: 'manufacturing', color_theme: 'orange', thumbnail: '🏭', status: 'published', views: 800 },
            { name: '设备健康预警', industry: 'manufacturing', color_theme: 'red', thumbnail: '⚙️', status: 'published', views: 650 },
            { name: '工业物联网中控台', industry: 'manufacturing', color_theme: 'blue', thumbnail: '🌐', status: 'draft', views: 0 },
            { name: '供应链物流追踪', industry: 'manufacturing', color_theme: 'green', thumbnail: '🚚', status: 'published', views: 430 },

            // 运维类 (Operations)
            { name: '服务器集群监控', industry: 'operations', color_theme: 'cyan', thumbnail: '🖥️', status: 'published', views: 1900 },
            { name: '全链路压测大屏', industry: 'operations', color_theme: 'purple', thumbnail: '⚡', status: 'error', views: 120 },
            { name: '云服务账单分析', industry: 'operations', color_theme: 'green', thumbnail: '🧾', status: 'published', views: 560 }
        ];

        const templates = this.templateRepository.create(baseTemplates);
        await this.templateRepository.save(templates);
        console.log(`Successfully seeded ${templates.length} templates.`);
    }
}
