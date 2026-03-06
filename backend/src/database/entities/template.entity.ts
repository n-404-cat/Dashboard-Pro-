import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('dash_template')
export class Template {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 50, nullable: true })
    industry: string;

    @Column({ length: 50, nullable: true })
    category: string;

    @Column({ length: 255, nullable: true })
    thumbnail: string;

    @Column({ name: 'layout_config', type: 'json' })
    layoutConfig: any;

    @Column({ name: 'is_published', type: 'tinyint', default: 0 })
    isPublished: number;

    @Column({ name: 'is_public', type: 'tinyint', default: 0 })
    isPublic: number;

    @Column({ name: 'view_count', type: 'int', default: 0 })
    viewCount: number;

    @Column({ name: 'create_user_id', type: 'bigint' })
    createUserId: number;

    @Column({ type: 'tinyint', default: 1 })
    status: number;

    @CreateDateColumn({ name: 'create_time', type: 'datetime' })
    createTime: Date;

    @UpdateDateColumn({ name: 'update_time', type: 'datetime' })
    updateTime: Date;
}
