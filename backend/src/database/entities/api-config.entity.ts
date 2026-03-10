import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('api_config', { comment: '接口配置表' })
export class ApiConfig {
    @PrimaryGeneratedColumn({ type: 'bigint', comment: '接口配置ID' })
    id: number;

    @Column({ name: 'template_id', type: 'bigint', nullable: true, comment: '关联模板ID' })
    templateId: number;

    @Column({ length: 100, comment: '接口名称' })
    name: string;

    @Column({ name: 'data_source_id', type: 'bigint', comment: '关联数据源ID' })
    dataSourceId: number;

    @Column({ name: 'query_type', length: 20, default: 'query', comment: '查询类型：query-SQL查询，raw-原生查询，api-外部API调用' })
    queryType: string;

    @Column({ name: 'query_content', type: 'text', comment: '查询内容' })
    queryContent: string;

    @Column({ name: 'params_mapping', type: 'json', nullable: true, comment: '参数映射（JSON格式）' })
    paramsMapping: any;

    @Column({ name: 'result_mapping', type: 'json', nullable: true, comment: '结果映射（JSON格式）' })
    resultMapping: any;

    @Column({ name: 'cache_config', type: 'json', nullable: true, comment: '缓存配置（JSON格式）' })
    cacheConfig: any;

    @Column({ length: 500, nullable: true, comment: '接口描述' })
    description: string;

    @Column({ name: 'create_user_id', type: 'bigint', comment: '创建用户ID' })
    createUserId: number;

    @CreateDateColumn({ name: 'create_time', type: 'datetime', comment: '创建时间' })
    createTime: Date;

    @UpdateDateColumn({ name: 'update_time', type: 'datetime', comment: '更新时间' })
    updateTime: Date;
}
