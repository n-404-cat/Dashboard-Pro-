# API接口文档

## 一、接口概述

### 1.1 接口说明

本文档详细描述了数据大屏管理系统的所有API接口。接口采用RESTful风格设计，遵循统一的接口规范和数据格式。系统API分为多个功能模块，包括认证授权、用户管理、模板管理、数据源管理、接口配置、数据获取和系统管理。

所有接口的请求和响应均采用JSON格式进行数据交换。接口URL遵循统一的命名规范，使用名词复数形式表示资源集合。请求方法根据操作类型选择，GET用于查询，POST用于创建，PUT用于更新，DELETE用于删除。

接口安全方面，除公开接口外，所有业务接口都需要进行身份认证。认证采用JWT Token方式，客户端需要在请求Header中携带有效的访问令牌。对于敏感操作，系统还会进行权限验证，确保用户只能操作自己有权限的资源。

### 1.2 基础信息

| 项目 | 说明 |
|-----|------|
| 基础URL | https://api.dashboard-pro.com/v1 |
| 通信协议 | HTTPS |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |
| 认证方式 | Bearer Token |

### 1.3 通用响应格式

所有接口响应遵循统一的格式规范：

成功响应格式如下：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 业务数据
  },
  "timestamp": 1704067200000,
  "requestId": "req_abc123"
}
```

分页响应格式如下：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [],
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 20,
      "totalPages": 5
    }
  },
  "timestamp": 1704067200000,
  "requestId": "req_abc123"
}
```

错误响应格式如下：

```json
{
  "code": 400,
  "message": "请求参数错误",
  "details": {
    "field": "username",
    "reason": "用户名不能为空"
  },
  "timestamp": 1704067200000,
  "requestId": "req_abc123"
}
```

### 1.4 状态码说明

| 状态码 | 说明 |
|-------|------|
| 200 | 请求成功 |
| 201 | 资源创建成功 |
| 204 | 删除成功，无返回内容 |
| 400 | 请求参数错误 |
| 401 | 未授权，Token无效或过期 |
| 403 | 禁止访问，权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突，如用户名已存在 |
| 422 | 业务验证失败 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |
| 503 | 服务不可用 |

## 二、认证接口

### 2.1 用户登录

用户登录接口用于获取访问令牌，是所有业务接口的入口。

**请求地址**：POST /auth/login

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**请求示例**：

```json
{
  "username": "admin",
  "password": "password123"
}
```

**响应结果**：

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200,
    "tokenType": "Bearer",
    "userInfo": {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "email": "admin@example.com",
      "roles": ["admin"]
    }
  }
}
```

**错误码**：

| 错误码 | 说明 |
|-------|------|
| 401001 | 用户名或密码错误 |
| 401002 | 账号已被禁用 |
| 401003 | 登录尝试次数过多，请稍后重试 |

### 2.2 刷新Token

刷新Token接口用于获取新的访问令牌，延长登录状态。

**请求地址**：POST /auth/refresh

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| refreshToken | string | 是 | 刷新令牌 |

**请求示例**：

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应结果**：

```json
{
  "code": 200,
  "message": "Token刷新成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 7200,
    "tokenType": "Bearer"
  }
}
```

### 2.3 用户登出

用户登出接口用于使当前Token失效。

**请求地址**：POST /auth/logout

**请求Header**：

| 参数名称 | 必填 | 说明 |
|---------|-----|------|
| Authorization | 是 | Bearer Token |

**响应结果**：

```json
{
  "code": 200,
  "message": "登出成功"
}
```

### 2.4 获取当前用户信息

获取当前登录用户的详细信息。

**请求地址**：GET /auth/me

**请求Header**：

| 参数名称 | 必填 | 说明 |
|---------|-----|------|
| Authorization | 是 | Bearer Token |

**响应结果**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "email": "admin@example.com",
    "phone": "13800138000",
    "avatar": "https://example.com/avatar.jpg",
    "roles": ["admin"],
    "permissions": ["template:create", "template:edit", "template:delete"],
    "createTime": "2024-01-01T00:00:00Z"
  }
}
```

## 三、用户管理接口

### 3.1 用户列表

获取用户列表，支持分页和条件筛选。

