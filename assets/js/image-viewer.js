/**
 * 图片查看器 - 允许文章正文中的图片点击查看大图
 * 提供流畅的图片浏览体验，支持键盘导航、手势操作和辅助功能
 */

document.addEventListener('DOMContentLoaded', () => {
  // 查找文章内容区域
  const articleContent = document.querySelector('.article-content');
  if (!articleContent) return;

  // 创建图片查看器容器
  const imageViewerContainer = document.createElement('div');
  imageViewerContainer.id = 'image-viewer-container';
  imageViewerContainer.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-md hidden';
  imageViewerContainer.setAttribute('aria-hidden', 'true');
  imageViewerContainer.setAttribute('role', 'dialog');
  imageViewerContainer.setAttribute('aria-modal', 'true');
  imageViewerContainer.setAttribute('aria-label', '图片查看器');
  
  // 创建图片查看器内容
  imageViewerContainer.innerHTML = `
    <div class="relative w-full h-full p-4 md:p-8 flex items-center justify-center">
      <div class="image-viewer-content w-full h-full flex items-center justify-center">
        <div class="image-loader"></div>
        <img src="" alt="" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300 opacity-0" />
      </div>
      
      <div class="bottom-controls-container absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center pb-4">
        <div id="image-caption" class="px-4 py-2 bg-gray-800 bg-opacity-70 text-white rounded-lg max-w-md text-sm mb-3"></div>
        
        <div class="control-bar flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-full">
          <button id="image-viewer-prev" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="上一张图片" tabindex="0">
            <iconify-icon icon="mdi:chevron-left" width="20" height="20"></iconify-icon>
          </button>
          
          <button id="image-viewer-rotate-left" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="向左旋转" tabindex="0">
            <iconify-icon icon="mdi:rotate-left" width="20" height="20"></iconify-icon>
          </button>
          
          <button id="image-viewer-zoom-out" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="缩小图片" tabindex="0">
            <iconify-icon icon="mdi:magnify-minus" width="20" height="20"></iconify-icon>
          </button>
          
          <button id="image-viewer-reset" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="重置图片大小" tabindex="0">
            <iconify-icon icon="mdi:refresh" width="20" height="20"></iconify-icon>
          </button>
          
          <button id="image-viewer-zoom-in" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="放大图片" tabindex="0">
            <iconify-icon icon="mdi:magnify-plus" width="20" height="20"></iconify-icon>
          </button>
          
          <button id="image-viewer-rotate-right" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="向右旋转" tabindex="0">
            <iconify-icon icon="mdi:rotate-right" width="20" height="20"></iconify-icon>
          </button>
          
          <button id="image-viewer-next" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="下一张图片" tabindex="0">
            <iconify-icon icon="mdi:chevron-right" width="20" height="20"></iconify-icon>
          </button>
          
          <div class="mx-2 h-6 w-px bg-gray-400 bg-opacity-50"></div>
          
          <button id="image-viewer-download" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="下载图片" tabindex="0">
            <iconify-icon icon="mdi:download" width="20" height="20"></iconify-icon>
          </button>
          
          <button id="image-viewer-close" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="关闭图片查看器" tabindex="0">
            <iconify-icon icon="mdi:close" width="20" height="20"></iconify-icon>
          </button>
        </div>
      </div>
    </div>
  `;
  
  // 添加到DOM
  document.body.appendChild(imageViewerContainer);
  
  // 获取元素引用
  const viewerImage = imageViewerContainer.querySelector('img');
  const imageLoader = imageViewerContainer.querySelector('.image-loader');
  const closeButton = imageViewerContainer.querySelector('#image-viewer-close');
  const downloadButton = imageViewerContainer.querySelector('#image-viewer-download');
  const zoomInButton = imageViewerContainer.querySelector('#image-viewer-zoom-in');
  const zoomOutButton = imageViewerContainer.querySelector('#image-viewer-zoom-out');
  const resetButton = imageViewerContainer.querySelector('#image-viewer-reset');
  const rotateLeftButton = imageViewerContainer.querySelector('#image-viewer-rotate-left');
  const rotateRightButton = imageViewerContainer.querySelector('#image-viewer-rotate-right');
  const prevButton = imageViewerContainer.querySelector('#image-viewer-prev');
  const nextButton = imageViewerContainer.querySelector('#image-viewer-next');
  const imageCaption = imageViewerContainer.querySelector('#image-caption');

  // 查找文章中的所有图片
  const articleImages = articleContent.querySelectorAll('img');
  let currentImageIndex = 0;
  
  // 状态变量
  let currentScale = 1;
  let currentRotation = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;
  
  // 为每个图片添加点击事件和可访问性属性
  articleImages.forEach((img, index) => {
    // 添加鼠标样式和指示
    img.style.cursor = 'zoom-in';
    
    // 添加可访问性属性
    img.setAttribute('tabindex', '0');
    img.setAttribute('aria-label', `${img.alt || '图片'} (点击查看大图)`);
    img.setAttribute('data-index', index);
    
    // 添加点击事件
    const handleOpen = () => {
      openImageViewer(index);
    };
    
    // 鼠标点击
    img.addEventListener('click', handleOpen);
    
    // 键盘访问
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });
  });
  
  // 打开图片查看器
  function openImageViewer(index) {
    currentImageIndex = index;
    const img = articleImages[index];
    
    // 重置变换状态
    resetImageTransform();
    
    // 显示加载指示器
    imageLoader.style.display = 'block';
    viewerImage.classList.add('opacity-0');
    
    // 设置图片源
    viewerImage.src = img.src;
    viewerImage.alt = img.alt || '图片';
    
    // 设置图片标题
    imageCaption.textContent = img.alt || img.title || '';
    imageCaption.style.display = imageCaption.textContent ? 'block' : 'none';
    
    // 显示查看器
    imageViewerContainer.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
    
    // 更新导航按钮状态
    updateNavigationButtons();
    
    // 图片加载完成后
    viewerImage.onload = () => {
      imageLoader.style.display = 'none';
      viewerImage.classList.remove('opacity-0');
      viewerImage.classList.add('fade-in');
      
      // 焦点管理
      closeButton.focus();
    };
    
    // 图片加载失败
    viewerImage.onerror = () => {
      imageLoader.style.display = 'none';
      viewerImage.src = '/images/image-error.svg'; // 替换为错误图片
      viewerImage.classList.remove('opacity-0');
    };
  }
  
  // 更新导航按钮状态
  function updateNavigationButtons() {
    // 如果只有一张图片，禁用导航按钮
    if (articleImages.length <= 1) {
      prevButton.disabled = true;
      nextButton.disabled = true;
      prevButton.classList.add('opacity-50', 'cursor-not-allowed');
      nextButton.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      // 更新禁用状态
      if (currentImageIndex === 0) {
        prevButton.classList.add('opacity-50', 'cursor-not-allowed');
        prevButton.disabled = true;
      } else {
        prevButton.classList.remove('opacity-50', 'cursor-not-allowed');
        prevButton.disabled = false;
      }
      
      if (currentImageIndex === articleImages.length - 1) {
        nextButton.classList.add('opacity-50', 'cursor-not-allowed');
        nextButton.disabled = true;
      } else {
        nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
        nextButton.disabled = false;
      }
    }
  }
  
  // 重置图片变换
  function resetImageTransform() {
    currentScale = 1;
    currentRotation = 0;
    translateX = 0;
    translateY = 0;
    applyImageTransform();
  }
  
  // 应用图片变换
  function applyImageTransform() {
    viewerImage.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${currentRotation}deg) scale(${currentScale})`;
  }
  
  // 关闭查看器的处理函数
  const handleClose = () => {
    imageViewerContainer.classList.add('hidden');
    document.body.style.overflow = ''; // 恢复滚动
    
    // 重置变换
    resetImageTransform();
    
    // 重置焦点
    const currentImg = articleImages[currentImageIndex];
    if (currentImg) {
      currentImg.focus();
    }
  };
  
  // 导航到上一张图片
  const navigateToPrev = () => {
    if (currentImageIndex > 0) {
      openImageViewer(currentImageIndex - 1);
    }
  };
  
  // 导航到下一张图片
  const navigateToNext = () => {
    if (currentImageIndex < articleImages.length - 1) {
      openImageViewer(currentImageIndex + 1);
    }
  };
  
  // 缩放图片
  const zoomIn = () => {
    currentScale += 0.1;
    currentScale = Math.min(5, currentScale);
    applyImageTransform();
  };
  
  const zoomOut = () => {
    currentScale -= 0.1;
    currentScale = Math.max(0.1, currentScale);
    applyImageTransform();
  };
  
  // 旋转图片
  const rotateLeft = () => {
    currentRotation -= 90;
    applyImageTransform();
  };
  
  const rotateRight = () => {
    currentRotation += 90;
    applyImageTransform();
  };
  
  // 下载按钮事件
  const handleDownload = () => {
    // 创建一个临时链接来下载图片
    const a = document.createElement('a');
    a.href = viewerImage.src;
    a.download = viewerImage.alt || 'image';
    a.target = '_blank';
    a.click();
  };
  
  // 绑定事件处理程序
  closeButton.addEventListener('click', handleClose);
  downloadButton.addEventListener('click', handleDownload);
  prevButton.addEventListener('click', navigateToPrev);
  nextButton.addEventListener('click', navigateToNext);
  zoomInButton.addEventListener('click', zoomIn);
  zoomOutButton.addEventListener('click', zoomOut);
  resetButton.addEventListener('click', resetImageTransform);
  rotateLeftButton.addEventListener('click', rotateLeft);
  rotateRightButton.addEventListener('click', rotateRight);
  
  // 键盘事件处理
  document.addEventListener('keydown', (e) => {
    if (imageViewerContainer.classList.contains('hidden')) return;
    
    switch (e.key) {
      case 'Escape':
        handleClose();
        break;
      case 'ArrowLeft':
        navigateToPrev();
        break;
      case 'ArrowRight':
        navigateToNext();
        break;
      case 'ArrowUp':
      case '+':
        zoomIn();
        break;
      case 'ArrowDown':
      case '-':
        zoomOut();
        break;
      case 'r':
        rotateRight();
        break;
      case 'l':
        rotateLeft();
        break;
      case '0':
        resetImageTransform();
        break;
    }
  });
  
  // 点击背景关闭
  imageViewerContainer.addEventListener('click', (e) => {
    if (e.target === imageViewerContainer) {
      handleClose();
    }
  });
  
  // 图片拖动功能
  viewerImage.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // 只响应左键
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    viewerImage.style.cursor = 'grabbing';
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    applyImageTransform();
    e.preventDefault();
  });
  
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    viewerImage.style.cursor = 'grab';
  });
  
  // 阻止图片默认拖拽行为
  viewerImage.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });
  
  // 滚轮缩放
  imageViewerContainer.addEventListener('wheel', (e) => {
    if (!imageViewerContainer.classList.contains('hidden')) {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    }
  }, { passive: false });
  
  // 触摸支持
  let initialTouchDistance = 0;
  let initialScale = 1;
  let touchStartX = 0;
  let touchStartY = 0;
  
  viewerImage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      // 单指触摸 - 准备移动
      isDragging = true;
      touchStartX = e.touches[0].clientX - translateX;
      touchStartY = e.touches[0].clientY - translateY;
    } else if (e.touches.length === 2) {
      // 双指触摸 - 准备缩放
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialTouchDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      initialScale = currentScale;
    }
  }, { passive: false });
  
  viewerImage.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && isDragging) {
      // 单指移动
      translateX = e.touches[0].clientX - touchStartX;
      translateY = e.touches[0].clientY - touchStartY;
      applyImageTransform();
    } else if (e.touches.length === 2) {
      // 双指缩放
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      currentScale = initialScale * (currentDistance / initialTouchDistance);
      currentScale = Math.max(0.1, Math.min(5, currentScale));
      applyImageTransform();
    }
  }, { passive: false });
  
  viewerImage.addEventListener('touchend', () => {
    isDragging = false;
    initialTouchDistance = 0;
  });
  
  // 双击缩放
  viewerImage.addEventListener('dblclick', (e) => {
    if (currentScale === 1) {
      currentScale = 2;
      // 以双击位置为中心进行缩放
      const rect = viewerImage.getBoundingClientRect();
      const offsetX = (e.clientX - rect.left) / rect.width;
      const offsetY = (e.clientY - rect.top) / rect.height;
      translateX = (1 - currentScale) * rect.width * offsetX;
      translateY = (1 - currentScale) * rect.height * offsetY;
    } else {
      resetImageTransform();
    }
    applyImageTransform();
  });
  
  // 添加手势指示
  const gestureIndicator = document.createElement('div');
  gestureIndicator.className = 'gesture-indicator fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm hidden';
  gestureIndicator.innerHTML = '双指缩放 • 拖动移动 • 双击放大';
  document.body.appendChild(gestureIndicator);
  
  // 首次打开图片查看器时显示手势提示
  let hasShownGestureIndicator = false;
  
  // 监听图片查看器显示状态
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        const isHidden = imageViewerContainer.classList.contains('hidden');
        if (!isHidden && !hasShownGestureIndicator) {
          // 显示手势提示
          gestureIndicator.classList.remove('hidden');
          gestureIndicator.classList.add('fade-in');
          
          // 3秒后隐藏
          setTimeout(() => {
            gestureIndicator.classList.add('fade-out');
            setTimeout(() => {
              gestureIndicator.classList.add('hidden');
              gestureIndicator.classList.remove('fade-in', 'fade-out');
            }, 500);
          }, 3000);
          
          hasShownGestureIndicator = true;
        }
      }
    });
  });
  
  observer.observe(imageViewerContainer, { attributes: true });
  
  // 控制栏自动隐藏功能
  const controlBarContainer = imageViewerContainer.querySelector('.bottom-controls-container');
  let controlBarTimeout;
  
  // 显示控制栏
  const showControlBar = () => {
    controlBarContainer.classList.remove('control-bar-hidden');
    clearTimeout(controlBarTimeout);
    
    // 3秒后自动隐藏
    controlBarTimeout = setTimeout(() => {
      if (!imageViewerContainer.classList.contains('hidden')) {
        controlBarContainer.classList.add('control-bar-hidden');
      }
    }, 3000);
  };
  
  // 鼠标移动时显示控制栏
  imageViewerContainer.addEventListener('mousemove', showControlBar);
  
  // 触摸时显示控制栏
  imageViewerContainer.addEventListener('touchstart', showControlBar);
  
  // 控制栏悬停时取消自动隐藏
  controlBarContainer.addEventListener('mouseenter', () => {
    clearTimeout(controlBarTimeout);
  });
  
  // 控制栏移出时恢复自动隐藏
  controlBarContainer.addEventListener('mouseleave', () => {
    controlBarTimeout = setTimeout(() => {
      if (!imageViewerContainer.classList.contains('hidden')) {
        controlBarContainer.classList.add('control-bar-hidden');
      }
    }, 3000);
  });
  
  // 打开图片查看器时显示控制栏
  const originalOpenImageViewer = openImageViewer;
  openImageViewer = (index) => {
    originalOpenImageViewer(index);
    showControlBar();
  };
}); 