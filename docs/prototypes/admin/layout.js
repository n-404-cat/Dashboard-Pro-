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
        this.bindEvents();
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
                            <div class="user-avatar">A</div>
                            <div>
                                <div class="user-name">管理员</div>
                                <div class="user-role">Admin</div>
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

    renderSidebar() {
        const sidebarHtml = `
            <aside class="sidebar">
                <div class="sidebar-section">
                    <div class="sidebar-title">控制台</div>
                    <a class="sidebar-link" href="dashboard.html" data-page="dashboard.html">
                        <span class="icon">📊</span>
                        <span>数据概览</span>
                    </a>
                </div>
                <div class="sidebar-section">
                    <div class="sidebar-title">业务管理</div>
                    <a class="sidebar-link" href="templates.html" data-page="templates.html">
                        <span class="icon">📋</span>
                        <span>模板管理</span>
                        <span class="badge">5</span>
                    </a>
                    <a class="sidebar-link" href="datasources.html" data-page="datasources.html">
                        <span class="icon">🗄️</span>
                        <span>数据源管理</span>
                    </a>
                    <a class="sidebar-link" href="apis.html" data-page="apis.html">
                        <span class="icon">🔗</span>
                        <span>接口配置</span>
                    </a>
                </div>
                <div class="sidebar-section">
                    <div class="sidebar-title">系统设置</div>
                    <a class="sidebar-link" href="users.html" data-page="users.html">
                        <span class="icon">👥</span>
                        <span>用户管理</span>
                    </a>
                    <a class="sidebar-link" href="roles.html" data-page="roles.html">
                        <span class="icon">🔐</span>
                        <span>角色权限</span>
                    </a>
                    <a class="sidebar-link" href="settings.html" data-page="settings.html">
                        <span class="icon">⚙️</span>
                        <span>系统配置</span>
                    </a>
                    <a class="sidebar-link" href="logs.html" data-page="logs.html">
                        <span class="icon">📝</span>
                        <span>操作日志</span>
                    </a>
                </div>
            </aside>
        `;
        const header = document.querySelector('.header');
        header.insertAdjacentHTML('afterend', sidebarHtml);
    }

    renderProfileModal() {
        const existed = document.getElementById('profileModal');
        if (existed) return;
        const modalHtml = `
            <div class="modal-overlay" id="profileModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">个人中心</h3>
                        <button class="modal-close" onclick="AdminLayout_closeProfile()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">用户名</label>
                            <input class="form-input" id="profileUsername" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label">角色</label>
                            <input class="form-input" id="profileRole" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label">邮箱</label>
                            <input class="form-input" id="profileEmail" readonly>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="AdminLayout_goSettings()">系统设置</button>
                        <button class="btn btn-primary" onclick="AdminLayout_logout()">退出登录</button>
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

            const usernameEl = document.getElementById('profileUsername');
            const roleEl = document.getElementById('profileRole');
            const emailEl = document.getElementById('profileEmail');

            if (usernameEl) usernameEl.value = user?.username || user?.name || '管理员';
            if (roleEl) roleEl.value = user?.role?.name || user?.role || 'Admin';
            if (emailEl) emailEl.value = user?.email || '';

            const modal = document.getElementById('profileModal');
            if (modal) modal.classList.add('show');
        };

        window.AdminLayout_closeProfile = () => {
            const modal = document.getElementById('profileModal');
            if (modal) modal.classList.remove('show');
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
            profileModal.addEventListener('click', function(e) {
                if (e.target === this) this.classList.remove('show');
            });
        }
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
        new AdminLayout();
    }
});
