/**
 * 代码块增强功能
 * 提供代码语言显示、复制功能等交互
 */

document.addEventListener('DOMContentLoaded', function() {
  // 初始化highlight.js
  if (window.hljs) {
    // 移除可能存在的行号元素
    document.querySelectorAll('.line-numbers-rows, .hljs-ln-numbers, .gutter, .code-line-numbers').forEach(el => {
      el.remove();
    });
    
    // 为所有代码块应用高亮（跳过Mermaid图表）
    document.querySelectorAll('pre code').forEach(block => {
      // 检查是否为Mermaid图表
      const parent = block.parentElement;
      const isMermaid = block.classList.contains('language-mermaid') || 
                         block.classList.contains('language-merm') ||
                         (parent && parent.classList.contains('language-mermaid')) ||
                         (parent && parent.classList.contains('language-merm')) ||
                         block.textContent.trim().startsWith('graph ') ||
                         block.textContent.trim().startsWith('sequenceDiagram') ||
                         block.textContent.trim().startsWith('gantt') ||
                         block.textContent.trim().startsWith('classDiagram') ||
                         block.textContent.trim().startsWith('stateDiagram');
      
      if (isMermaid) {
        return; // 跳过Mermaid图表的高亮处理
      }
      
      try {
        hljs.highlightElement(block);
      } catch (e) {
        // 高亮处理异常
      }
    });
  }
  
  // 为所有代码块添加语言标签和复制按钮（Mermaid图表除外）
  document.querySelectorAll('pre').forEach(function(block) {
    // 检查是否为Mermaid图表容器
    const codeElement = block.querySelector('code');
    const isMermaidContainer = 
      (codeElement && codeElement.classList.contains('language-mermaid')) ||
      (codeElement && codeElement.classList.contains('language-merm')) ||
      block.classList.contains('language-mermaid') ||
      block.classList.contains('language-merm') ||
      block.parentElement.classList.contains('mermaid');
      
    if (isMermaidContainer) {
      return; // 跳过Mermaid图表的处理
    }
    
    // 确保代码块有一个code子元素
    if (!codeElement) {
      const newCodeElement = document.createElement('code');
      newCodeElement.innerHTML = block.innerHTML;
      block.innerHTML = '';
      block.appendChild(newCodeElement);
    }
    
    // 尝试不同的方式识别语言
    if (!block.hasAttribute('data-lang')) {
      const className = codeElement.className;
      let lang = 'code';
      
      // 尝试从类名中提取语言
      const langMatch = className.match(/language-(\w+)/) || className.match(/lang-(\w+)/);
      if (langMatch) {
        lang = langMatch[1];
      } 
      // 尝试从父元素类名识别
      else if (block.className) {
        const parentLangMatch = block.className.match(/language-(\w+)/) || block.className.match(/lang-(\w+)/);
        if (parentLangMatch) {
          lang = parentLangMatch[1];
        }
      }
      
      // 根据内容特征推断语言
      if (lang === 'code') {
        const content = codeElement.textContent;
        if (content.includes('def ') && content.includes(':')) {
          lang = 'python';
        } else if (content.includes('function') && content.includes('{') && content.includes('}')) {
          lang = 'javascript';
        } else if ((content.includes('class') || content.includes('interface')) && content.includes('{') && content.includes('}')) {
          lang = 'java';
        } else if (content.includes('git ') || content.includes('cd ') || content.includes('mkdir ') || 
                   content.includes('sudo ') || content.includes('apt ') || content.match(/\$\s*\w+/) ||
                   content.includes('for ') && content.includes('do') && content.includes('done') ||
                   content.includes('if ') && content.includes('then') && (content.includes('fi') || content.includes('else'))) {
          lang = 'bash';
        }
      }
      
      // 设置语言属性
      block.setAttribute('data-lang', lang);
      
      // 如果code元素没有对应的语言类，添加一个
      if (!codeElement.classList.contains(`language-${lang}`)) {
        codeElement.classList.add(`language-${lang}`);
        
        // 再次尝试高亮，但跳过Mermaid
        if (window.hljs && lang !== 'mermaid' && lang !== 'merm') {
          try {
            hljs.highlightElement(codeElement);
          } catch (e) {
            // 重新高亮失败
          }
        }
      }
    }
    
    // 移除旧的复制按钮（如果存在）
    const oldButton = block.querySelector('.code-copy-btn');
    if (oldButton) {
      oldButton.remove();
    }
    
    // 移除旧的操作容器（如果存在）
    const oldContainer = block.querySelector('.code-actions-container');
    if (oldContainer) {
      oldContainer.remove();
    }
    
    // 创建操作容器
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'code-actions-container';
    
    // 添加语言标签
    const lang = block.getAttribute('data-lang');
    const langLabel = document.createElement('span');
    langLabel.className = 'code-lang-label';
    langLabel.textContent = lang;
    actionsContainer.appendChild(langLabel);
    
    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.className = 'code-copy-btn';
    copyButton.textContent = '复制';
    
    copyButton.addEventListener('click', function() {
      const code = block.querySelector('code').textContent;
      
      try {
        navigator.clipboard.writeText(code).then(function() {
          copyButton.textContent = '已复制!';
          setTimeout(function() {
            copyButton.textContent = '复制';
          }, 2000);
        }, function(err) {
          copyButton.textContent = '复制失败';
          setTimeout(function() {
            copyButton.textContent = '复制';
          }, 2000);
        });
      } catch (e) {
        // 回退到传统复制方法
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
          document.execCommand('copy');
          copyButton.textContent = '已复制!';
        } catch (err) {
          copyButton.textContent = '复制失败';
        }
        
        document.body.removeChild(textarea);
        setTimeout(function() {
          copyButton.textContent = '复制';
        }, 2000);
      }
    });
    
    // 添加复制按钮到容器
    actionsContainer.appendChild(copyButton);
    
    // 将容器添加到代码块
    block.appendChild(actionsContainer);
  });
  
  // 禁用可能自动添加的行号
  function disableLineNumbers() {
    // 移除Hugo或其他库可能添加的行号容器
    document.querySelectorAll('.article-content pre').forEach(pre => {
      // 如果是Mermaid容器则跳过
      if (pre.classList.contains('language-mermaid') || 
          pre.classList.contains('language-merm') ||
          pre.querySelector('code.language-mermaid') ||
          pre.querySelector('code.language-merm') ||
          pre.parentElement.classList.contains('mermaid')) {
        return;
      }
      
      pre.classList.remove('line-numbers');
      const lineNumbersContainer = pre.querySelector('.line-numbers-rows');
      if (lineNumbersContainer) {
        lineNumbersContainer.remove();
      }
      
      // 移除表格形式的行号
      if (pre.querySelector('table.hljs-ln')) {
        const code = pre.querySelector('code');
        const table = pre.querySelector('table.hljs-ln');
        if (code && table) {
          // 提取纯代码内容
          const codeContent = Array.from(table.querySelectorAll('td.hljs-ln-code'))
            .map(td => td.textContent)
            .join('\n');
          
          // 替换为不带行号的代码
          code.textContent = codeContent;
          
          // 重新高亮
          if (window.hljs) {
            try {
              hljs.highlightElement(code);
            } catch (e) {
              // 高亮失败
            }
          }
        }
      }
    });
  }
  
  // 尝试禁用行号
  disableLineNumbers();
  
  // 设置代码块标签系统
  function setupCodeTabs() {
    document.querySelectorAll('.code-tabs').forEach(tabGroup => {
      const tabs = tabGroup.querySelectorAll('.code-tab-item');
      const panes = tabGroup.querySelectorAll('.code-tab-pane');
      
      // 初始化：激活第一个标签
      if (tabs.length > 0) {
        tabs[0].classList.add('active');
      }
      
      if (panes.length > 0) {
        panes[0].classList.add('active');
        // 确保第一个代码块正确高亮
        const firstCodeBlock = panes[0].querySelector('pre code');
        if (firstCodeBlock && window.hljs) {
          setTimeout(() => {
            try {
              hljs.highlightElement(firstCodeBlock);
            } catch (e) {
              // 高亮失败
            }
          }, 0);
        }
      }
      
      // 为每个标签添加点击事件
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
          // 移除所有活动状态
          tabs.forEach(t => t.classList.remove('active'));
          panes.forEach(p => p.classList.remove('active'));
          
          // 设置当前标签和面板为活动状态
          tab.classList.add('active');
          if (panes[index]) {
            panes[index].classList.add('active');
            
            // 确保代码高亮
            const codeBlock = panes[index].querySelector('pre code');
            if (codeBlock && window.hljs) {
              setTimeout(() => {
                try {
                  hljs.highlightElement(codeBlock);
                } catch (e) {
                  // 高亮失败
                }
              }, 0);
            }
          }
        });
      });
    });
  }
  
  // 设置代码标签系统
  setupCodeTabs();
  
  // 延迟确保所有代码块都正确高亮
  setTimeout(() => {
    if (window.hljs) {
      document.querySelectorAll('pre code:not(.mermaid):not(.language-mermaid):not(.language-merm)').forEach(block => {
        if (!block.parentElement.classList.contains('mermaid')) {
          try {
            hljs.highlightElement(block);
          } catch (e) {
            // 高亮失败
          }
        }
      });
    }
  }, 500);
}); 