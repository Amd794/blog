/**
 * 高级内容渲染脚本
 * 用于初始化Mermaid图表和KaTeX数学公式
 */

// 在DOM加载完成前立即定义全局变量和函数
window.hasMermaidRun = false;
window.hasKaTeXRun = false;
window.mermaidRetryCount = 0;
window.MAX_MERMAID_RETRY = 3;

// 确保Mermaid全局可用
if (typeof mermaid === 'undefined' && typeof window.mermaid !== 'undefined') {
    window.mermaid = window.mermaid;
}

// 尽早设置Mermaid配置
if (window.mermaid) {
    configMermaid();
}

// DOM加载完成后立即初始化渲染
document.addEventListener('DOMContentLoaded', function() {
    // 首先初始化Mermaid，确保在代码高亮之前完成
    setTimeout(initializeMermaid, 0);
    
    // 然后初始化KaTeX
    setTimeout(initializeKaTeX, 10);
    
    // 设置MutationObserver监控新添加的内容
    setupMutationObserver();
});

// 页面完全加载后再次检查渲染，确保不会漏掉任何图表
window.addEventListener('load', function() {
    // 确保所有图表都已渲染
    if (!window.hasMermaidRun && window.mermaid) {
        initializeMermaid();
    } else {
        // 即使标记为已运行，也进行一次确认检查
        checkForUnrenderedMermaid();
    }
    
    // 确保所有数学公式都已渲染
    if (!window.hasKaTeXRun && window.renderMathInElement) {
        initializeKaTeX();
    }
});

/**
 * 检查页面上是否有未渲染的Mermaid图表
 */
function checkForUnrenderedMermaid() {
    if (!window.mermaid) return;
    
    const mermaidDivs = document.querySelectorAll('.mermaid');
    let hasUnrendered = false;
    
    mermaidDivs.forEach(div => {
        // 检查是否包含SVG元素，如果没有则可能未渲染
        if (!div.querySelector('svg') && !div.querySelector('.mermaid-error')) {
            hasUnrendered = true;
        }
    });
    
    if (hasUnrendered && window.mermaidRetryCount < window.MAX_MERMAID_RETRY) {
        window.mermaidRetryCount++;
        setTimeout(initializeMermaid, 500);
    }
}

/**
 * 配置Mermaid选项
 */
function configMermaid() {
    if (!window.mermaid) return;
    
    // 配置Mermaid选项
    window.mermaid.initialize({
        startOnLoad: false,  // 我们将手动控制渲染
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        flowchart: {
            curve: 'basis',
            htmlLabels: true
        },
        sequence: {
            mirrorActors: false,
            wrap: true,
            rightAngles: false,
            boxMargin: 10
        },
        themeVariables: {
            primaryColor: '#3b82f6',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#2563eb',
            lineColor: '#4b5563',
            secondaryColor: '#f0f9ff',
            tertiaryColor: '#f3f4f6'
        }
    });
    
    // 检查深色模式并应用适当的主题
    if (document.documentElement.classList.contains('dark')) {
        window.mermaid.initialize({
            theme: 'dark',
            themeVariables: {
                primaryColor: '#3b82f6',
                primaryTextColor: '#ffffff',
                primaryBorderColor: '#60a5fa',
                lineColor: '#94a3b8',
                secondaryColor: '#1e293b',
                tertiaryColor: '#334155'
            }
        });
    }
}

/**
 * 初始化Mermaid图表渲染
 */
function initializeMermaid() {
    if (!window.mermaid) {
        return;
    }
    
    // 确保配置已应用
    configMermaid();
    
    // 确保所有mermaid代码块都有正确的类
    processMermaidCodeBlocks();
    
    // 运行Mermaid处理
    try {
        // 使用两种方法尝试渲染Mermaid图表
        // 1. 使用最新的API
        if (typeof window.mermaid.run === 'function') {
            window.mermaid.run({
                querySelector: '.mermaid',
                suppressErrors: true
            }).then(() => {
                window.hasMermaidRun = true;
                addMermaidStyles();
                
                // 延迟额外检查，确保所有图表都已正确渲染
                setTimeout(checkAndFixMermaidCharts, 500);
            }).catch(error => {
                // 尝试备用方法
                tryFallbackMermaidRendering();
            });
        } 
        // 2. 使用传统的init方法
        else if (typeof window.mermaid.init === 'function') {
            tryFallbackMermaidRendering();
        }
    } catch (error) {
        tryFallbackMermaidRendering();
    }
}

