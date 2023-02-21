import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { asyncRoutes, resetRouter, constantRoutes, anyRoutes } from '@/router'
import router from "@/router"

const getDefaultState = () => {
  return {
    // 获取token
    token: getToken(),
    // 存储用户名
    name: '',
    // 存储用户头像
    avatar: '',
    // 存储用户信息
    routes: [],
    roles: [],
    buttons: [],
    // 比较之后[项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的路由]
    resultAsyncRoutes: [],
    // 合并过后的路由
    resultRoutes: []
  }
}

const state = getDefaultState()

const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 设置token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // // 存储用户名
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // // 存储用户头像
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.routes = userInfo.routes
    state.roles = userInfo.roles
    state.buttons = userInfo.buttons
  },
  // 最终计算出来的异步路由
  SET_ASYNCROUTES: (state, asyncRoutes) => {
    state.resultAsyncRoutes = asyncRoutes
    // 只包含异步路由，还需合并常量路由和任意路由
    state.resultRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    // router添加路由
    router.addRoutes(state.resultRoutes)
  }
}

// 计算异步路由属性
function computeRoutes(asyncRoutes, routes) {
  return asyncRoutes.filter(item => {
    // 判断一级路由
    if (routes.indexOf(item.name) !== -1) {
      // 递归 遍历子路由
      if (item.children && item.children.length) {
        item.children = computeRoutes(item.children, routes)
      }
      return true
    }
  })
}

const actions = {
  // 用户登录
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    if (result.code === 20000) {
      // vux存储token
      commit('SET_TOKEN', result.data.token)
      // 本地持久化存储token
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('error!'))
    }
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // }) 
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(result => {
        // 返回的数据包含：用户名name，用户头像avatar，routes(不同用户应该展示哪些菜单标记)，button(按钮权限的标记)
        const { data } = result

        // 提交mutation，存储用户信息
        commit('SET_USERINFO', data)
        commit('SET_ASYNCROUTES', computeRoutes(asyncRoutes, data.routes))

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户退出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 删除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

