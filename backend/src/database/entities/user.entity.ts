import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';

@Entity('sys_user')
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint', comment: '用户ID' })
    id: number;

    @Column({ length: 50, unique: true, comment: '用户名' })
    username: string;

    @Column({ select: false, comment: '密码' })
    password: string;

    @Column({ length: 100, nullable: true, comment: '邮箱' })
    email: string;

    @Column({ length: 20, nullable: true, comment: '手机号' })
    phone: string;

    @Column({ length: 50, nullable: true, comment: '昵称' })
    nickname: string;

    @Column({ nullable: true, comment: '头像' })
    avatar: string;

    @Column({ type: 'tinyint', default: 1, comment: '状态：0-禁用，1-启用' })
    status: number;

    @Column({ name: 'last_login_time', type: 'datetime', nullable: true, comment: '最后登录时间' })
    lastLoginTime: Date;

    @Column({ name: 'last_login_ip', length: 50, nullable: true, comment: '最后登录IP' })
    lastLoginIp: string;

    @CreateDateColumn({ name: 'create_time', type: 'datetime', comment: '创建时间' })
    createTime: Date;

    @UpdateDateColumn({ name: 'update_time', type: 'datetime', comment: '更新时间' })
    updateTime: Date;

    @ManyToMany(() => Role, role => role.users)
    @JoinTable({
        name: 'sys_user_role',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
    })
    roles: Role[];
}
