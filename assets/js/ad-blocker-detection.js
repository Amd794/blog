/**
 * 广告拦截器检测脚本
 */
document.addEventListener('DOMContentLoaded', function() {
  // 检查是否已经关闭了提示
  const dismissed = localStorage.getItem('adBlockMessageDismissed');
  const dismissedTime = localStorage.getItem('adBlockMessageDismissedTime');
  
  const shouldShowAgain = !dismissed || 
    (dismissedTime && (Date.now() - parseInt(dismissedTime)) > 24 * 60 * 60 * 1000);
  
  if (shouldShowAgain) {
    // 延迟检测，给页面加载留出时间
    setTimeout(detectAdBlock, 1000);
  }
});

/**
 * 使用多种方法检测广告拦截器
 */
async function detectAdBlock() {
  try {
    // 方法1: 尝试加载常见的广告脚本
    await Promise.all([
      // 检测方法1：尝试加载Google广告脚本
      fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store'
      }),
      // 检测方法2：尝试加载广告ID
      fetch('https://googleads.g.doubleclick.net/pagead/id', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store'
      })
    ]);

    // 方法2: 检查DOM中是否存在常见的广告容器
    const testAdElement = document.createElement('div');
    testAdElement.className = 'ads ad adsbox doubleclick ad-placement carbon-ads';
    testAdElement.style.height = '1px';
    testAdElement.style.position = 'absolute';
    testAdElement.style.left = '-10000px';
    testAdElement.style.top = '-1000px';
    testAdElement.innerHTML = '&nbsp;';
    document.body.appendChild(testAdElement);

    // 等待一小段时间，让广告拦截器有机会处理DOM
    await new Promise(resolve => setTimeout(resolve, 100));

    // 检查元素高度，如果被广告拦截器隐藏，高度应该为0
    const isBlocked = testAdElement.offsetHeight === 0;

    // 清理测试元素
    document.body.removeChild(testAdElement);

    // 如果DOM测试表明有拦截器，则显示提示
    if (isBlocked) {
      showAdBlockMessage();
    }
  } catch {
    // 如果任何请求失败，认为有拦截器
    showAdBlockMessage();
  }
}

/**
 * 显示广告拦截器提示信息
 */
function showAdBlockMessage() {
  const adBlockMessage = document.getElementById('ad-block-message');
  if (adBlockMessage) {
    adBlockMessage.style.display = 'block';
  }
}

/**
 * 关闭提示消息
 */
function closeAdBlockMessage() {
  const adBlockMessage = document.getElementById('ad-block-message');
  if (adBlockMessage) {
    adBlockMessage.style.display = 'none';
  }
  
  // 将用户选择存储在本地，避免频繁显示提示
  localStorage.setItem('adBlockMessageDismissed', 'true');
  // 存储时间戳，用于定期显示提示（比如每天一次）
  localStorage.setItem('adBlockMessageDismissedTime', Date.now().toString());
}

// 为关闭按钮添加事件监听
document.addEventListener('DOMContentLoaded', function() {
  const closeButton = document.getElementById('ad-block-close-button');
  if (closeButton) {
    closeButton.addEventListener('click', closeAdBlockMessage);
    closeButton.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        closeAdBlockMessage();
      }
    });
  }
}); 