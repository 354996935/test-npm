import { constantRoutes, resetRouter, ROUTER_404 } from '../../router'
import Vue from 'vue'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [], // 当前系统所有路由
  routesMap: {
    lv_1: [], // 一级视图路由
    lv_2: [] // 二级视图路由
  },
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, { accessedRoutes = [], otherRoutes = {}}) => {
    let routes = [...accessedRoutes]
    Object.keys(otherRoutes).forEach(key => {
      const lv = key.split('_')[1]
      if (!state.routesMap[`lv_${lv}`]) {
        Vue.set(state.routesMap, `lv_${lv}`, [])
      }
      state.routesMap[`lv_${lv}`] = otherRoutes[key]
      routes = [...routes, ...otherRoutes[key]]
    })
    routes = [...routes, ...ROUTER_404]
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    state.routesMap.lv_1 = accessedRoutes
  }
}

const actions = {
  generateRoutes({ commit, state }, { roles, asyncRoutes, otherRoutes = {}}) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', { accessedRoutes, otherRoutes })
      resolve(state.addRoutes)
    })
  },
  resetRoutes({ commit }) {
    resetRouter()
    commit('SET_ROUTES', {})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
