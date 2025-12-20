// ==================== 暴力目录生成器 ====================
console.log('🚀 开始暴力生成目录...');

// 等页面加载
window.addEventListener('load', function() {
  console.log('页面已加载，开始生成目录...');
  createUltimateTOC();
});

// 主函数
function createUltimateTOC() {
  console.log('🔥 暴力模式启动！');
  
  // 1. 先移除所有可能存在的目录
  const tocSelectors = [
    '#暴力目录', '#simple-toc', '#force-toc', 
    '.toc', '#toc', '.table-of-contents',
    '#card-post-toc', '#aside-content .toc'
  ];
  
  tocSelectors.forEach(selector => {
    const els = document.querySelectorAll(selector);
    els.forEach(el => {
      console.log('移除:', selector);
      el.remove();
    });
  });
  
  // 2. 暴力查找所有标题
  let allHeadings = [];
  
  // 先用简单方法找
  allHeadings = document.querySelectorAll('h1, h2, h3, h4');
  console.log('简单查找找到:', allHeadings.length, '个标题');
  
  // 如果没找到，用更暴力的方法
  if (allHeadings.length === 0) {
    console.log('没找到标题，使用暴力搜索...');
    
    // 搜索整个页面
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const tag = el.tagName;
      if (tag.startsWith('H') && tag.length === 2) {
        const level = parseInt(tag.charAt(1));
        if (level >= 1 && level <= 4) {
          allHeadings.push(el);
        }
      }
    });
  }
  
  console.log('最终找到标题:', allHeadings.length);
  
  if (allHeadings.length === 0) {
    console.log('❌ 一个标题都没找到！检查你的文章是否有<h2>标签');
    
    // 显示错误信息
    const error = document.createElement('div');
    error.innerHTML = `
      <div style="
        position: fixed;
        right: 20px;
        top: 100px;
        background: #ffcccc;
        border: 3px solid red;
        padding: 20px;
        border-radius: 10px;
        z-index: 99999;
        color: red;
        font-weight: bold;
      ">
        ⚠️ 目录生成失败！<br>
        原因：文章中没有找到任何标题标签<br>
        请确保文章中有 &lt;h2&gt; 或 &lt;h3&gt; 标签
      </div>
    `;
    document.body.appendChild(error);
    return;
  }
  
  // 3. 创建最明显的目录
  const toc = document.createElement('div');
  toc.id = '暴力目录';
  toc.innerHTML = `
    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px;
      border-radius: 10px 10px 0 0;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    ">
      📖 文章目录
    </div>
  `;
  
  // 内容容器
  const content = document.createElement('div');
  content.style.cssText = `
    max-height: 400px;
    overflow-y: auto;
    padding: 15px;
    background: white;
  `;
  
  // 添加每个标题
  allHeadings.forEach((heading, index) => {
    // 确保有ID
    if (!heading.id) {
      heading.id = 'heading-' + Date.now() + '-' + index;
    }
    
    const level = parseInt(heading.tagName.charAt(1));
    const indent = (level - 2) * 20; // h2=0, h3=20, h4=40
    
    const item = document.createElement('a');
    item.href = '#' + heading.id;
    item.textContent = `${index + 1}. ${heading.textContent}`;
    item.style.cssText = `
      display: block;
      padding: 8px 0 8px ${indent}px;
      color: #333;
      text-decoration: none;
      font-size: ${16 - level}px;
      border-left: 3px solid transparent;
      margin: 3px 0;
      cursor: pointer;
      transition: all 0.2s;
    `;
    
    item.addEventListener('mouseenter', () => {
      item.style.color = '#667eea';
      item.style.borderLeftColor = '#667eea';
    });
    
    item.addEventListener('mouseleave', () => {
      if (!item.classList.contains('active')) {
        item.style.color = '#333';
        item.style.borderLeftColor = 'transparent';
      }
    });
    
    item.addEventListener('click', (e) => {
      e.preventDefault();
      heading.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    });
    
    content.appendChild(item);
  });
  
  toc.appendChild(content);
  
  // 整体样式
  toc.style.cssText = `
    position: fixed !important;
    right: 20px !important;
    top: 100px !important;
    width: 320px !important;
    background: white !important;
    border-radius: 10px !important;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
    z-index: 999999 !important;
    border: 2px solid #667eea !important;
  `;
  
  // 4. 添加到页面
  document.body.appendChild(toc);
  console.log('✅ 暴力目录生成成功！');
  console.log('位置：固定在右侧，红色边框很明显！');
  
  // 5. 高亮当前阅读的章节
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const allItems = toc.querySelectorAll('a');
        
        allItems.forEach(item => {
          item.classList.remove('active');
          item.style.color = '#333';
          item.style.borderLeftColor = 'transparent';
          item.style.fontWeight = 'normal';
        });
        
        const activeItem = toc.querySelector(`a[href="#${id}"]`);
        if (activeItem) {
          activeItem.classList.add('active');
          activeItem.style.color = '#667eea';
          activeItem.style.borderLeftColor = '#667eea';
          activeItem.style.fontWeight = 'bold';
        }
      }
    });
  }, { threshold: 0.5 });
  
  allHeadings.forEach(h => observer.observe(h));
}

// 确保页面加载完成
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createUltimateTOC);
} else {
  createUltimateTOC();
}

// 3秒后检查一次，确保目录存在
setTimeout(() => {
  if (!document.getElementById('暴力目录')) {
    console.log('🔄 重新生成目录...');
    createUltimateTOC();
  }
}, 3000);