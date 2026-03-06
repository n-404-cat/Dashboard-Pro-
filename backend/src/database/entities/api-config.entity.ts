import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('api_config')
export class ApiConfig {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ name: 'template_id', type: 'bigint', nullable: true })
    templateId: number;

    @Column({ length: 100 })
    name: string;

    @Column({ name: 'data_source_id', type: 'bigint' })
    dataSourceId: number;

    @Column({ name: 'query_type', length: 20, default: 'query' })
    queryType: string;

    @Column({ name: 'query_content', type: 'text' })
    queryContent: string;

    @Column({ name: 'params_mapping', type: 'json', nullable: true })
    paramsMapping: any;

    @Column({ name: 'result_mapping', type: 'json', nullable: true })
    resultMapping: any;

    @Column({ name: 'cache_config', type: 'json', nullable: true })
    cacheConfig: any;

    @Column({ length: 500, nullable: true })
    description: string;

    @Column({ name: 'create_user_id', type: 'bigint' })
    createUserId: number;

    @CreateDateColumn({ name: 'create_time', type: 'datetime' })
    createTime: Date;

    @UpdateDateColumn({ name: 'update_time', type: 'datetime' })
    updateTime: Date;
}
