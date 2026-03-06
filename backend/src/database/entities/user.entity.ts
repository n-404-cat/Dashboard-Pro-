import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ length: 50, unique: true })
    username: string;

    @Column({ select: false })
    password: string;

    @Column({ length: 100, nullable: true })
    email: string;

    @Column({ length: 20, nullable: true })
    phone: string;

    @Column({ length: 50, nullable: true })
    nickname: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ type: 'tinyint', default: 1 })
    status: number; // 0: disabled, 1: enabled

    @Column({ name: 'last_login_time', type: 'datetime', nullable: true })
    lastLoginTime: Date;

    @Column({ name: 'last_login_ip', length: 50, nullable: true })
    lastLoginIp: string;

    @CreateDateColumn({ name: 'create_time', type: 'datetime' })
    createTime: Date;

    @UpdateDateColumn({ name: 'update_time', type: 'datetime' })
    updateTime: Date;

    @ManyToMany(() => Role, role => role.users)
    @JoinTable({
        name: 'sys_user_role',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
    })
    roles: Role[];
}
