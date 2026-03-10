import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ssh_key', { comment: 'SSH密钥表' })
export class SshKey {
    @PrimaryGeneratedColumn({ type: 'bigint', comment: '密钥ID' })
    id: number;

    @Column({ length: 100, comment: '密钥名称' })
    name: string;

    @Column({ name: 'privateKey', type: 'text', comment: '私钥内容' })
    privateKey: string;

    @Column({ name: 'key_password', length: 255, nullable: true, comment: '密钥密码（可选）' })
    keyPassword: string;

    @Column({ length: 100, nullable: true, comment: '用户名（可选，用于记录密钥对应的SSH用户）' })
    username: string;

    @Column({ type: 'text', nullable: true, comment: '备注' })
    description: string;

    @Column({ type: 'tinyint', default: 1, comment: '状态：0-禁用，1-启用' })
    status: number;

    @Column({ name: 'create_user_id', type: 'bigint', comment: '创建用户ID' })
    createUserId: number;

    @CreateDateColumn({ name: 'create_time', type: 'datetime', comment: '创建时间' })
    createTime: Date;

    @UpdateDateColumn({ name: 'update_time', type: 'datetime', comment: '更新时间' })
    updateTime: Date;
}