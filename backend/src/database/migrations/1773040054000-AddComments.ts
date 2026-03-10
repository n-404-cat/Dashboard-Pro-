import { MigrationInterface, QueryRunner } from "typeorm";

export class AddComments1773040054000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE sys_role_permission DROP FOREIGN KEY FK_cafe50ffac8beaf0e03bc9a474c`);
        await queryRunner.query(`ALTER TABLE sys_role_permission DROP FOREIGN KEY FK_212c96df7321e7be66634bb554c`);

        await queryRunner.query(`ALTER TABLE sys_user COMMENT = '用户表'`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN id BIGINT COMMENT '用户ID'`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN username VARCHAR(50) COMMENT '用户名'`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN password VARCHAR(255) COMMENT '密码'`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN email VARCHAR(100) COMMENT '邮箱'`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN phone VARCHAR(20) COMMENT '手机号'`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN nickname VARCHAR(50) COMMENT '昵称'`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN avatar VARCHAR(255) COMMENT '头像'`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN status TINYINT COMMENT '状态：0-禁用，1-启用'`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN last_login_time DATETIME COMMENT '最后登录时间'`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN last_login_ip VARCHAR(50) COMMENT '最后登录IP'`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN create_time DATETIME COMMENT '创建时间'`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN update_time DATETIME COMMENT '更新时间'`);

        await queryRunner.query(`ALTER TABLE sys_role COMMENT = '角色表'`);
        await queryRunner.query(`ALTER TABLE sys_role MODIFY COLUMN id BIGINT COMMENT '角色ID'`);
        await queryRunner.query(`ALTER TABLE sys_role MODIFY COLUMN role_name VARCHAR(50) COMMENT '角色名称'`);
        await queryRunner.query(`ALTER TABLE sys_role MODIFY COLUMN role_key VARCHAR(50) COMMENT '角色标识'`);
        await queryRunner.query(`ALTER TABLE sys_role MODIFY COLUMN description VARCHAR(255) COMMENT '角色描述'`);
        await queryRunner.query(`ALTER TABLE sys_role MODIFY COLUMN status TINYINT COMMENT '状态：0-禁用，1-启用'`);
        await queryRunner.query(`ALTER TABLE sys_role MODIFY COLUMN create_time DATETIME COMMENT '创建时间'`);
        await queryRunner.query(`ALTER TABLE sys_role MODIFY COLUMN update_time DATETIME COMMENT '更新时间'`);

        await queryRunner.query(`ALTER TABLE sys_permission COMMENT = '权限表'`);
        await queryRunner.query(`ALTER TABLE sys_permission MODIFY COLUMN id BIGINT COMMENT '权限ID'`);
        await queryRunner.query(`ALTER TABLE sys_permission MODIFY COLUMN permission_name VARCHAR(100) COMMENT '权限名称'`);
        await queryRunner.query(`ALTER TABLE sys_permission MODIFY COLUMN permission_key VARCHAR(100) COMMENT '权限标识'`);
        await queryRunner.query(`ALTER TABLE sys_permission MODIFY COLUMN resource_type VARCHAR(20) COMMENT '资源类型：menu-菜单，button-按钮，api-接口'`);
        await queryRunner.query(`ALTER TABLE sys_permission MODIFY COLUMN parent_id BIGINT COMMENT '父级权限ID'`);
        await queryRunner.query(`ALTER TABLE sys_permission MODIFY COLUMN status TINYINT COMMENT '状态：0-禁用，1-启用'`);
        await queryRunner.query(`ALTER TABLE sys_permission MODIFY COLUMN create_time DATETIME COMMENT '创建时间'`);

        await queryRunner.query(`ALTER TABLE sys_template COMMENT = '模板表'`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN id BIGINT COMMENT '模板ID'`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN name VARCHAR(100) COMMENT '模板名称'`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN industry VARCHAR(50) COMMENT '所属行业'`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN color_theme VARCHAR(50) COMMENT '颜色主题'`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN thumbnail VARCHAR(255) COMMENT '缩略图'`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN views INT COMMENT '浏览次数'`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN status VARCHAR(20) COMMENT '状态：published-已发布，draft-草稿，error-错误'`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN config TEXT COMMENT '配置信息（JSON格式）'`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN create_time DATETIME COMMENT '创建时间'`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN update_time DATETIME COMMENT '更新时间'`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN delete_time DATETIME COMMENT '删除时间'`);

        await queryRunner.query(`ALTER TABLE api_config COMMENT = '接口配置表'`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN id BIGINT COMMENT '接口配置ID'`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN template_id BIGINT COMMENT '关联模板ID'`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN name VARCHAR(100) COMMENT '接口名称'`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN data_source_id BIGINT COMMENT '关联数据源ID'`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN query_type VARCHAR(20) COMMENT '查询类型：query-SQL查询，raw-原生查询，api-外部API调用'`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN query_content TEXT COMMENT '查询内容'`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN params_mapping JSON COMMENT '参数映射（JSON格式）'`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN result_mapping JSON COMMENT '结果映射（JSON格式）'`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN cache_config JSON COMMENT '缓存配置（JSON格式）'`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN description VARCHAR(500) COMMENT '接口描述'`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN create_user_id BIGINT COMMENT '创建用户ID'`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN create_time DATETIME COMMENT '创建时间'`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN update_time DATETIME COMMENT '更新时间'`);

        await queryRunner.query(`ALTER TABLE data_source COMMENT = '数据源表'`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN id BIGINT COMMENT '数据源ID'`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN name VARCHAR(100) COMMENT '数据源名称'`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN source_type VARCHAR(30) COMMENT '数据源类型：mysql，postgresql，mongodb，redis，api'`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN connection_config JSON COMMENT '连接配置（JSON格式）'`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN auth_config JSON COMMENT '认证配置（JSON格式）'`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN status TINYINT COMMENT '状态：0-禁用，1-启用'`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN last_test_time DATETIME COMMENT '最后测试时间'`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN last_test_result TEXT COMMENT '最后测试结果（JSON格式）'`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN description VARCHAR(500) COMMENT '数据源描述'`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN create_user_id BIGINT COMMENT '创建用户ID'`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN create_time DATETIME COMMENT '创建时间'`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN update_time DATETIME COMMENT '更新时间'`);

        await queryRunner.query(`ALTER TABLE sys_operate_log COMMENT = '操作日志表'`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN id BIGINT COMMENT '日志ID'`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN user_id BIGINT COMMENT '操作用户ID'`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN username VARCHAR(50) COMMENT '操作用户名'`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN module VARCHAR(50) COMMENT '操作模块'`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN operation VARCHAR(50) COMMENT '操作类型'`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN method VARCHAR(200) COMMENT '请求方法'`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN request_url VARCHAR(500) COMMENT '请求URL'`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN request_params TEXT COMMENT '请求参数'`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN response_result TEXT COMMENT '响应结果'`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN ip_address VARCHAR(50) COMMENT 'IP地址'`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN execute_time INT COMMENT '执行时间（毫秒）'`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN status_code INT COMMENT '状态码'`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN error_msg TEXT COMMENT '错误信息'`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN create_time DATETIME COMMENT '创建时间'`);

        await queryRunner.query(`ALTER TABLE sys_user_role COMMENT = '用户角色关联表'`);
        await queryRunner.query(`ALTER TABLE sys_user_role MODIFY COLUMN user_id BIGINT COMMENT '用户ID'`);
        await queryRunner.query(`ALTER TABLE sys_user_role MODIFY COLUMN role_id BIGINT COMMENT '角色ID'`);

        await queryRunner.query(`ALTER TABLE sys_role_permission COMMENT = '角色权限关联表'`);
        await queryRunner.query(`ALTER TABLE sys_role_permission MODIFY COLUMN role_id BIGINT COMMENT '角色ID'`);
        await queryRunner.query(`ALTER TABLE sys_role_permission MODIFY COLUMN permission_id BIGINT COMMENT '权限ID'`);

        await queryRunner.query(`ALTER TABLE sys_role_permission ADD CONSTRAINT FK_cafe50ffac8beaf0e03bc9a474c FOREIGN KEY (role_id) REFERENCES sys_role(id)`);
        await queryRunner.query(`ALTER TABLE sys_role_permission ADD CONSTRAINT FK_212c96df7321e7be66634bb554c FOREIGN KEY (permission_id) REFERENCES sys_permission(id)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE sys_user COMMENT = ''`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN id BIGINT`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN username VARCHAR(50)`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN password VARCHAR(255)`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN email VARCHAR(100)`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN phone VARCHAR(20)`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN nickname VARCHAR(50)`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN avatar VARCHAR(255)`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN status TINYINT`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN last_login_time DATETIME`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN last_login_ip VARCHAR(50)`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN create_time DATETIME`);
        await queryRunner.query(`ALTER TABLE sys_user MODIFY COLUMN update_time DATETIME`);

        await queryRunner.query(`ALTER TABLE sys_role COMMENT = ''`);
        await queryRunner.query(`ALTER TABLE sys_role MODIFY COLUMN id BIGINT`);
        await queryRunner.query(`ALTER TABLE sys_role MODIFY COLUMN role_name VARCHAR(50)`);
        await queryRunner.query(`ALTER TABLE sys_role MODIFY COLUMN role_key VARCHAR(50)`);
        await queryRunner.query(`ALTER TABLE sys_role MODIFY COLUMN description VARCHAR(255)`);
        await queryRunner.query(`ALTER TABLE sys_role MODIFY COLUMN status TINYINT`);
        await queryRunner.query(`ALTER TABLE sys_role MODIFY COLUMN create_time DATETIME`);
        await queryRunner.query(`ALTER TABLE sys_role MODIFY COLUMN update_time DATETIME`);

        await queryRunner.query(`ALTER TABLE sys_permission COMMENT = ''`);
        await queryRunner.query(`ALTER TABLE sys_permission MODIFY COLUMN id BIGINT`);
        await queryRunner.query(`ALTER TABLE sys_permission MODIFY COLUMN permission_name VARCHAR(100)`);
        await queryRunner.query(`ALTER TABLE sys_permission MODIFY COLUMN permission_key VARCHAR(100)`);
        await queryRunner.query(`ALTER TABLE sys_permission MODIFY COLUMN resource_type VARCHAR(20)`);
        await queryRunner.query(`ALTER TABLE sys_permission MODIFY COLUMN parent_id BIGINT`);
        await queryRunner.query(`ALTER TABLE sys_permission MODIFY COLUMN status TINYINT`);
        await queryRunner.query(`ALTER TABLE sys_permission MODIFY COLUMN create_time DATETIME`);

        await queryRunner.query(`ALTER TABLE sys_template COMMENT = ''`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN id BIGINT`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN name VARCHAR(100)`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN industry VARCHAR(50)`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN color_theme VARCHAR(50)`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN thumbnail VARCHAR(255)`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN views INT`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN status VARCHAR(20)`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN config TEXT`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN create_time DATETIME`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN update_time DATETIME`);
        await queryRunner.query(`ALTER TABLE sys_template MODIFY COLUMN delete_time DATETIME`);

        await queryRunner.query(`ALTER TABLE api_config COMMENT = ''`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN id BIGINT`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN template_id BIGINT`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN name VARCHAR(100)`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN data_source_id BIGINT`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN query_type VARCHAR(20)`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN query_content TEXT`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN params_mapping JSON`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN result_mapping JSON`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN cache_config JSON`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN description VARCHAR(500)`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN create_user_id BIGINT`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN create_time DATETIME`);
        await queryRunner.query(`ALTER TABLE api_config MODIFY COLUMN update_time DATETIME`);

        await queryRunner.query(`ALTER TABLE data_source COMMENT = ''`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN id BIGINT`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN name VARCHAR(100)`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN source_type VARCHAR(30)`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN connection_config JSON`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN auth_config JSON`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN status TINYINT`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN last_test_time DATETIME`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN last_test_result TEXT`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN description VARCHAR(500)`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN create_user_id BIGINT`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN create_time DATETIME`);
        await queryRunner.query(`ALTER TABLE data_source MODIFY COLUMN update_time DATETIME`);

        await queryRunner.query(`ALTER TABLE sys_operate_log COMMENT = ''`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN id BIGINT`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN user_id BIGINT`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN username VARCHAR(50)`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN module VARCHAR(50)`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN operation VARCHAR(50)`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN method VARCHAR(200)`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN request_url VARCHAR(500)`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN request_params TEXT`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN response_result TEXT`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN ip_address VARCHAR(50)`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN execute_time INT`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN status_code INT`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN error_msg TEXT`);
        await queryRunner.query(`ALTER TABLE sys_operate_log MODIFY COLUMN create_time DATETIME`);

        await queryRunner.query(`ALTER TABLE sys_user_role COMMENT = ''`);
        await queryRunner.query(`ALTER TABLE sys_user_role MODIFY COLUMN user_id BIGINT`);
        await queryRunner.query(`ALTER TABLE sys_user_role MODIFY COLUMN role_id BIGINT`);

        await queryRunner.query(`ALTER TABLE sys_role_permission COMMENT = ''`);
        await queryRunner.query(`ALTER TABLE sys_role_permission MODIFY COLUMN role_id BIGINT`);
        await queryRunner.query(`ALTER TABLE sys_role_permission MODIFY COLUMN permission_id BIGINT`);
    }
}
