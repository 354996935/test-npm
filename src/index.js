import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'

// gneta 自定义组件
import GneteDemo from './components/gnete-demo/index.js'
import GneteBaseLayout from './components/gnete-base-layout/index.js'

import routerInstance from './router'
import { baseStore } from './store'
import * as utils from './utils'
import './icons'

const components = [
  GneteDemo,
  GneteBaseLayout
]

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

// 创建路由
const createRouterFn = async({ routes = [], otherRoutes, roles = [] }) => {
  await window.ADMIN_BASE_FRAME.store.dispatch('gneteBase/permission/generateRoutes', { roles, asyncRoutes: routes, otherRoutes })
  window.ADMIN_BASE_FRAME.router.options.routes = window.ADMIN_BASE_FRAME.store.getters.gneteBase.permission.routes
  window.ADMIN_BASE_FRAME.router.addRoutes(window.ADMIN_BASE_FRAME.store.getters.gneteBase.permission.addRoutes)
}

// 初始化 otherArg: vueArg, routerArg
function init({ el = '#app', router = {}, store = {}, App, otherArg = {}}) {
  // todo 参数校验
  return new Promise(resolve => {
    // 插件初始化
    Vue.use(ElementUI)
    Vue.use(Vuex)
    // 将自定义组件注入Vue
    install(Vue)

    // store
    const newStore = utils.mixin(store, baseStore)
    const storeInstance = new Vuex.Store(newStore)
    if (!Vue.$store) {
      Vue.prototype.$store = storeInstance
    }

    const { routerArg = {}, vueArg = {}} = otherArg
    routerInstance.beforeEach(routerArg.beforeEach)
    routerInstance.afterEach(routerArg.afterEach)

    window.ADMIN_BASE_FRAME = {
      version: '1.0.0',
      createRouterFn: createRouterFn,
      router: routerInstance,
      store: storeInstance
    }

    window.Vue = new Vue({
      el: el,
      router: routerInstance,
      store: storeInstance,
      ...vueArg,
      data() {
        return {
          eventHub: new Vue()
        }
      },
      render: h => h(App)
    })
    resolve('admin-base-frame init success.')
  })
}

export default {
  version: '1.0.0',
  Vue: Vue,
  init,
  install,
  createRouterFn,
  utils
}
