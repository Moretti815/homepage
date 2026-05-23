// 赞赏页面 JavaScript

// 赞赏者数据
// 可以通过修改这个数组来添加赞赏者信息
const sponsorsData = [
    // 示例数据格式：
    // {
    //     name: "示例用户",
    //     avatar: "https://example.com/avatar.jpg",
    //     website: "https://example.com",
    //     date: "2025-01-01",
    //     amount: "¥10.00",
    //     description: "支持一下！"
    // }
];

// 从 JSON 文件加载赞赏者数据
async function loadSponsorsData() {
    try {
        // 尝试从远程加载数据
        const response = await fetch('https://cdn.jsdmirror.com/gh/Kemeow0815/sponsors@main/data/sponsors/sponsors.json');
        if (response.ok) {
            const data = await response.json();
            return data.sponsors || [];
        }
    } catch (error) {
        console.log('未找到 sponsors.json，使用内置数据');
    }
    return sponsorsData;
}

// 格式化日期
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 创建赞赏者卡片 HTML
function createSponsorCard(sponsor) {
    const hasWebsite = sponsor.url && sponsor.url.trim() !== '';
    
    return `
        <div class="sponsor-card">
            <div class="sponsor-avatar">
                <img src="${sponsor.avatar || 'https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/moretti.webp'}" 
                     alt="${sponsor.name}" 
                     loading="lazy"
                     onerror="this.src='https://jsd.268682.xyz/gh/Kemeow0815/img@main/img/moretti.webp'">
            </div>
            <div class="sponsor-info">
                <div class="sponsor-header">
                    <h4 class="sponsor-name">${sponsor.name || '匿名用户'}</h4>
                    <span class="sponsor-amount">${sponsor.amount || ''}</span>
                </div>
                ${sponsor.description ? `<p class="sponsor-desc">${sponsor.description}</p>` : ''}
                <div class="sponsor-meta">
                    ${sponsor.date ? `
                        <span class="sponsor-date">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                            </svg>
                            ${formatDate(sponsor.date)}
                        </span>
                    ` : ''}
                    ${hasWebsite ? `
                        <a href="${sponsor.url}" class="sponsor-link" target="_blank" rel="noopener">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                            </svg>
                            访问主页
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// 渲染赞赏者列表
async function renderSponsors() {
    const container = document.getElementById('sponsorsList');
    if (!container) return;

    // 显示加载状态
    container.innerHTML = `
        <div class="sponsors-loading">
            <div class="loading-spinner"></div>
            <p>正在加载赞赏者名单...</p>
        </div>
    `;

    try {
        const sponsors = await loadSponsorsData();
        
        if (sponsors.length === 0) {
            container.innerHTML = `
                <div class="sponsors-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <p>还没有人赞赏，成为第一个支持者吧！</p>
                </div>
            `;
            return;
        }

        // 按日期倒序排列（最新的在前）
        const sortedSponsors = sponsors.sort((a, b) => {
            if (!a.date) return 1;
            if (!b.date) return -1;
            return new Date(b.date) - new Date(a.date);
        });

        container.innerHTML = sortedSponsors.map(createSponsorCard).join('');
    } catch (error) {
        console.error('加载赞赏者数据失败:', error);
        container.innerHTML = `
            <div class="sponsors-empty">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <p>加载失败，请刷新页面重试</p>
            </div>
        `;
    }
}

// 添加复制功能
function setupCopyButtons() {
    // 为二维码添加点击复制链接功能（可选）
    const qrCodes = document.querySelectorAll('.reward-qr img');
    qrCodes.forEach(img => {
        img.addEventListener('click', function() {
            // 可以在这里添加放大查看功能
            this.classList.toggle('zoomed');
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    renderSponsors();
    setupCopyButtons();
});

// 导出函数供外部使用
window.RewardPage = {
    refresh: renderSponsors,
    getData: loadSponsorsData
};
