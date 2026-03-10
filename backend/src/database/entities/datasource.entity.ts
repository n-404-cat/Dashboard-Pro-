import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('data_source', { comment: '数据源表' })
export class Datasource {
    @PrimaryGeneratedColumn({ type: 'bigint', comment: '数据源ID' })
    id: number;

    @Column({ length: 100, comment: '数据源名称' })
    name: string;

    @Column({ name: 'source_type', length: 30, comment: '数据源类型：mysql，postgresql，mongodb，redis，api' })
    sourceType: string;

    @Column({ name: 'connection_config', type: 'json', comment: '连接配置（JSON格式）' })
    connectionConfig: any;

    @Column({ name: 'auth_config', type: 'json', nullable: true, comment: '认证配置（JSON格式）' })
    authConfig: any;

    @Column({ type: 'tinyint', default: 1, comment: '状态：0-禁用，1-启用' })
    status: number;

    @Column({ name: 'last_test_time', type: 'datetime', nullable: true, comment: '最后测试时间' })
    lastTestTime: Date;

    @Column({ name: 'last_test_result', type: 'text', nullable: true, comment: '最后测试结果（JSON格式）' })
    lastTestResult: string;

    @Column({ length: 500, nullable: true, comment: '数据源描述' })
    description: string;

    @Column({ name: 'create_user_id', type: 'bigint', comment: '创建用户ID' })
    createUserId: number;

    @CreateDateColumn({ name: 'create_time', type: 'datetime', comment: '创建时间' })
    createTime: Date;

    @UpdateDateColumn({ name: 'update_time', type: 'datetime', comment: '更新时间' })
    updateTime: Date;
}

// 数据源连接配置接口定义
export interface DataSourceConnectionConfig {
    // 通用字段
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    
    // 数据库特定字段
    database?: string;
    url?: string;
    uri?: string;
    
    // SSH配置
    sshConfig?: {
        host: string;
        port: number;
        username: string;
        authType: 'password' | 'key';
        password?: string;
        privateKey?: string;
        keyPassword?: string;
    };
}

// 数据源认证配置接口定义
export interface DataSourceAuthConfig {
    // SSH密码认证
    sshPassword?: string;
    // SSH密钥密码
    sshKeyPassword?: string;
    // API认证头
    apiAuthHeader?: string;
    // 其他认证配置
    [key: string]: any;
}