/**
 * 检查并修复可能未完全渲染的Mermaid图表
 */
function checkAndFixMermaidCharts() {
    const diagrams = document.querySelectorAll('.mermaid');
    
    diagrams.forEach(diagram => {
        const svg = diagram.querySelector('svg');
        
        // 检查SVG是否存在且是否可能被截断
        if (svg) {
            // 获取SVG的尺寸
            const svgRect = svg.getBoundingClientRect();
            const diagramRect = diagram.getBoundingClientRect();
            
            // 如果SVG比容器大，或者SVG高度很小，可能是渲染问题
            if (svgRect.width > diagramRect.width || svgRect.height < 20) {
                // 获取父容器
                const container = diagram.closest('.mermaid-container');
                if (container) {
                    // 确保容器可滚动
                    container.style.overflowX = 'auto';
                    
                    // 设置最小宽度，确保内容可见
                    diagram.style.minWidth = 'fit-content';
                    
                    // 重新调整容器高度
                    const svgHeight = svg.getAttribute('height');
                    if (svgHeight) {
                        container.style.minHeight = `${parseInt(svgHeight) + 40}px`;
                    }
                }
            }
        } else {
            // 如果没有SVG，可能是渲染失败
            diagram.innerHTML += '<div class="mermaid-error">图表渲染失败</div>';
            diagram.style.color = '#e53e3e';
            diagram.style.border = '1px dashed #e53e3e';
            diagram.style.padding = '1rem';
        }
    });
}

/**
 * 处理页面中的Mermaid代码块
 */
function processMermaidCodeBlocks() {
    // 查找可能的mermaid代码块并转换
    document.querySelectorAll('pre code.language-mermaid, pre code.language-merm').forEach(el => {
        const pre = el.parentElement;
        if (pre && !pre.parentElement.classList.contains('mermaid')) {
            // 创建mermaid容器
            const mermaidDiv = document.createElement('div');
            mermaidDiv.className = 'mermaid';
            mermaidDiv.innerHTML = el.textContent;
            pre.parentElement.insertBefore(mermaidDiv, pre);
            pre.style.display = 'none'; // 隐藏原始代码块
        }
    });
    
    // 查找可能未正确标记但包含Mermaid语法的代码块
    document.querySelectorAll('pre code:not(.language-mermaid):not(.language-merm)').forEach(el => {
        const content = el.textContent.trim();
        if (
            content.startsWith('sequenceDiagram') ||
            content.startsWith('graph ') ||
            content.startsWith('flowchart ') ||
            content.startsWith('gantt') ||
            content.startsWith('classDiagram') ||
            content.startsWith('stateDiagram') ||
            content.startsWith('pie') ||
            content.startsWith('journey') ||
            content.startsWith('erDiagram') ||
            content.startsWith('mindmap') ||
            content.startsWith('timeline')
        ) {
            const pre = el.parentElement;
            if (pre && !pre.parentElement.classList.contains('mermaid')) {
                // 创建mermaid容器
                const mermaidDiv = document.createElement('div');
                mermaidDiv.className = 'mermaid';
                mermaidDiv.innerHTML = content;
                pre.parentElement.insertBefore(mermaidDiv, pre);
                pre.style.display = 'none'; // 隐藏原始代码块
            }
        }
    });
}

/**
 * 使用备用方法渲染Mermaid图表
 */
function tryFallbackMermaidRendering() {
    if (!window.mermaid || typeof window.mermaid.init !== 'function') return;
    
    const mermaidDivs = document.querySelectorAll('.mermaid:not([data-processed="true"])');
    
    if (mermaidDivs.length > 0) {
        try {
            window.mermaid.init(undefined, mermaidDivs);
            window.hasMermaidRun = true;
            addMermaidStyles();
            
            // 延迟检查未完全渲染的图表
            setTimeout(checkAndFixMermaidCharts, 500);
        } catch (error) {
            // 渲染失败，标记错误
            markFailedMermaidDiagrams();
        }
    }
}

/**
 * 添加Mermaid图表所需的样式
 */
