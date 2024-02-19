hexo.extend.injector.register('head_end', `
    <script id="LA_COLLECT" charset="UTF-8" src="//sdk.51.la/js-sdk-pro.min.js"></script>
    <script>LA.init({id: "3Gbf5SJIqASrRpwv", ck: "3Gbf5SJIqASrRpwv"})</script>
    
    <script type="text/javascript">
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "kwgf4jvqf3");
    </script>
    
    
    <link href="https://cdn.bootcdn.net/ajax/libs/viewerjs/1.7.1/viewer.min.css" rel="stylesheet">
    <script src="https://cdn.bootcdn.net/ajax/libs/viewerjs/1.7.1/viewer.min.js"></script>
    <script type="text/javascript">
        window.onload=function() {
           new Viewer(document.querySelector('.keep-markdown-body'))
        }
    </script>
`);