**请求地址**：GET /users

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| page | int | 否 | 页码，默认1 |
| pageSize | int | 否 | 每页数量，默认20 |
| username | string | 否 | 用户名，模糊匹配 |
| status | int | 否 | 状态：0禁用，1正常 |
| roleId | int | 否 | 角色ID |

**响应结果**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "username": "admin",
        "nickname": "管理员",
        "email": "admin@example.com",
        "status": 1,
        "roles": ["admin"],
        "createTime": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 20,
      "totalPages": 5
    }
  }
}
```

### 3.2 创建用户

创建新用户账号。

**请求地址**：POST /users

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| username | string | 是 | 用户名，4-20字符 |
| password | string | 是 | 密码，8-20字符 |
| nickname | string | 否 | 昵称 |
| email | string | 否 | 邮箱 |
| phone | string | 否 | 手机号 |
| roleIds | array | 否 | 角色ID列表 |
| status | int | 否 | 状态，默认1 |

**请求示例**：

```json
{
  "username": "newuser",
  "password": "Password123",
  "nickname": "新用户",
  "email": "newuser@example.com",
  "roleIds": [2],
  "status": 1
}
```

**响应结果**：

```json
{
  "code": 201,
  "message": "用户创建成功",
  "data": {
    "id": 2,
    "username": "newuser"
  }
}
```

### 3.3 获取用户详情

根据用户ID获取详细信息。

**请求地址**：GET /users/:id

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 用户ID |

**响应结果**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "email": "admin@example.com",
    "phone": "13800138000",
    "avatar": "https://example.com/avatar.jpg",
    "status": 1,
    "roles": [
      {
        "id": 1,
        "roleName": "超级管理员",
        "roleKey": "admin"
      }
    ],
    "permissions": ["template:create", "template:edit", "template:delete"],
    "lastLoginTime": "2024-01-15T10:30:00Z",
    "createTime": "2024-01-01T00:00:00Z",
    "updateTime": "2024-01-15T10:30:00Z"
  }
}
```

### 3.4 更新用户信息

更新用户的基本信息和状态。

**请求地址**：PUT /users/:id

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 用户ID |

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| nickname | string | 否 | 昵称 |
| email | string | 否 | 邮箱 |
| phone | string | 否 | 手机号 |
| avatar | string | 否 | 头像URL |
| status | int | 否 | 状态 |
| roleIds | array | 否 | 角色ID列表 |

**响应结果**：

```json
{
  "code": 200,
  "message": "用户信息更新成功"
}
```

### 3.5 删除用户

删除用户账号。

**请求地址**：DELETE /users/:id

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 用户ID |

**响应结果**：

```json
{
  "code": 200,
  "message": "用户删除成功"
}
```

### 3.6 修改密码

修改用户登录密码。

**请求地址**：POST /users/:id/password

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 用户ID |

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| oldPassword | string | 是 | 原密码 |
| newPassword | string | 是 | 新密码 |

**响应结果**：

```json
{
  "code": 200,
  "message": "密码修改成功"
}
```

## 四、模板管理接口

### 4.1 模板列表

获取模板列表，支持分页和条件筛选。

**请求地址**：GET /templates

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| page | int | 否 | 页码，默认1 |
| pageSize | int | 否 | 每页数量，默认20 |
| name | string | 否 | 模板名称，模糊匹配 |
| industry | string | 否 | 所属行业 |
| category | string | 否 | 模板分类 |
| isPublished | int | 否 | 发布状态：0未发布，1已发布 |
| createUserId | int | 否 | 创建用户ID |

