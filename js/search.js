/**
 * 博客搜索功能
 * 使用原生 JavaScript 实现简单搜索
 */

// 全局变量
let searchData = [];
let isSearchInitialized = false;

// 搜索设置
const searchConfig = {
  // 搜索结果数量限制
  resultLimit: 20
};

/**
 * 简单的字符串匹配搜索函数
 * @param {string} text - 要搜索的文本
 * @param {string} query - 搜索查询
 * @returns {Object} - 匹配信息，包括是否匹配和匹配位置
 */
function simpleMatch(text, query) {
  if (!text || !query) return { matched: false };
  
  // 转换为小写并去除空格以进行不区分大小写的搜索
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // 检查是否包含查询字符串
  const index = textLower.indexOf(queryLower);
  if (index !== -1) {
    return {
      matched: true,
      index: index,
      length: query.length
    };
  }
  
  return { matched: false };
}

/**
 * 高亮文本中的关键词
 * @param {string} text - 原始文本
 * @param {string} query - 搜索关键词
 * @returns {string} - 高亮后的HTML
 */
function highlightKeyword(text, query) {
  if (!text || !query || query.trim() === '') return text;
  
  const match = simpleMatch(text, query);
  if (!match.matched) return text;
  
  // 提取匹配前、匹配部分和匹配后的文本
  const before = text.substring(0, match.index);
  const matched = text.substring(match.index, match.index + match.length);
  const after = text.substring(match.index + match.length);
  
  // 构建高亮HTML，使用更高对比度的颜色组合
  return `${before}<span class="bg-yellow-200 text-gray-900 dark:bg-amber-500 dark:text-gray-900 font-medium px-0.5 rounded">${matched}</span>${after}`;
}

/**
 * 创建带有上下文的摘要，并高亮关键词
 * @param {string} content - 完整内容
 * @param {string} query - 搜索关键词
 * @returns {string} - 带有高亮关键词的摘要HTML
 */
function createHighlightedExcerpt(content, query) {
  if (!content || !query) return '';
  
  const match = simpleMatch(content, query);
  if (!match.matched) {
    // 如果没有匹配，返回前150个字符
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  }
  
  // 计算摘要的起始和结束位置，确保关键词在摘要中间
  let start = Math.max(0, match.index - 60);
  let end = Math.min(content.length, match.index + match.length + 60);
  
  // 如果摘要不是从内容开头开始，添加省略号
  let excerpt = (start > 0 ? '...' : '') + content.substring(start, end);
  
  // 如果摘要不是在内容末尾结束，添加省略号
  if (end < content.length) excerpt += '...';
  
  // 高亮关键词
  return highlightKeyword(excerpt, query);
}

/**
 * 从页面或预生成的索引文件获取搜索数据
 */
async function fetchSearchData() {
  try {
    // 尝试从预生成的 JSON 索引文件获取数据
    const response = await fetch("/index.json");
    
    // 如果找到预生成的索引文件，使用它
    if (response.ok) {
      const data = await response.json();
      
      // 处理数据
      searchData = data.map((item, index) => ({
        id: index,
        title: item.title || "",
        content: item.content || item.summary || "",
        summary: item.description || item.summary || "",
        permalink: item.permalink || item.url || "",
        date: item.date || ""
      }));
      
      isSearchInitialized = true;
      
      // 隐藏初始化状态提示
      const initStatus = document.getElementById("init-status");
      if (initStatus) {
        initStatus.classList.add("hidden");
      }
      
      return;
    }
  } catch (error) {
    // 静默处理错误
  }
  
  // 作为备用方案：从页面内容获取数据
  try {
    // 获取所有文章链接
    const contentLinks = await scanPageForArticleLinks();
    
    // 如果没有找到链接，使用一些示例数据
    if (contentLinks.length === 0) {
      searchData = [
        {
          id: 0,
          title: "示例文章",
          permalink: "/posts/example/",
          date: "2023-01-01",
          summary: "这是一篇示例文章，用于在找不到实际内容时展示",
          content: "当搜索系统无法找到实际的文章内容时，会显示这篇示例文章。这可能是因为您的站点还没有任何文章，或者搜索系统无法索引您的内容。"
        }
      ];
      
      isSearchInitialized = true;
      return;
    }
    
    // 处理收集到的链接
    let id = 0;
    contentLinks.forEach(({href, title}) => {
      // 提取可能的日期
      let date = "";
      const dateMatch = href.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
      if (dateMatch) {
        date = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
      }
      
      // 添加到搜索数据
      const item = {
        id: id++,
        title: title,
        permalink: href,
        date: date,
        summary: `查看"${title}"的详细内容`,
        content: title // 初始只用标题作为内容
      };
      
      searchData.push(item);
    });
    
    isSearchInitialized = true;
    
    // 隐藏初始化状态提示
    const initStatus = document.getElementById("init-status");
    if (initStatus) {
      initStatus.classList.add("hidden");
    }
  } catch (error) {
    // 出错时也添加一些示例数据
    createFallbackSearchData();
  }
}

