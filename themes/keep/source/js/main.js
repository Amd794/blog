/* global KEEP */

window.addEventListener('DOMContentLoaded', () => {
  const { version, local_search, lazyload } = KEEP.theme_config

  KEEP.themeInfo = {
    theme: `Keep v${version}`,
    author: 'XPoet',
    repository: 'https://github.com/XPoet/hexo-theme-keep',
    localStorageKey: 'KEEP-THEME-STATUS',
    styleStatus: {
      isDark: false,
      fontSizeLevel: 0,
      isShowToc: true
    }
  }


  // set version number of footer
  KEEP.setFooterVersion = () => {
    const vd = document.querySelector('.footer .keep-version')
    vd && (vd.innerHTML = KEEP.themeInfo.theme)
  }

  // set styleStatus to localStorage
  KEEP.setStyleStatus = () => {
    localStorage.setItem(KEEP.themeInfo.localStorageKey, JSON.stringify(KEEP.themeInfo.styleStatus))
  }

  // get styleStatus from localStorage
  KEEP.getStyleStatus = () => {
    let temp = localStorage.getItem(KEEP.themeInfo.localStorageKey)
    if (temp) {
      temp = JSON.parse(temp)
      for (let key in KEEP.themeInfo.styleStatus) {
        KEEP.themeInfo.styleStatus[key] = temp[key]
      }
      return temp
    } else {
      return null
    }
  }

  // init prototype function
  KEEP.initPrototype = () => {
    HTMLElement.prototype.wrap = function (wrapper) {
      this.parentNode.insertBefore(wrapper, this)
      this.parentNode.removeChild(this)
      wrapper.appendChild(this)
    }
  }
  KEEP.initPrototype()

  KEEP.initExecute = () => {
    KEEP.initUtils()
    KEEP.initHeaderShrink()
    KEEP.initModeToggle()
    KEEP.initBack2Top()
    KEEP.initCodeBlock()
    KEEP.setFooterVersion()

    if (local_search?.enable === true) {
      KEEP.initLocalSearch()
    }

    if (lazyload?.enable === true) {
      KEEP.initLazyLoad()
    }
  }
  KEEP.initExecute()
})
