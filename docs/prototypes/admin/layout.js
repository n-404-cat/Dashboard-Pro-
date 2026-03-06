// 布局组件
class AdminLayout {
    constructor() {
        this.currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
        this.init();
    }

    init() {
        this.injectStyles();
        this.renderHeader();
        this.renderSidebar();
        this.renderProfileModal();
        this.highlightCurrentMenu();
        this.checkElementPermissions();
        this.bindEvents();
    }

    checkElementPermissions() {
        const elements = document.querySelectorAll('[data-perm]');
        elements.forEach(el => {
            const perm = el.getAttribute('data-perm');
            if (!this.checkPermission(perm)) {
                el.style.display = 'none';
            }
        });
    }

    injectStyles() {
        const existed = document.querySelector('link[rel="stylesheet"][href$="common.css"]');
        if (existed) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'common.css';
        document.head.appendChild(link);
    }

    renderHeader() {
        const raw = localStorage.getItem('user_info');
        let user = null;
        try { user = raw ? JSON.parse(raw) : null; } catch { user = null; }

        const headerHtml = `
            <header class="header">
                <div class="header-left">
                    <a href="dashboard.html" class="logo">
                        <div class="logo-icon">📊</div>
                        <span>Dashboard Pro</span>
                    </a>
                    <div class="search-box">
                        <span class="search-icon">🔍</span>
                        <input type="text" placeholder="搜索模板、数据源...">
                    </div>
                </div>
                <div class="header-right">
                    <button class="header-btn" title="消息通知">
                        <span>🔔</span>
                        <span class="badge"></span>
                    </button>
                    <div class="dropdown" id="userDropdown">
                        <div class="user-dropdown" onclick="AdminLayout_toggleDropdown(event, 'userMenu')">
                            <div class="user-avatar">${(user?.nickname || user?.username || 'A')[0].toUpperCase()}</div>
                            <div>
                                <div class="user-name">${user?.nickname || user?.username || '管理员'}</div>
                                <div class="user-role">${user?.isSuperAdmin ? '超级管理员' : (user?.roles?.[0] || 'User')}</div>
                            </div>
                        </div>
                        <div class="dropdown-menu" id="userMenu">
                            <div class="dropdown-item" onclick="AdminLayout_openProfile()"><span>👤</span> 个人中心</div>
                            <div class="dropdown-item" onclick="AdminLayout_goSettings()"><span>⚙️</span> 系统设置</div>
                            <div class="dropdown-divider"></div>
                            <div class="dropdown-item" onclick="AdminLayout_logout()"><span>🚪</span> 退出登录</div>
                        </div>
                    </div>
                </div>
            </header>
        `;
        document.body.insertAdjacentHTML('afterbegin', headerHtml);
    }

    checkPermission(permission) {
        const raw = localStorage.getItem('user_info');
        let user = null;
        try { user = raw ? JSON.parse(raw) : null; } catch { user = null; }
        if (!user) return false;
        if (user.isSuperAdmin || user.permissions?.includes('*:*:*')) return true;
        return user.permissions?.includes(permission);
    }

    renderSidebar() {
        const menus = [
            {
                title: '控制台', items: [
                    { title: '数据概览', icon: '📊', path: 'dashboard.html', perm: 'dashboard:view' }
                ]
            },
            {
                title: '业务管理', items: [
                    { title: '模板管理', icon: '📋', path: 'templates.html', perm: 'templates:list' },
                    { title: '数据源管理', icon: '🗄️', path: 'datasources.html', perm: 'datasources:list' },
                    { title: '接口配置', icon: '🔗', path: 'apis.html', perm: 'apis:list' }
                ]
            },
            {
                title: '系统设置', items: [
                    { title: '用户管理', icon: '👥', path: 'users.html', perm: 'users:list' },
                    { title: '角色权限', icon: '🔐', path: 'roles.html', perm: 'roles:list' },
                    { title: '系统配置', icon: '⚙️', path: 'settings.html', perm: 'settings:view' },
                    { title: '操作日志', icon: '📝', path: 'logs.html', perm: 'logs:list' }
                ]
            }
        ];

        let sidebarHtml = '<aside class="sidebar">';

        menus.forEach(section => {
            const visibleItems = section.items.filter(item => this.checkPermission(item.perm));
            if (visibleItems.length > 0) {
                sidebarHtml += `
                    <div class="sidebar-section">
                        <div class="sidebar-title">${section.title}</div>
                        ${visibleItems.map(item => `
                            <a class="sidebar-link" href="${item.path}" data-page="${item.path}">
                                <span class="icon">${item.icon}</span>
                                <span>${item.title}</span>
                                ${item.title === '模板管理' ? '<span class="badge">5</span>' : ''}
                            </a>
                        `).join('')}
                    </div>
                `;
            }
        });

        sidebarHtml += '</aside>';
        const header = document.querySelector('.header');
        header.insertAdjacentHTML('afterend', sidebarHtml);
    }

