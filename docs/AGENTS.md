# Dashboard Pro 中的代理与角色 (Agents & Actors)

本文档概述了在 **Dashboard Pro** 生态系统中交互的各类代理（人类角色和系统角色）。为了更好地辅助开发，我们将 AI 助手（如 Trae）也纳入代理体系，并与其行为准则和工作流进行关联。

## 1. 人类代理 (Human Agents - 用户角色)

这些代理通过前端界面与系统进行交互。

### 管理员 (Administrator)
- **职责**: 
  - 全面的系统配置与管理。
  - 用户与角色管理 (RBAC)。
  - 数据源配置与连接性测试。
  - 系统设置 (SMTP, 安全策略, 日志保留)。
- **访问权限**: 对所有模块拥有完全读写权限。

### 编辑者 (Editor / Project Manager)
- **职责**:
  - 创建和管理仪表盘模板。
  - 为项目配置特定的数据源。
  - 查看与其项目相关的操作日志。
- **访问权限**: 对业务模块（模板、数据源）拥有读写权限，但无法访问系统设置和用户管理。

### 查看者 (Viewer)
- **职责**:
  - 查看已发布的仪表盘和报表。
  - 与筛选器和数据可视化组件交互。
- **访问权限**: 仅拥有特定仪表盘的只读权限。

---

## 2. 系统代理 (System Agents - 自动化服务)

这些是后台进程或服务，在无需人工直接干预的情况下执行自动化任务。

### 数据同步代理 (Data Sync Agent)
- **功能**: 定期从配置的外部 **数据源** (MySQL, API 等) 拉取数据。
- **行为**:
  - 按计划的时间间隔运行 (Cron)。
  - 验证数据完整性。
  - 更新内部缓存 (Redis) 以保证仪表盘的实时性能。

### 通知代理 (Notification Agent)
- **功能**: 监控系统事件并触发警报。
- **触发条件**:
  - 系统错误或异常。
  - 数据阈值突破 (例如 "销售额低于目标")。
  - 安全事件 (例如连续登录失败)。
- **渠道**: 邮件 (SMTP), Webhook, 站内通知。

### 维护代理 (Maintenance Agent)
- **功能**: 执行系统清理和优化。
- **任务**:
  - 轮转和归档日志。
  - 清理临时文件。
  - 修剪过期的会话数据。

---

## 3. 开发代理 (Development Agents - AI 助手)

用于加速 Dashboard Pro 开发的工具和 AI 代理。为了确保代码质量和开发效率，这些代理必须遵循 **`.agent`** 目录下的严格规范。

### Trae (AI 编程助手)
- **角色**: 结对程序员 & 代码生成器。
- **核心能力**:
  - 生成样板代码 (NestJS, HTML/CSS)。
  - 重构和优化现有逻辑。
  - 编写文档和测试用例。
  - 调试运行时错误。
  
- **行为准则 (关联 `.agent/rules`)**:
  - **语言规范**: 遵循 [language.md](file:///Users/miinno/workspace/code_file/nodejs/Dashboard-Pro-/.agent/rules/language.md)，默认使用 **中文** 进行回复，除非用户明确要求其他语言。
  - **质量优先**: 遵循 [base.md](file:///Users/miinno/workspace/code_file/nodejs/Dashboard-Pro-/.agent/rules/base.md)，拒绝“一把梭”脚本，坚持分步骤执行和验证。
  - **工程思维**: 优先使用成熟库，拒绝重复造轮子，进行防御性编程。

- **标准工作流 (关联 `.agent/workflows`)**:
  - **项目分析**: 当需要理解项目结构或技术栈时，Trae 会参考 [analyze.md](file:///Users/miinno/workspace/code_file/nodejs/Dashboard-Pro-/.agent/workflows/analyze.md)，从文件结构、依赖、配置等多维度进行全景分析。
  - **价值评估**: 在引入新功能或重构时，Trae 可参考 [assess_system.md](file:///Users/miinno/workspace/code_file/nodejs/Dashboard-Pro-/.agent/workflows/assess_system.md)，从真实性、必要性、合理性和可行性四个维度进行评估。

---

## 代理交互图 (Agent Interaction Diagram)

```mermaid
graph TD
    User[人类代理 (用户)] -->|登录| Auth[认证服务]
    Auth -->|令牌| Dashboard[仪表盘 UI]
    
    Dashboard -->|配置| Admin[管理员代理]
    Dashboard -->|查看| Viewer[查看者代理]
    
    Sync[数据同步代理] -->|拉取| Source[(外部数据源)]
    Sync -->|更新| DB[(本地数据库/Redis)]
    
    Monitor[通知代理] -->|监控| DB
    Monitor -->|报警| User
    
    Dev[开发代理 (Trae)] -.->|遵循规则| Rules[.agent/rules]
    Dev -.->|执行流程| Flows[.agent/workflows]
    Dev -->|编写/维护| Code[项目代码库]
```
