import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sys_operate_log')
export class OperationLog {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ name: 'user_id', type: 'bigint', nullable: true })
    userId: number;

    @Column({ length: 50, nullable: true })
    username: string;

    @Column({ length: 50, nullable: true })
    module: string;

    @Column({ length: 50, nullable: true })
    operation: string;

    @Column({ length: 200, nullable: true })
    method: string;

    @Column({ name: 'request_url', length: 500, nullable: true })
    requestUrl: string;

    @Column({ name: 'request_params', type: 'text', nullable: true })
    requestParams: string;

    @Column({ name: 'response_result', type: 'text', nullable: true })
    responseResult: string;

    @Column({ name: 'ip_address', length: 50, nullable: true })
    ipAddress: string;

    @Column({ name: 'execute_time', type: 'int', nullable: true })
    executeTime: number;

    @Column({ name: 'status_code', type: 'int', nullable: true })
    statusCode: number;

    @Column({ name: 'error_msg', type: 'text', nullable: true })
    errorMsg: string;

    @CreateDateColumn({ name: 'create_time', type: 'datetime' })
    createTime: Date;
}