    renderProfileModal() {
        const existed = document.getElementById('profileModal');
        if (existed) return;

        // Ensure toast container exists
        if (!document.getElementById('toastContainer')) {
            document.body.insertAdjacentHTML('beforeend', '<div class="toast-container" id="toastContainer"></div>');
        }

        const modalHtml = `
            <div class="modal-overlay" id="profileModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">个人中心</h3>
                        <button class="modal-close" onclick="AdminLayout_closeProfile()">×</button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="profileUserId">
                        <div class="form-group">
                            <label class="form-label">用户名</label>
                            <input class="form-input" id="profileUsername" readonly style="background: var(--bg-light);">
                        </div>
                        <div class="form-group">
                            <label class="form-label">昵称</label>
                            <input class="form-input" id="profileNickname">
                        </div>
                        <div class="form-group">
                            <label class="form-label">角色</label>
                            <input class="form-input" id="profileRole" readonly style="background: var(--bg-light);">
                        </div>
                        <div class="form-group">
                            <label class="form-label">邮箱</label>
                            <input class="form-input" id="profileEmail">
                        </div>
                        <div class="form-group">
                            <label class="form-label">手机号</label>
                            <input class="form-input" id="profilePhone">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="AdminLayout_closeProfile()">取消</button>
                        <button class="btn btn-primary" onclick="AdminLayout_saveProfile()">保存修改</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    highlightCurrentMenu() {
        const links = document.querySelectorAll('.sidebar-link');
        links.forEach(link => {
            if (link.getAttribute('data-page') === this.currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    bindEvents() {
        // 全局提示
        window.showToast = (message, type = 'success') => {
            const container = document.getElementById('toastContainer');
            if (!container) return;
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span><span>${message}</span>`;
            if (type === 'danger' || type === 'error') toast.style.borderLeftColor = 'var(--danger)';
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(20px)';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        };

        // 下拉菜单逻辑
        window.AdminLayout_toggleDropdown = (e, menuId) => {
            const menu = document.getElementById(menuId);
            if (menu) {
                menu.classList.toggle('show');
                if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
            }
        };

        document.addEventListener('click', () => {
            document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
        });

        window.AdminLayout_openProfile = () => {
            const raw = localStorage.getItem('user_info');
            let user = null;
            try { user = raw ? JSON.parse(raw) : null; } catch { user = null; }

            if (user) {
                document.getElementById('profileUserId').value = user.id || '';
                document.getElementById('profileUsername').value = user.username || '';
                document.getElementById('profileNickname').value = user.nickname || '';
                document.getElementById('profileEmail').value = user.email || '';
                document.getElementById('profilePhone').value = user.phone || '';
                document.getElementById('profileRole').value = user.isSuperAdmin ? '超级管理员' : (user.roles?.[0]?.roleName || user.roles?.[0] || '普通用户');
            }

            const modal = document.getElementById('profileModal');
            if (modal) modal.classList.add('show');
        };

        window.AdminLayout_closeProfile = () => {
            const modal = document.getElementById('profileModal');
            if (modal) modal.classList.remove('show');
        };

        window.AdminLayout_saveProfile = async () => {
            const id = document.getElementById('profileUserId').value;
            const data = {
                nickname: document.getElementById('profileNickname').value,
                email: document.getElementById('profileEmail').value,
                phone: document.getElementById('profilePhone').value
            };

            try {
                const response = await fetch(`/system/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const updatedUser = await response.json();
                    // 更新本地缓存
                    const raw = localStorage.getItem('user_info');
                    let user = JSON.parse(raw);
                    Object.assign(user, updatedUser);
                    localStorage.setItem('user_info', JSON.stringify(user));

                    showToast('个人资料已更新');
                    AdminLayout_closeProfile();

                    // 刷新页面头部显示
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    const err = await response.json();
                    showToast(err.message || '更新失败', 'danger');
                }
            } catch (err) {
                showToast('网络错误', 'danger');
            }
        };

        window.AdminLayout_goSettings = () => {
            window.location.href = 'settings.html';
        };

        // 退出登录
        window.AdminLayout_logout = () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_info');
            window.location.href = 'login.html';
        };

        const profileModal = document.getElementById('profileModal');
        if (profileModal) {
            profileModal.addEventListener('click', function (e) {
                if (e.target === this) this.classList.remove('show');
            });
        }
    }

    /**
     * 渲染通用分页
     * @param {string} containerId 容器ID
     * @param {object} data 分页数据 { total, page, pageSize, totalPages }
     * @param {function} onPageChange 页码改变回调
     */
    renderPagination(containerId, data, onPageChange) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { total = 0, page = 1, pageSize = 10, totalPages = 0 } = data;
        const start = (page - 1) * pageSize + 1;
        const end = Math.min(page * pageSize, total);

        let html = `
            <div class="pagination-info">显示 ${total > 0 ? start : 0} 到 ${end} 条，共 ${total} 条记录</div>
            <div class="pagination-btns">
                <button class="page-btn" ${page <= 1 ? 'disabled' : ''} onclick="window.${containerId}_goPage(${page - 1})">上一页</button>
        `;

        // 简单的页码逻辑
        const maxVisible = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="window.${containerId}_goPage(${i})">${i}</button>`;
        }

        html += `
                <button class="page-btn" ${page >= totalPages ? 'disabled' : ''} onclick="window.${containerId}_goPage(${page + 1})">下一页</button>
            </div>
        `;

        container.innerHTML = html;
        container.classList.add('pagination');

        // 绑定跳转函数到 window，确保 onclick 能找到
        window[`${containerId}_goPage`] = (p) => {
            if (p >= 1 && p <= totalPages && p !== page) {
                onPageChange(p);
            }
        };
    }
}

// 初始化布局
document.addEventListener('DOMContentLoaded', () => {
    // 如果不是登录页，则初始化布局
    if (!window.location.pathname.includes('login.html')) {
        // 检查登录状态
        const token = localStorage.getItem('access_token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        window.adminLayout = new AdminLayout();
    }
});
