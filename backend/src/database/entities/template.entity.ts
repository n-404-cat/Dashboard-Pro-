import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('sys_template', { comment: '模板表' })
export class Template {
    @PrimaryGeneratedColumn({ type: 'bigint', comment: '模板ID' })
    id: number;

    @Column({ length: 100, comment: '模板名称' })
    name: string;

    @Column({ length: 50, comment: '所属行业' })
    industry: string;

    @Column({ length: 50, comment: '颜色主题' })
    color_theme: string;

    @Column({ length: 255, nullable: true, comment: '缩略图' })
    thumbnail: string;

    @Column({ type: 'int', default: 0, comment: '浏览次数' })
    views: number;

    @Column({ length: 20, default: 'draft', comment: '状态：published-已发布，draft-草稿，error-错误' })
    status: string;

    @Column({ type: 'text', nullable: true, comment: '配置信息（JSON格式）' })
    config: string;

    @CreateDateColumn({ name: 'create_time', type: 'datetime', comment: '创建时间' })
    createTime: Date;

    @UpdateDateColumn({ name: 'update_time', type: 'datetime', comment: '更新时间' })
    updateTime: Date;

    @DeleteDateColumn({ name: 'delete_time', type: 'datetime', select: false, comment: '删除时间' })
    deleteTime: Date;
}
