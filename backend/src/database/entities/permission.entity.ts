import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';

@Entity('sys_permission', { comment: '权限表' })
export class Permission {
    @PrimaryGeneratedColumn({ type: 'bigint', comment: '权限ID' })
    id: number;

    @Column({ name: 'permission_name', length: 100, comment: '权限名称' })
    permissionName: string;

    @Column({ name: 'permission_key', length: 100, unique: true, comment: '权限标识' })
    permissionKey: string;

    @Column({ name: 'resource_type', length: 20, comment: '资源类型：menu-菜单，button-按钮，api-接口' })
    resourceType: string;

    @Column({ name: 'parent_id', type: 'bigint', default: 0, comment: '父级权限ID' })
    parentId: number;

    @Column({ type: 'tinyint', default: 1, comment: '状态：0-禁用，1-启用' })
    status: number;

    @CreateDateColumn({ name: 'create_time', type: 'datetime', comment: '创建时间' })
    createTime: Date;

    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[];
}