**响应结果**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "金融行业大屏",
        "industry": "finance",
        "category": "banking",
        "thumbnail": "https://example.com/thumb.jpg",
        "isPublished": 1,
        "isPublic": 0,
        "viewCount": 1250,
        "createUserId": 1,
        "createTime": "2024-01-01T00:00:00Z",
        "updateTime": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "pageSize": 20,
      "totalPages": 3
    }
  }
}
```

### 4.2 创建模板

创建新的模板。

**请求地址**：POST /templates

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| name | string | 是 | 模板名称，1-100字符 |
| industry | string | 否 | 所属行业 |
| category | string | 否 | 模板分类 |
| thumbnail | string | 否 | 缩略图URL |
| layoutConfig | object | 否 | 布局配置对象 |

**请求示例**：

```json
{
  "name": "零售行业数据大屏",
  "industry": "retail",
  "category": "store",
  "thumbnail": "https://example.com/thumb.jpg",
  "layoutConfig": {
    "width": 1920,
    "height": 1080,
    "background": "#0a0a0a"
  }
}
```

**响应结果**：

```json
{
  "code": 201,
  "message": "模板创建成功",
  "data": {
    "id": 2,
    "name": "零售行业数据大屏",
    "layoutConfig": {
      "width": 1920,
      "height": 1080,
      "background": "#0a0a0a"
    }
  }
}
```

### 4.3 获取模板详情

根据模板ID获取完整的模板信息，包括组件列表。

**请求地址**：GET /templates/:id

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 模板ID |

**响应结果**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "金融行业大屏",
    "industry": "finance",
    "category": "banking",
    "thumbnail": "https://example.com/thumb.jpg",
    "layoutConfig": {
      "width": 1920,
      "height": 1080,
      "background": "#0a0a0a",
      "grid": {
        "cols": 24,
        "rowHeight": 30,
        "margin": [10, 10]
      }
    },
    "isPublished": 1,
    "isPublic": 0,
    "viewCount": 1250,
    "createUserId": 1,
    "components": [
      {
        "id": 1,
        "componentType": "chart",
        "componentName": "销售额趋势图",
        "position": {
          "x": 0,
          "y": 0,
          "w": 8,
          "h": 4
        },
        "styleConfig": {
          "backgroundColor": "transparent"
        },
        "dataBinding": {
          "sourceType": "api",
          "sourceId": 1
        }
      }
    ],
    "createTime": "2024-01-01T00:00:00Z",
    "updateTime": "2024-01-15T10:30:00Z"
  }
}
```

### 4.4 更新模板

更新模板的基本信息和配置。

**请求地址**：PUT /templates/:id

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 模板ID |

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| name | string | 否 | 模板名称 |
| industry | string | 否 | 所属行业 |
| category | string | 否 | 模板分类 |
| thumbnail | string | 否 | 缩略图URL |
| layoutConfig | object | 否 | 布局配置 |
| isPublished | int | 否 | 发布状态 |
| isPublic | int | 否 | 公开状态 |

**响应结果**：

```json
{
  "code": 200,
  "message": "模板更新成功"
}
```

### 4.5 删除模板

删除指定的模板。

**请求地址**：DELETE /templates/:id

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 模板ID |

**响应结果**：

```json
{
  "code": 200,
  "message": "模板删除成功"
}
```

### 4.6 复制模板

复制现有模板创建新模板。

**请求地址**：POST /templates/:id/clone

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 源模板ID |

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| name | string | 是 | 新模板名称 |

**响应结果**：

```json
{
  "code": 201,
  "message": "模板复制成功",
  "data": {
    "id": 3,
    "name": "金融行业大屏-副本"
  }
}
```

### 4.7 发布模板

将模板设置为已发布状态。

**请求地址**：POST /templates/:id/publish

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 模板ID |

**响应结果**：

```json
{
  "code": 200,
  "message": "模板发布成功"
}
```

### 4.8 导出模板

导出模板为JSON文件。

**请求地址**：GET /templates/:id/export

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 模板ID |

**响应结果**：返回JSON文件下载

### 4.9 导入模板

从JSON文件导入模板。

**请求地址**：POST /templates/import

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| file | file | 是 | 模板JSON文件 |
| name | string | 否 | 模板名称，不指定则使用文件中的名称 |

**响应结果**：

```json
{
  "code": 201,
  "message": "模板导入成功",
  "data": {
    "id": 5,
    "name": "导入的模板"
  }
}
```

## 五、组件管理接口

### 5.1 获取模板组件列表

获取指定模板下的所有组件。

**请求地址**：GET /templates/:templateId/components

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| templateId | int | 模板ID |

