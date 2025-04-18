import 'element-plus/dist/index.css'
import 'github-markdown-css/github-markdown.css'
import 'highlight.js/styles/default.css'
import 'uno.css'

import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)

app.mount('#app')
