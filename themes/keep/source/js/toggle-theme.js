/* global KEEP */

KEEP.initModeToggle = () => {
  KEEP.utils.modeToggle = {
    themeModeToggleBtn: document.querySelector('.tool-toggle-theme-mode'),
    iconDom: document.querySelector('.tool-toggle-theme-mode i'),

    enableLightMode() {
      document.documentElement.classList.remove('dark-mode')
      document.documentElement.classList.add('light-mode')
      this.iconDom.className = 'fas fa-moon'
      KEEP.themeInfo.styleStatus.isDark = false
      KEEP.setStyleStatus()
    },

    enableDarkMode() {
      document.documentElement.classList.add('dark-mode')
      document.documentElement.classList.remove('light-mode')
      this.iconDom.className = 'fas fa-sun'
      KEEP.themeInfo.styleStatus.isDark = true
      KEEP.setStyleStatus()
    },

    isDarkPrefersColorScheme() {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
    },

    initModeStatus() {
      const configMode = KEEP.theme_config?.base_info?.mode

      if (configMode === 'dark') {
        this.enableDarkMode()
        return
      }

      if (configMode === 'light') {
        this.enableLightMode()
        return
      }

      const styleStatus = KEEP.getStyleStatus()

      if (styleStatus) {
        styleStatus.isDark ? this.enableDarkMode() : this.enableLightMode()
      } else {
        this.isDarkPrefersColorScheme().matches ? this.enableDarkMode() : this.enableLightMode()
      }
    },

    initModeToggleButton() {
      this.themeModeToggleBtn.addEventListener('click', (event) => {
        const isDark = document.documentElement.classList.contains('dark-mode')
        const transition = document.startViewTransition(() => {
          isDark ? this.enableLightMode() : this.enableDarkMode()
        })
        const clientX = event.clientX
        const clientY = event.clientY
        const circleRadius = Math.hypot(
          Math.max(clientX, window.innerWidth - clientX),
          Math.max(clientY, window.innerHeight - clientY)
        )
        transition.ready.then(() => {
          // 自定义动画
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0% at ${clientX}px ${clientY}px)`,
                `circle(${circleRadius}px at ${clientX}px ${clientY}px)`
              ]
            },
            {
              duration: 800,
              pseudoElement: "::view-transition-new(root)"
            }
          )
        })
      })
    },

    initModeAutoTrigger() {
      const isDarkMode = this.isDarkPrefersColorScheme()
      isDarkMode.addEventListener('change', (e) => {
        e.matches ? this.enableDarkMode() : this.enableLightMode()
      })
    }
  }

  KEEP.utils.modeToggle.initModeStatus()
  KEEP.utils.modeToggle.initModeToggleButton()
  KEEP.utils.modeToggle.initModeAutoTrigger()
}