**响应结果**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "componentType": "chart",
        "componentName": "销售额趋势图",
        "position": {
          "x": 0,
          "y": 0,
          "w": 8,
          "h": 4
        },
        "styleConfig": {},
        "dataBinding": {},
        "sortOrder": 0,
        "status": 1
      }
    ]
  }
}
```

### 5.2 创建组件

为模板添加新组件。

**请求地址**：POST /templates/:templateId/components

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| templateId | int | 模板ID |

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| componentType | string | 是 | 组件类型 |
| componentName | string | 是 | 组件名称 |
| position | object | 是 | 位置尺寸 |
| styleConfig | object | 否 | 样式配置 |
| dataBinding | object | 否 | 数据绑定 |
| sortOrder | int | 否 | 排序 |

**响应结果**：

```json
{
  "code": 201,
  "message": "组件创建成功",
  "data": {
    "id": 2
  }
}
```

### 5.3 更新组件

更新组件的配置信息。

**请求地址**：PUT /components/:id

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 组件ID |

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| componentName | string | 否 | 组件名称 |
| position | object | 否 | 位置尺寸 |
| styleConfig | object | 否 | 样式配置 |
| dataBinding | object | 否 | 数据绑定 |
| sortOrder | int | 否 | 排序 |

**响应结果**：

```json
{
  "code": 200,
  "message": "组件更新成功"
}
```

### 5.4 删除组件

删除指定的组件。

**请求地址**：DELETE /components/:id

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 组件ID |

**响应结果**：

```json
{
  "code": 200,
  "message": "组件删除成功"
}
```

### 5.5 批量保存组件

一次性保存模板的所有组件，用于保存整个布局。

**请求地址**：PUT /templates/:templateId/components/batch

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| templateId | int | 模板ID |

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| components | array | 是 | 组件列表 |

**请求示例**：

```json
{
  "components": [
    {
      "id": 1,
      "componentType": "chart",
      "componentName": "销售额趋势图",
      "position": {"x": 0, "y": 0, "w": 8, "h": 4},
      "sortOrder": 0
    },
    {
      "componentType": "text",
      "componentName": "标题文本",
      "position": {"x": 0, "y": 4, "w": 4, "h": 2},
      "sortOrder": 1
    }
  ]
}
```

**响应结果**：

```json
{
  "code": 200,
  "message": "组件保存成功"
}
```

## 六、数据源管理接口

### 6.1 数据源列表

获取数据源列表。

**请求地址**：GET /data-sources

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| page | int | 否 | 页码 |
| pageSize | int | 否 | 每页数量 |
| name | string | 否 | 数据源名称 |
| sourceType | string | 否 | 数据源类型 |
| status | int | 否 | 状态 |

**响应结果**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "业务数据库",
        "sourceType": "mysql",
        "status": 1,
        "description": "主业务数据库",
        "lastTestTime": "2024-01-15T10:00:00Z",
        "createUserId": 1,
        "createTime": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 10,
      "page": 1,
      "pageSize": 20
    }
  }
}
```

### 6.2 创建数据源

创建新的数据源。

**请求地址**：POST /data-sources

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| name | string | 是 | 数据源名称 |
| sourceType | string | 是 | 数据源类型 |
| connectionConfig | object | 是 | 连接配置 |
| authConfig | object | 否 | 认证配置 |
| description | string | 否 | 描述 |

**请求示例**：

```json
{
  "name": "MySQL业务库",
  "sourceType": "mysql",
  "connectionConfig": {
    "host": "192.168.1.100",
    "port": 3306,
    "database": "business_db",
    "username": "reader",
    "password": "encrypted_password",
    "charset": "utf8mb4",
    "connectionLimit": 10
  },
  "description": "读取业务数据"
}
```

**响应结果**：

```json
{
  "code": 201,
  "message": "数据源创建成功",
  "data": {
    "id": 2
  }
}
```

### 6.3 测试数据源连接

测试数据源连接是否正常。

**请求地址**：POST /data-sources/:id/test

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 数据源ID |

**响应结果**：

```json
{
  "code": 200,
  "message": "连接测试成功",
  "data": {
    "success": true,
    "message": "连接成功",
    "responseTime": 125
  }
}
```

### 6.4 获取数据源详情

获取数据源的详细信息。

**请求地址**：GET /data-sources/:id

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 数据源ID |