/**
 * 扫描页面查找文章链接
 */
async function scanPageForArticleLinks() {
  // 如果当前页面不是搜索页，尝试先获取首页内容
  if (window.location.pathname.includes('/search/')) {
    try {
      const homeResponse = await fetch('/');
      if (homeResponse.ok) {
        const homeHtml = await homeResponse.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = homeHtml;
        return extractArticleLinks(tempDiv);
      }
    } catch (error) {
      // 静默处理错误
    }
  }
  
  // 回退到从当前页面提取链接
  return extractArticleLinks(document);
}

/**
 * 从DOM元素中提取文章链接
 */
function extractArticleLinks(rootElement) {
  const mainSections = ["posts", "post", "blog", "article", "articles"];
  const contentLinks = [];
  
  // 更全面地搜索可能的文章链接
  rootElement.querySelectorAll("a").forEach(link => {
    const href = link.getAttribute("href");
    if (href && typeof href === "string" && href.startsWith("/") && !href.includes("#")) {
      // 检查是否像文章链接
      const isArticleLink = mainSections.some(section => href.includes(`/${section}/`)) || 
                           /\/\d{4}\/\d{2}\//.test(href) || // 日期格式
                           (href.split("/").length >= 3 && !href.endsWith("/")); // 深层路径
      
      if (isArticleLink) {
        contentLinks.push({
          href: href,
          title: link.textContent.trim() || href.split("/").pop().replace(/-/g, " ")
        });
      }
    }
  });
  
  return contentLinks;
}

/**
 * 创建备用搜索数据
 */
function createFallbackSearchData() {
  searchData = [
    {
      id: 0,
      title: "搜索系统遇到问题",
      permalink: "/",
      date: "",
      summary: "搜索系统无法加载索引数据",
      content: "搜索系统遇到问题，无法加载索引数据。这可能是临时性问题，请尝试刷新页面或稍后再试。"
    }
  ];
  
  isSearchInitialized = true;
  
  // 更新初始化状态提示
  const initStatus = document.getElementById("init-status");
  if (initStatus) {
    initStatus.innerHTML = `
      <div class="flex items-center text-yellow-600 dark:text-yellow-400">
        <iconify-icon icon="mdi:alert-circle" class="mr-2" width="20" height="20"></iconify-icon>
        <span>搜索使用了备用数据，可能无法找到所有内容</span>
      </div>
    `;
  }
}

/**
 * 执行搜索
 * @param {string} query - 搜索查询
 * @returns {Array} - 搜索结果
 */
function performSearch(query) {
  if (!isSearchInitialized) {
    return [];
  }
  
  if (!query || query.trim() === "") {
    return [];
  }
  
  // 确保查询字符串已整理
  query = query.trim();
  
  // 使用简单匹配搜索标题、内容和摘要
  const results = searchData.filter(item => {
    const titleMatch = simpleMatch(item.title, query);
    const contentMatch = simpleMatch(item.content, query);
    const summaryMatch = simpleMatch(item.summary, query);
    
    // 设置匹配分数（用于排序）
    if (titleMatch.matched) {
      item.score = 3; // 标题匹配分数最高
      item.titleHighlighted = highlightKeyword(item.title, query);
    } else {
      item.titleHighlighted = item.title;
    }
    
    if (summaryMatch.matched) {
      item.score = item.score || 2; // 摘要匹配次之
      item.summaryHighlighted = highlightKeyword(item.summary, query);
    } else {
      item.summaryHighlighted = item.summary;
    }
    
    if (contentMatch.matched) {
      item.score = item.score || 1; // 内容匹配分数最低
      // 创建带有上下文的高亮摘要
      item.contentHighlighted = createHighlightedExcerpt(item.content, query);
    } else {
      item.contentHighlighted = item.content && item.content.length > 150 ? 
        item.content.substring(0, 150) + '...' : item.content;
    }
    
    // 保存查询词，用于后续处理
    item.searchQuery = query;
    
    return titleMatch.matched || contentMatch.matched || summaryMatch.matched;
  });
  
  // 按分数排序
  results.sort((a, b) => b.score - a.score);
  
  // 限制结果数量
  return results.slice(0, searchConfig.resultLimit);
}

