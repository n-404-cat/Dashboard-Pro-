// 通用文件上传组件
class FileUploadComponent {
    constructor(options = {}) {
        this.container = options.container || document.body;
        this.onUpload = options.onUpload || (() => {});
        this.onRemove = options.onRemove || (() => {});
        this.accept = options.accept || '*/*';
        this.maxSize = options.maxSize || 10 * 1024 * 1024; // 10MB默认
        this.multiple = options.multiple || false;
        this.uploadText = options.uploadText || '点击上传文件';
        this.removeText = options.removeText || '删除';
        this.placeholder = options.placeholder || '暂未选择文件';
        this.disabled = options.disabled || false;
        
        this.id = options.id || 'file-upload-' + Math.random().toString(36).substr(2, 9);
        this.files = [];
        
        this.render();
    }
    
    render() {
        const uploadContainer = document.createElement('div');
        uploadContainer.className = 'file-upload-container';
        uploadContainer.id = this.id;
        
        uploadContainer.innerHTML = `
            <div class="file-upload-area" ${this.disabled ? 'disabled' : ''}>
                <input type="file" 
                       id="${this.id}-input" 
                       class="file-upload-input" 
                       accept="${this.accept}" 
                       ${this.multiple ? 'multiple' : ''}
                       style="display: none;">
                <div class="file-upload-trigger">
                    <div class="upload-icon">📤</div>
                    <div class="upload-text">${this.uploadText}</div>
                    <div class="upload-hint">支持格式: ${this.accept}, 最大${(this.maxSize / 1024 / 1024).toFixed(1)}MB</div>
                </div>
                <div class="file-list" id="${this.id}-list">
                    <div class="file-placeholder">${this.placeholder}</div>
                </div>
            </div>
            <style>
                .file-upload-container {
                    width: 100%;
                }
                .file-upload-area {
                    border: 2px dashed #d0d0d0;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    background: #fafafa;
                }
                .file-upload-area:hover:not([disabled]) {
                    border-color: var(--primary);
                    background: #f0f7ff;
                }
                .file-upload-area[disabled] {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .upload-icon {
                    font-size: 32px;
                    margin-bottom: 10px;
                }
                .upload-text {
                    font-size: 14px;
                    color: var(--text-dark);
                    margin-bottom: 5px;
                    font-weight: 500;
                }
                .upload-hint {
                    font-size: 12px;
                    color: var(--text-muted);
                }
                .file-list {
                    margin-top: 15px;
                }
                .file-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px;
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: 6px;
                    margin-bottom: 8px;
                }
                .file-item-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .file-item-icon {
                    font-size: 20px;
                }
                .file-item-name {
                    font-size: 13px;
                    color: var(--text-dark);
                }
                .file-item-size {
                    font-size: 12px;
                    color: var(--text-muted);
                }
                .file-remove-btn {
                    background: none;
                    border: none;
                    color: var(--danger);
                    cursor: pointer;
                    font-size: 12px;
                    padding: 5px 10px;
                    border-radius: 4px;
                }
                .file-remove-btn:hover {
                    background: rgba(220, 53, 69, 0.1);
                }
                .file-placeholder {
                    color: var(--text-muted);
                    font-size: 13px;
                    padding: 10px 0;
                }
            </style>
        `;
        
        this.container.appendChild(uploadContainer);
        this.uploadArea = uploadContainer.querySelector('.file-upload-area');
        this.fileInput = uploadContainer.querySelector(`#${this.id}-input`);
        this.fileList = uploadContainer.querySelector(`#${this.id}-list`);
        
        this.bindEvents();
    }
    
    bindEvents() {
        // 点击上传区域触发文件选择
        this.uploadArea.addEventListener('click', () => {
            if (!this.disabled) {
                this.fileInput.click();
            }
        });
        
        // 拖拽上传支持
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!this.disabled) {
                this.uploadArea.style.borderColor = 'var(--primary)';
                this.uploadArea.style.background = '#f0f7ff';
            }
        });
        
        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.style.borderColor = '#d0d0d0';
            this.uploadArea.style.background = '#fafafa';
        });
        
        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!this.disabled) {
                this.uploadArea.style.borderColor = '#d0d0d0';
                this.uploadArea.style.background = '#fafafa';
                this.handleFiles(e.dataTransfer.files);
            }
        });
        
        // 文件选择事件
        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }
    
    handleFiles(files) {
        const fileArray = Array.from(files);
        
        fileArray.forEach(file => {
            // 验证文件大小
            if (file.size > this.maxSize) {
                alert(`文件 ${file.name} 大小超过限制 (${(this.maxSize / 1024 / 1024).toFixed(1)}MB)`);
                return;
            }
            
            // 验证文件类型
            if (this.accept !== '*/*') {
                const acceptTypes = this.accept.split(',').map(type => type.trim());
                const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                const isValidType = acceptTypes.some(type => {
                    if (type.startsWith('.')) {
                        return fileExtension === type.toLowerCase();
                    } else {
                        return file.type === type;
                    }
                });
                
                if (!isValidType) {
                    alert(`文件 ${file.name} 格式不支持，请选择 ${this.accept} 格式的文件`);
                    return;
                }
            }
            
            // 读取文件内容
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileData = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    content: e.target.result,
                    file: file
                };
                
                this.addFile(fileData);
                this.onUpload(fileData);
            };
            reader.readAsText(file);
        });
    }
    
    addFile(fileData) {
        if (!this.multiple) {
            this.files = [];
        }
        
        this.files.push(fileData);
        this.renderFileList();
    }
    
    removeFile(index) {
        const removedFile = this.files[index];
        this.files.splice(index, 1);
        this.renderFileList();
        this.onRemove(removedFile, index);
    }
    
    renderFileList() {
        if (this.files.length === 0) {
            this.fileList.innerHTML = `<div class="file-placeholder">${this.placeholder}</div>`;
            return;
        }
        
        this.fileList.innerHTML = this.files.map((file, index) => `
            <div class="file-item">
                <div class="file-item-info">
                    <div class="file-item-icon">📄</div>
                    <div>
                        <div class="file-item-name">${file.name}</div>
                        <div class="file-item-size">${this.formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button type="button" class="file-remove-btn" onclick="event.stopPropagation(); document.getElementById('${this.id}')._component.removeFile(${index})">
                    ${this.removeText}
                </button>
            </div>
        `).join('');
        
        // 保存组件实例引用
        this.container.querySelector(`#${this.id}`)._component = this;
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    getFiles() {
        return this.files;
    }
    
    clear() {
        this.files = [];
        this.renderFileList();
    }
    
    setDisabled(disabled) {
        this.disabled = disabled;
        this.uploadArea.disabled = disabled;
    }
    
    destroy() {
        if (this.container.contains(this.container.querySelector(`#${this.id}`))) {
            this.container.removeChild(this.container.querySelector(`#${this.id}`));
        }
    }
}

// 全局导出
if (typeof window !== 'undefined') {
    window.FileUploadComponent = FileUploadComponent;
}