**响应结果**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "MySQL业务库",
    "sourceType": "mysql",
    "connectionConfig": {
      "host": "192.168.1.100",
      "port": 3306,
      "database": "business_db",
      "username": "reader",
      "connectionLimit": 10
    },
    "status": 1,
    "lastTestTime": "2024-01-15T10:00:00Z",
    "description": "读取业务数据",
    "createUserId": 1,
    "createTime": "2024-01-01T00:00:00Z"
  }
}
```

### 6.5 更新数据源

更新数据源配置。

**请求地址**：PUT /data-sources/:id

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 数据源ID |

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| name | string | 否 | 数据源名称 |
| connectionConfig | object | 否 | 连接配置 |
| authConfig | object | 否 | 认证配置 |
| description | string | 否 | 描述 |
| status | int | 否 | 状态 |

**响应结果**：

```json
{
  "code": 200,
  "message": "数据源更新成功"
}
```

### 6.6 删除数据源

删除数据源。

**请求地址**：DELETE /data-sources/:id

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 数据源ID |

**响应结果**：

```json
{
  "code": 200,
  "message": "数据源删除成功"
}
```

## 七、接口配置接口

### 7.1 接口列表

获取接口配置列表。

**请求地址**：GET /templates/:templateId/apis

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| templateId | int | 模板ID |

**响应结果**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "销售数据查询",
        "dataSourceId": 1,
        "queryType": "query",
        "queryContent": "SELECT * FROM sales WHERE date >= :startDate",
        "description": "获取销售数据",
        "createTime": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 7.2 创建接口配置

创建新的接口配置。

**请求地址**：POST /templates/:templateId/apis

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| templateId | int | 模板ID |

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| name | string | 是 | 接口名称 |
| dataSourceId | int | 是 | 数据源ID |
| queryType | string | 是 | 查询类型 |
| queryContent | string | 是 | 查询内容 |
| paramsMapping | object | 否 | 参数映射 |
| resultMapping | object | 否 | 结果映射 |
| cacheConfig | object | 否 | 缓存配置 |
| description | string | 否 | 描述 |

**响应结果**：

```json
{
  "code": 201,
  "message": "接口配置创建成功",
  "data": {
    "id": 2
  }
}
```

### 7.3 测试接口

测试接口配置是否正确。

**请求地址**：POST /apis/:id/test

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 接口ID |

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| params | object | 否 | 测试参数 |

**响应结果**：

```json
{
  "code": 200,
  "message": "接口测试成功",
  "data": {
    "success": true,
    "data": [
      {"date": "2024-01-01", "amount": 10000},
      {"date": "2024-01-02", "amount": 15000}
    ],
    "responseTime": 85
  }
}
```

## 八、数据获取接口

### 8.1 获取组件数据

根据数据绑定配置获取组件数据。

**请求地址**：POST /data/fetch

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| sourceType | string | 是 | 数据源类型 |
| sourceId | int | 是 | 数据源ID |
| queryConfig | object | 是 | 查询配置 |

**请求示例**：

```json
{
  "sourceType": "api",
  "sourceId": 1,
  "queryConfig": {
    "query": "sales_summary",
    "params": {"startDate": "2024-01-01"},
    "refresh": false
  }
}
```

**响应结果**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {"date": "2024-01-01", "amount": 10000},
      {"date": "2024-01-02", "amount": 15000}
    ],
    "total": 2,
    "fetchTime": "2024-01-15T10:30:00Z"
  }
}
```

### 8.2 批量获取数据

在一个请求中获取多个组件的数据。

**请求地址**：POST /data/batch-fetch

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| requests | array | 是 | 数据请求列表 |

**请求示例**：

```json
{
  "requests": [
    {
      "componentId": 1,
      "sourceType": "api",
      "sourceId": 1,
      "queryConfig": {"query": "sales"}
    },
    {
      "componentId": 2,
      "sourceType": "database",
      "sourceId": 2,
      "queryConfig": {"query": "SELECT * FROM inventory"}
    }
  ]
}
```