/**
 * 渲染搜索结果
 * @param {Array} results - 搜索结果
 */
function renderResults(results) {
  const resultsContainer = document.getElementById("search-results");
  const noResultsContainer = document.getElementById("no-results");
  const loadingIndicator = document.getElementById("loading");
  
  if (!resultsContainer || !noResultsContainer) {
    return;
  }
  
  // 隐藏加载指示器
  if (loadingIndicator) {
    loadingIndicator.classList.add("hidden");
  }
  
  // 清空结果容器
  resultsContainer.innerHTML = "";
  
  // 显示结果或无结果消息
  if (results.length === 0) {
    resultsContainer.classList.add("hidden");
    noResultsContainer.classList.remove("hidden");
  } else {
    resultsContainer.classList.remove("hidden");
    noResultsContainer.classList.add("hidden");
    
    // 渲染每个结果项
    results.forEach(item => {
      const resultElement = document.createElement("article");
      resultElement.className = "bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-4 hover:shadow-md transition-shadow duration-300";
      
      // 格式化日期显示
      const dateDisplay = item.date ? `
        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span class="flex items-center">
            <iconify-icon icon="mdi:calendar" class="mr-1" width="16" height="16"></iconify-icon>
            ${item.date}
          </span>
        </div>
      ` : "";
      
      // 使用高亮的标题和内容
      const title = item.titleHighlighted || item.title;
      const content = item.contentHighlighted || item.summaryHighlighted || item.summary || item.content || "";
      
      // 构建结果项 HTML
      resultElement.innerHTML = `
        <h2 class="text-xl font-bold mb-2">
          <a href="${item.permalink}" class="text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200">
            ${title}
          </a>
        </h2>
        ${dateDisplay}
        <div class="text-gray-700 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-l-4 border-blue-500 dark:border-blue-600">
          ${content}
        </div>
        <a href="${item.permalink}" class="inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-300">
          阅读全文
          <iconify-icon icon="mdi:arrow-right" class="ml-1" width="16" height="16"></iconify-icon>
        </a>
      `;
      
      resultsContainer.appendChild(resultElement);
    });
  }
}

/**
 * 初始化搜索功能
 */
async function initSearch() {
  try {
    // 获取搜索数据
    await fetchSearchData();
    
    // 获取搜索元素
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const loadingIndicator = document.getElementById("loading");
    
    if (!searchInput || !searchButton) {
      return;
    }
    
    // 设置搜索按钮点击事件
    searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query) {
        if (loadingIndicator) loadingIndicator.classList.remove("hidden");
        
        // 执行搜索并渲染结果
        setTimeout(() => {
          const results = performSearch(query);
          renderResults(results);
        }, 300);
      }
    });
    
    // 设置回车键搜索
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
          if (loadingIndicator) loadingIndicator.classList.remove("hidden");
          
          // 执行搜索并渲染结果
          setTimeout(() => {
            const results = performSearch(query);
            renderResults(results);
          }, 300);
        }
      }
    });
    
    // 处理 URL 参数中的搜索查询
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get("q");
    if (queryParam) {
      searchInput.value = queryParam;
      
      if (loadingIndicator) loadingIndicator.classList.remove("hidden");
      
      // 延迟执行搜索，确保页面已完全加载
      setTimeout(() => {
        const results = performSearch(queryParam);
        renderResults(results);
      }, 500);
    }
  } catch (error) {
    // 更新初始化状态提示
    const initStatus = document.getElementById("init-status");
    if (initStatus) {
      initStatus.innerHTML = `
        <div class="flex items-center text-red-600">
          <iconify-icon icon="mdi:alert" class="mr-2" width="20" height="20"></iconify-icon>
          <span>搜索初始化失败：${error.message}</span>
        </div>
      `;
    }
  }
}

// 页面加载时初始化搜索
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initSearch);
} else {
  // 如果页面已经加载完成，则直接初始化
  initSearch();
} 