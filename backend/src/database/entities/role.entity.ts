import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';

@Entity('sys_role')
export class Role {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ name: 'role_name', length: 50 })
    roleName: string;

    @Column({ name: 'role_key', length: 50, unique: true })
    roleKey: string;

    @Column({ length: 255, nullable: true })
    description: string;

    @Column({ type: 'tinyint', default: 1 })
    status: number;

    @CreateDateColumn({ name: 'create_time', type: 'datetime' })
    createTime: Date;

    @UpdateDateColumn({ name: 'update_time', type: 'datetime' })
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
