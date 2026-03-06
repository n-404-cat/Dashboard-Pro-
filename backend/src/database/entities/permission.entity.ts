import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';

@Entity('sys_permission')
export class Permission {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ name: 'permission_name', length: 100 })
    permissionName: string;

    @Column({ name: 'permission_key', length: 100, unique: true })
    permissionKey: string;

    @Column({ name: 'resource_type', length: 20 })
    resourceType: string; // menu, button, api

    @Column({ name: 'parent_id', type: 'bigint', default: 0 })
    parentId: number;

    @Column({ type: 'tinyint', default: 1 })
    status: number;

    @CreateDateColumn({ name: 'create_time', type: 'datetime' })
    createTime: Date;

    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[];
}
