import Vue from 'vue'

import 'normalize.css/normalize.css' // 一个现代的替代CSS重置

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // 全局 css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // 路由权限控制

/**
  *如果您不想使用模拟服务器
  *你想使用MockJs的mock api
  *你可以执行:mockXHR()
  *目前MockJs将用于生产环境，
  *请在上网前删除!！ ！
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

// 将CategorySelect升级为全局组件
import CategorySelect from '@/components/CategorySelect'
Vue.component('CategorySelect', CategorySelect);

// 自定义HintButton组件
import HintButton from '@/components/HintButton'
Vue.component('HintButton', HintButton)

// 引入相关API接口
import API from '@/api'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  beforeMount() {
    // API接口
    Vue.prototype.$API = API
    Vue.prototype.$bus = this
  }
})
