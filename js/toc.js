/**
 * 增强型目录功能
 * 实现目录显示/隐藏切换、滚动定位和移动端适配
 */

document.addEventListener('DOMContentLoaded', function() {
  // 获取相关元素
  const tocContainer = document.getElementById('toc-container');
  const tocContent = document.getElementById('toc-content');
  const tocToggle = document.getElementById('toc-toggle');
  const tocIcon = document.getElementById('toc-icon');
  const mobileTocToggle = document.getElementById('mobile-toc-toggle');
  const tocClose = document.getElementById('toc-close');
  const tocOverlay = document.getElementById('toc-overlay');
  const tocHeader = document.querySelector('.toc-header');
  
  // 如果没有找到目录容器，说明当前页面没有目录，直接返回
  if (!tocContainer) {
    return;
  }
  
  // 获取目录中的所有链接
  const tocLinks = tocContent.querySelectorAll('a');
  
  // 获取文章中的所有标题元素
  const articleHeadings = document.querySelectorAll('.article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6');
  
  // 确保所有标题都有ID，如果没有则生成
  articleHeadings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }
  });
  
  // 创建标题与目录链接的映射关系
  const headingMap = {};
  
  // 存储标题元素及其对应的ID和位置信息
  const headings = Array.from(articleHeadings).map(heading => {
    return {
      id: heading.id,
      element: heading,
      position: heading.offsetTop,
      text: heading.textContent
    };
  });
  
  // 创建目录链接与标题的映射
  tocLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const headingId = href.substring(1);
      headingMap[headingId] = link;
    }
  });
  
  // 更新所有标题位置信息
  function updateHeadingPositions() {
    headings.forEach(heading => {
      heading.position = heading.element.offsetTop;
    });
  }
  
  // 保存目录状态到本地存储的函数
  function saveTocState(isVisible) {
    localStorage.setItem('tocState', isVisible ? 'visible' : 'hidden');
  }
  
  // 从本地存储中获取目录状态
  function getTocState() {
    return localStorage.getItem('tocState') || 'visible';
  }
  
  // 显示目录内容
  function showTocContent() {
    tocContent.style.display = 'block';
    tocIcon.setAttribute('icon', 'mdi:chevron-up');
    saveTocState(true);
  }
  
  // 隐藏目录内容
  function hideTocContent() {
    tocContent.style.display = 'none';
    tocIcon.setAttribute('icon', 'mdi:chevron-down');
    saveTocState(false);
  }
  
  // 初始化目录状态
  function initTocState() {
    const tocState = getTocState();
    
    if (tocState === 'hidden') {
      hideTocContent();
    } else {
      showTocContent();
    }
  }
  
  // 初始化目录状态
  initTocState();
  
  // 切换目录显示/隐藏
  tocToggle.addEventListener('click', function() {
    if (tocContent.style.display === 'none') {
      showTocContent();
    } else {
      hideTocContent();
    }
  });
  
  // 移动端打开目录
  if (mobileTocToggle) {
    mobileTocToggle.addEventListener('click', function() {
      tocContainer.classList.remove('translate-x-full');
      tocOverlay.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      
      // 在移动端打开目录时，如果目录内容是隐藏的，则自动显示
      if (tocContent.style.display === 'none') {
        showTocContent();
      }
      
      // 重置目录滚动位置到顶部
      tocContent.scrollTop = 0;
    });
  }
  
  // 移动端关闭目录
  if (tocClose) {
    tocClose.addEventListener('click', function() {
      closeMobileToc();
    });
  }
  
  // 点击遮罩层关闭目录
  if (tocOverlay) {
    tocOverlay.addEventListener('click', function() {
      closeMobileToc();
    });
  }
  
  // 关闭移动端目录的通用函数
  function closeMobileToc() {
    tocContainer.classList.add('translate-x-full');
    tocOverlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
  
  // 根据滚动位置获取当前的标题
  function getCurrentHeading(scrollPosition) {
    // 为滚动位置添加偏移量，使高亮更准确
    const adjustedScrollPosition = scrollPosition + 150;
    
    // 查找当前可见的标题元素
    for (let i = headings.length - 1; i >= 0; i--) {
      if (headings[i].position <= adjustedScrollPosition) {
        return headings[i];
      }
    }
    
    // 如果没有找到（页面顶部），返回第一个标题
    if (headings.length > 0) {
      return headings[0];
    }
    
    return null;
  }
  
  // 根据滚动位置更新目录高亮
  function updateTocHighlight() {
    // 如果目录被隐藏，不执行更新
    if (tocContent.style.display === 'none') {
      return;
    }
    
    // 获取当前滚动位置
    const scrollPosition = window.scrollY;
    
    // 查找当前可见的标题元素
    const currentHeading = getCurrentHeading(scrollPosition);
    
    // 如果找到当前可见的标题，更新目录高亮
    if (currentHeading) {
      const currentHeadingId = currentHeading.id;
      
      // 移除所有链接的高亮
      tocLinks.forEach(link => {
        if (link.classList.contains('active')) {
          link.classList.remove('active');
        }
      });
      
      // 为当前标题对应的链接添加高亮
      const activeLink = headingMap[currentHeadingId];
      
      if (activeLink) {
        activeLink.classList.add('active');
        
        // 确保活动链接在移动端可见
        if (window.innerWidth < 1024 && tocContainer.classList.contains('translate-x-full') === false) {
          // 仅在移动端目录打开状态下滚动到活动链接位置
          const linkOffset = activeLink.offsetTop;
          const tocContentHeight = tocContent.clientHeight;
          const scrollTop = tocContent.scrollTop;
          
          // 确保链接在可视区域内
          if (linkOffset < scrollTop || linkOffset > scrollTop + tocContentHeight - 40) {
            const newScrollTop = linkOffset - (tocContentHeight / 3); // 使其位于视图的上部三分之一处
            if (newScrollTop >= 0) {
              tocContent.scrollTop = newScrollTop;
            }
          }
        }
      }
    }
  }
  
  // 为目录中的链接添加点击事件处理程序
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // 滚动到目标元素
          const targetPosition = targetElement.offsetTop - 100; // 顶部偏移，避免被固定导航栏遮挡
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // 更新URL哈希，不触发默认的跳转
          history.pushState(null, null, href);
          
          // 手动设置高亮状态
          tocLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          
          // 在移动端，点击链接后关闭目录
          if (window.innerWidth < 1024) {
            closeMobileToc();
          }
        }
      }
    });
  });
  
  // 监听窗口滚动事件，更新目录高亮
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // 使用节流函数减少滚动事件触发频率
  window.addEventListener('scroll', throttle(function() {
    updateTocHighlight();
  }, 100));
  
  // 窗口大小变化时，需要重新计算标题位置
  window.addEventListener('resize', throttle(function() {
    updateHeadingPositions();
    updateTocHighlight();
    
    // 如果是小屏幕并且目录可见，则自动关闭目录
    if (window.innerWidth < 1024 && !tocContainer.classList.contains('translate-x-full')) {
      closeMobileToc();
    }
    
    // 如果从小屏幕切换到大屏幕，确保内容可见
    if (window.innerWidth >= 1024) {
      tocContainer.classList.remove('translate-x-full');
      document.body.classList.remove('overflow-hidden');
      if (tocOverlay) tocOverlay.classList.add('hidden');
    }
  }, 200));
  
  // 处理安全区域（针对带刘海的iPhone等）
  function updateSafeAreaInsets() {
    const style = document.createElement('style');
    style.innerHTML = `
      @supports(padding: max(0px)) {
        .toc-container {
          padding-left: max(1rem, env(safe-area-inset-left));
          padding-right: max(1rem, env(safe-area-inset-right));
        }
        .toc-overlay {
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  updateSafeAreaInsets();
  
  // 处理URL中的哈希
  function handleUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const targetId = hash.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // 等待页面布局稳定
        setTimeout(() => {
          const targetPosition = targetElement.offsetTop - 100;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // 手动更新目录高亮
          const activeLink = headingMap[targetId];
          if (activeLink) {
            tocLinks.forEach(l => l.classList.remove('active'));
            activeLink.classList.add('active');
          }
        }, 300);
      }
    }
  }
  
  // 初始化时处理URL哈希
  handleUrlHash();
  
  // 在页面加载完成后初始化高亮
  window.addEventListener('load', function() {
    updateHeadingPositions();
    updateTocHighlight();
  });
}); 