function addMermaidStyles(container = document) {
    // 为所有Mermaid容器添加样式
    const mermaidDivs = container.querySelectorAll('.mermaid');
    
    mermaidDivs.forEach(div => {
        // 如果没有父容器包裹，则创建一个
        if (!div.parentElement.classList.contains('mermaid-container')) {
            // 创建包裹容器
            const wrapper = document.createElement('div');
            wrapper.className = 'mermaid-container';
            wrapper.style.overflowX = 'auto';
            wrapper.style.maxWidth = '100%';
            wrapper.style.margin = '1.5rem 0';
            
            // 将图表移入新容器
            div.parentNode.insertBefore(wrapper, div);
            wrapper.appendChild(div);
        }
        
        // 添加基本样式到图表容器
        div.style.minWidth = 'fit-content';
        div.style.margin = '0 auto';
        div.style.textAlign = 'center';
        
        // 查找内部SVG并应用样式
        const svg = div.querySelector('svg');
        if (svg) {
            // 确保SVG在容器中居中
            svg.style.margin = '0 auto';
            svg.style.maxWidth = '100%';
            
            // 添加深色模式支持
            if (document.documentElement.classList.contains('dark')) {
                // 深色模式下的文本颜色调整
                const texts = svg.querySelectorAll('text');
                texts.forEach(text => {
                    const currentColor = text.getAttribute('fill');
                    if (currentColor === '#000' || currentColor === 'black' || !currentColor) {
                        text.setAttribute('fill', '#e2e8f0');
                    }
                });
                
                // 为深色模式调整边框颜色
                const paths = svg.querySelectorAll('path');
                paths.forEach(path => {
                    const stroke = path.getAttribute('stroke');
                    if (stroke === '#000' || stroke === 'black') {
                        path.setAttribute('stroke', '#94a3b8');
                    }
                });
                
                // 调整矩形背景
                const rects = svg.querySelectorAll('rect');
                rects.forEach(rect => {
                    const fill = rect.getAttribute('fill');
                    if (fill === '#fff' || fill === 'white' || fill === '#ffffff') {
                        rect.setAttribute('fill', '#1e293b');
                    }
                });
            }
        }
    });
}

/**
 * 标记所有渲染失败的Mermaid图表
 */
function markFailedMermaidDiagrams() {
    document.querySelectorAll('.mermaid:not([data-processed="true"])').forEach(div => {
        if (!div.querySelector('svg')) {
            div.innerHTML += '<div class="mermaid-error">图表渲染失败</div>';
            div.style.color = '#e53e3e';
            div.style.border = '1px dashed #e53e3e';
            div.style.padding = '1rem';
        }
    });
}

/**
 * 初始化KaTeX数学公式渲染
 */
function initializeKaTeX() {
    if (!window.renderMathInElement) {
        return;
    }
    
    try {
        window.renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false,
            errorColor: '#e53e3e',
            strict: false
        });
        
        window.hasKaTeXRun = true;
    } catch (error) {
        // KaTeX渲染失败
    }
}

/**
 * 设置MutationObserver监控DOM变化，自动处理新添加的内容
 */
function setupMutationObserver() {
    if (!window.MutationObserver) return;
    
    const observer = new MutationObserver(function(mutations) {
        let hasMermaidContent = false;
        let hasKaTeXContent = false;
        
        mutations.forEach(function(mutation) {
            // 如果是节点添加
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查新添加的元素是否包含Mermaid图表
                        if (
                            node.classList && 
                            (node.classList.contains('mermaid') || 
                             node.querySelector('.mermaid') ||
                             node.querySelector('code.language-mermaid') ||
                             node.querySelector('code.language-merm'))
                        ) {
                            hasMermaidContent = true;
                        }
                        
                        // 检查新添加的元素是否包含KaTeX公式
                        if (
                            node.textContent && 
                            (node.textContent.includes('$$') || 
                             node.textContent.includes('\\(') ||
                             node.textContent.includes('\\['))
                        ) {
                            hasKaTeXContent = true;
                        }
                    }
                });
            }
        });
        
        // 如果检测到新的Mermaid内容，重新渲染
        if (hasMermaidContent && window.mermaid) {
            setTimeout(initializeMermaid, 100);
        }
        
        // 如果检测到新的KaTeX内容，重新渲染
        if (hasKaTeXContent && window.renderMathInElement) {
            setTimeout(initializeKaTeX, 100);
        }
    });
    
    // 监控整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
}

// 监听主题切换，重新渲染Mermaid图表
const themeToggleButton = document.getElementById('theme-toggle');
if (themeToggleButton) {
    themeToggleButton.addEventListener('click', function() {
        // 延迟执行确保主题已切换
        setTimeout(function() {
            initializeMermaid();
        }, 100);
    });
}

// 延迟执行一次额外的检查，捕获可能的延迟加载内容
setTimeout(function() {
    checkForUnrenderedMermaid();
}, 2000); 