**响应结果**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "results": [
      {
        "componentId": 1,
        "success": true,
        "data": []
      },
      {
        "componentId": 2,
        "success": true,
        "data": []
      }
    ]
  }
}
```

### 8.3 直接查询数据源

直接执行SQL或API请求。

**请求地址**：POST /data-sources/:id/query

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| id | int | 数据源ID |

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| query | string | 是 | 查询语句 |
| params | object | 否 | 查询参数 |

**响应结果**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "columns": ["id", "name", "value"],
    "rows": [
      {"id": 1, "name": "项目A", "value": 100},
      {"id": 2, "name": "项目B", "value": 200}
    ],
    "rowCount": 2,
    "queryTime": 45
  }
}
```

## 九、系统管理接口

### 9.1 获取系统配置

获取系统配置项。

**请求地址**：GET /system/config

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| group | string | 否 | 配置分组 |

**响应结果**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "configKey": "system.title",
        "configValue": "数据大屏管理系统",
        "configType": "string"
      }
    ]
  }
}
```

### 9.2 更新系统配置

更新系统配置项。

**请求地址**：PUT /system/config/:key

**路径参数**：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| key | string | 配置键 |

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| configValue | string | 是 | 配置值 |

**响应结果**：

```json
{
  "code": 200,
  "message": "配置更新成功"
}
```

### 9.3 获取操作日志

获取系统操作日志。

**请求地址**：GET /system/logs

**请求参数**：

| 参数名称 | 类型 | 必填 | 说明 |
|---------|------|-----|------|
| page | int | 否 | 页码 |
| pageSize | int | 否 | 每页数量 |
| userId | int | 否 | 用户ID |
| module | string | 否 | 模块 |
| startTime | string | 否 | 开始时间 |
| endTime | string | 否 | 结束时间 |

**响应结果**：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "userId": 1,
        "username": "admin",
        "module": "template",
        "operation": "create",
        "ipAddress": "192.168.1.100",
        "executeTime": 125,
        "createTime": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 1000,
      "page": 1,
      "pageSize": 20
    }
  }
}
```

## 十、公共参数说明

### 10.1 分页参数

所有列表接口支持分页，参数说明如下：

| 参数名称 | 类型 | 默认值 | 最大值 | 说明 |
|---------|------|-------|-------|------|
| page | int | 1 | 1000 | 页码 |
| pageSize | int | 20 | 100 | 每页数量 |

分页响应包含以下字段：

| 字段名称 | 类型 | 说明 |
|---------|------|------|
| total | int | 总记录数 |
| page | int | 当前页码 |
| pageSize | int | 每页数量 |
| totalPages | int | 总页数 |

### 10.2 排序参数

部分列表接口支持排序，参数说明如下：

| 参数名称 | 类型 | 说明 |
|---------|------|------|
| sortField | string | 排序字段 |
| sortOrder | string | 排序方向：asc/desc |

### 10.3 时间参数

时间参数支持ISO 8601格式或时间戳格式：

| 格式 | 示例 |
|-----|------|
| ISO 8601 | 2024-01-15T10:30:00Z |
| 日期 | 2024-01-15 |
| 时间戳 | 1705315800000 |

## 十一、错误响应详解

### 11.1 常见错误码

| 错误码 | 说明 | 解决方案 |
|-------|------|---------|
| 400001 | 请求参数格式错误 | 检查JSON格式 |
| 400002 | 必填参数缺失 | 补充必填参数 |
| 400003 | 参数值不合法 | 检查参数取值范围 |
| 401001 | 认证失败 | 重新登录获取Token |
| 401002 | Token已过期 | 使用refreshToken刷新 |
| 401003 | 无访问权限 | 联系管理员开通权限 |
| 403001 | 禁止访问该资源 | 检查资源权限 |
| 404001 | 资源不存在 | 检查资源ID |
| 409001 | 资源已存在 | 更换资源标识 |
| 422001 | 业务验证失败 | 查看details了解详情 |
| 500001 | 服务器内部错误 | 联系技术支持 |
| 503001 | 服务暂不可用 | 稍后重试 |

### 11.2 错误响应示例

```json
{
  "code": 400002,
  "message": "请求参数错误",
  "details": {
    "field": "username",
    "reason": "用户名不能为空"
  },
  "timestamp": 1705315800000,
  "requestId": "req_abc123"
}
```

## 十二、版本信息

| 版本 | 日期 | 修改内容 |
|-----|------|---------|
| v1.0.0 | 2024-01-01 | 初始版本 |
