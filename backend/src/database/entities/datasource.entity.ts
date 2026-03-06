import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('data_source')
export class Datasource {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ name: 'source_type', length: 30 })
    sourceType: string;

    @Column({ name: 'connection_config', type: 'json' })
    connectionConfig: any;

    @Column({ name: 'auth_config', type: 'json', nullable: true })
    authConfig: any;

    @Column({ type: 'tinyint', default: 1 })
    status: number;

    @Column({ name: 'last_test_time', type: 'datetime', nullable: true })
    lastTestTime: Date;

    @Column({ name: 'last_test_result', type: 'text', nullable: true })
    lastTestResult: string;

    @Column({ length: 500, nullable: true })
    description: string;

    @Column({ name: 'create_user_id', type: 'bigint' })
    createUserId: number;

    @CreateDateColumn({ name: 'create_time', type: 'datetime' })
    createTime: Date;

    @UpdateDateColumn({ name: 'update_time', type: 'datetime' })
    updateTime: Date;
}
