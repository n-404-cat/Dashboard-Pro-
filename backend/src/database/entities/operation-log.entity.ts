import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sys_operate_log', { comment: '操作日志表' })
export class OperationLog {
    @PrimaryGeneratedColumn({ type: 'bigint', comment: '日志ID' })
    id: number;

    @Column({ name: 'user_id', type: 'bigint', nullable: true, comment: '操作用户ID' })
    userId: number;

    @Column({ length: 50, nullable: true, comment: '操作用户名' })
    username: string;

    @Column({ length: 50, nullable: true, comment: '操作模块' })
    module: string;

    @Column({ length: 50, nullable: true, comment: '操作类型' })
    operation: string;

    @Column({ length: 200, nullable: true, comment: '请求方法' })
    method: string;

    @Column({ name: 'request_url', length: 500, nullable: true, comment: '请求URL' })
    requestUrl: string;

    @Column({ name: 'request_params', type: 'text', nullable: true, comment: '请求参数' })
    requestParams: string;

    @Column({ name: 'response_result', type: 'text', nullable: true, comment: '响应结果' })
    responseResult: string;

    @Column({ name: 'ip_address', length: 50, nullable: true, comment: 'IP地址' })
    ipAddress: string;

    @Column({ name: 'execute_time', type: 'int', nullable: true, comment: '执行时间（毫秒）' })
    executeTime: number;

    @Column({ name: 'status_code', type: 'int', nullable: true, comment: '状态码' })
    statusCode: number;

    @Column({ name: 'error_msg', type: 'text', nullable: true, comment: '错误信息' })
    errorMsg: string;

    @CreateDateColumn({ name: 'create_time', type: 'datetime', comment: '创建时间' })
    createTime: Date;
}
