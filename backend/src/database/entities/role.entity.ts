import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';

@Entity('sys_role', { comment: '角色表' })
export class Role {
    @PrimaryGeneratedColumn({ type: 'bigint', comment: '角色ID' })
    id: number;

    @Column({ name: 'role_name', length: 50, comment: '角色名称' })
    roleName: string;

    @Column({ name: 'role_key', length: 50, unique: true, comment: '角色标识' })
    roleKey: string;

    @Column({ length: 255, nullable: true, comment: '角色描述' })
    description: string;

    @Column({ type: 'tinyint', default: 1, comment: '状态：0-禁用，1-启用' })
    status: number;

    @CreateDateColumn({ name: 'create_time', type: 'datetime', comment: '创建时间' })
    createTime: Date;

    @UpdateDateColumn({ name: 'update_time', type: 'datetime', comment: '更新时间' })
    updateTime: Date;

    @ManyToMany(() => User, user => user.roles)
    users: User[];

    @ManyToMany(() => Permission, permission => permission.roles)
    @JoinTable({
        name: 'sys_role_permission',
        joinColumn: { name: 'role_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' }
    })
    permissions: Permission[];
}
