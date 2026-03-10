# 数据库表结构文档

## 概述

本文档描述了 Dashboard-Pro- 项目的数据库表结构，包括所有表的用途和字段的详细说明。

## 数据库表列表

| 表名 | 说明 | 状态 |
|-----|------|-----|
| migrations | TypeORM 迁移记录表 | ✅ |
| sys_user | 用户表 | ✅ |
| sys_role | 角色表 | ✅ |
| sys_permission | 权限表 | ✅ |
| sys_user_role | 用户角色关联表 | ✅ |
| sys_role_permission | 角色权限关联表 | ✅ |
| sys_template | 模板表 | ✅ |
| api_config | 接口配置表 | ✅ |
| data_source | 数据源表 | ✅ |
| sys_operate_log | 操作日志表 | ✅ |

---

## 表结构详情

### 1. migrations (TypeORM 迁移记录表)

| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | INT | 主键ID |
| timestamp | BIGINT | 迁移时间戳 |
| name | VARCHAR(255) | 迁移文件名称 |

### 2. sys_user (用户表)

| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | BIGINT | 用户ID |
| username | VARCHAR(50) | 用户名 |
| password | VARCHAR(255) | 密码 |
| email | VARCHAR(100) | 邮箱 |
| phone | VARCHAR(20) | 手机号 |
| nickname | VARCHAR(50) | 昵称 |
| avatar | VARCHAR(255) | 头像 |
| status | TINYINT | 状态：0-禁用，1-启用 |
| last_login_time | DATETIME | 最后登录时间 |
| last_login_ip | VARCHAR(50) | 最后登录IP |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

### 3. sys_role (角色表)

| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | BIGINT | 角色ID |
| role_name | VARCHAR(50) | 角色名称 |
| role_key | VARCHAR(50) | 角色标识 |
| description | VARCHAR(255) | 角色描述 |
| status | TINYINT | 状态：0-禁用，1-启用 |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

### 4. sys_permission (权限表)

| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | BIGINT | 权限ID |
| permission_name | VARCHAR(100) | 权限名称 |
| permission_key | VARCHAR(100) | 权限标识 |
| resource_type | VARCHAR(20) | 资源类型：menu-菜单，button-按钮，api-接口 |
| parent_id | BIGINT | 父级权限ID |
| status | TINYINT | 状态：0-禁用，1-启用 |
| create_time | DATETIME | 创建时间 |

### 5. sys_user_role (用户角色关联表)

| 字段名 | 类型 | 说明 |
|-------|------|------|
| user_id | BIGINT | 用户ID |
| role_id | BIGINT | 角色ID |

**外键约束：**
- user_id → sys_user(id)
- role_id → sys_role(id)

### 6. sys_role_permission (角色权限关联表)

| 字段名 | 类型 | 说明 |
|-------|------|------|
| role_id | BIGINT | 角色ID |
| permission_id | BIGINT | 权限ID |

**外键约束：**
- role_id → sys_role(id)
- permission_id → sys_permission(id)

### 7. sys_template (模板表)

| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | BIGINT | 模板ID |
| name | VARCHAR(100) | 模板名称 |
| industry | VARCHAR(50) | 所属行业 |
| color_theme | VARCHAR(50) | 颜色主题 |
| thumbnail | VARCHAR(255) | 缩略图 |
| views | INT | 浏览次数 |
| status | VARCHAR(20) | 状态：published-已发布，draft-草稿，error-错误 |
| config | TEXT | 配置信息（JSON格式） |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |
| delete_time | DATETIME | 删除时间 |

### 8. api_config (接口配置表)

| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | BIGINT | 接口配置ID |
| template_id | BIGINT | 关联模板ID |
| name | VARCHAR(100) | 接口名称 |
| data_source_id | BIGINT | 关联数据源ID |
| query_type | VARCHAR(20) | 查询类型：query-SQL查询，raw-原生查询，api-外部API调用 |
| query_content | TEXT | 查询内容 |
| params_mapping | JSON | 参数映射（JSON格式） |
| result_mapping | JSON | 结果映射（JSON格式） |
| cache_config | JSON | 缓存配置（JSON格式） |
| description | VARCHAR(500) | 接口描述 |
| create_user_id | BIGINT | 创建用户ID |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

### 9. data_source (数据源表)

| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | BIGINT | 数据源ID |
| name | VARCHAR(100) | 数据源名称 |
| source_type | VARCHAR(30) | 数据源类型：mysql，postgresql，mongodb，redis，api |
| connection_config | JSON | 连接配置（JSON格式） |
| auth_config | JSON | 认证配置（JSON格式） |
| status | TINYINT | 状态：0-禁用，1-启用 |
| last_test_time | DATETIME | 最后测试时间 |
| last_test_result | TEXT | 最后测试结果（JSON格式） |
| description | VARCHAR(500) | 数据源描述 |
| create_user_id | BIGINT | 创建用户ID |
| create_time | DATETIME | 创建时间 |
| update_time | DATETIME | 更新时间 |

### 10. sys_operate_log (操作日志表)

| 字段名 | 类型 | 说明 |
|-------|------|------|
| id | BIGINT | 日志ID |
| user_id | BIGINT | 操作用户ID |
| username | VARCHAR(50) | 操作用户名 |
| module | VARCHAR(50) | 操作模块 |
| operation | VARCHAR(50) | 操作类型 |
| method | VARCHAR(200) | 请求方法 |
| request_url | VARCHAR(500) | 请求URL |
| request_params | TEXT | 请求参数 |
| response_result | TEXT | 响应结果 |
| ip_address | VARCHAR(50) | IP地址 |
| execute_time | INT | 执行时间（毫秒） |
| status_code | INT | 状态码 |
| error_msg | TEXT | 错误信息 |
| create_time | DATETIME | 创建时间 |

---

## 外键关系

| 表名 | 字段 | 引用表 | 引用字段 |
|-----|------|-------|---------|
| sys_user_role | user_id | sys_user | id |
| sys_user_role | role_id | sys_role | id |
| sys_role_permission | role_id | sys_role | id |
| sys_role_permission | permission_id | sys_permission | id |

---

## 索引

所有主键字段（id）都已自动创建索引。

---

## 注意事项

1. **状态字段说明**：
   - 用户、角色、权限、数据源表中的 status 字段：0 表示禁用，1 表示启用
   - 模板表中的 status 字段：published 表示已发布，draft 表示草稿，error 表示错误

2. **JSON 字段说明**：
   - api_config 表中的 params_mapping、result_mapping、cache_config 字段存储 JSON 格式数据
   - data_source 表中的 connection_config、auth_config 字段存储 JSON 格式数据
   - sys_template 表中的 config 字段存储 JSON 格式数据
   - data_source 表中的 last_test_result 字段存储 JSON 格式数据

3. **时间字段说明**：
   - create_time 表示记录创建时间
   - update_time 表示记录最后更新时间
   - delete_time 仅在 sys_template 表中存在，用于软删除

---

## 更新记录

| 日期 | 版本 | 更新内容 |
|-----|------|---------|
| 2026-03-09 | 1.0 | 初始版本，添加所有表和字段的注释 |
