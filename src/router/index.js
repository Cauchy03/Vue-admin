import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 子菜单只在路由子项时出现。长度>= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为true，项目将不会显示在侧栏中(默认为false)
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果没有设置alwaysShow，当项目有多个子路由时,
 *                                它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置noRedirect将不会在面包屑中重定向
 * name:'router-name'             该名称用于<keep-alive>(必须设置!!)
 * meta : {
    roles: ['admin','editor']     控制页面角色(可以设置多个角色)
    title: 'title'                在侧边栏和面包屑中显示的名称(推荐集)
    icon: 'svg-name'/'el-icon-x'  图标显示在侧栏中
    breadcrumb: false             如果设置为false，项目将隐藏在breadcrumb中(默认为true)
    activeMenu: '/example/list'   如果设置了路径，侧边栏将突出显示所设置的路径
  }
 */

// 常量路由constantRoutes，没有权限要求的基本页，所有角色均可访问
export const constantRoutes = [
  // 登录路由
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // 404路由
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 首页路由
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',//重定向
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      // title设置侧边栏的文字
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

// 异步路由asyncRoutes，不同角色(用户)需要过滤筛选除的路由
export const asyncRoutes = [
  // 商品管理路由
  {
    path: '/product',
    name: 'Product',
    component: Layout,
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    children: [{
      path: 'trademark',
      name: 'Trademark',
      component: () => import('@/views/product/tradeMark'),
      meta: { title: '品牌管理' }
    },
    {
      path: 'attr',
      name: 'Attr',
      component: () => import('@/views/product/Attr'),
      meta: { title: '平台属性管理' }
    }, {
      path: 'spu',
      name: 'Spu',
      component: () => import('@/views/product/Spu'),
      meta: { title: 'Spu管理' }
    },
    {
      path: 'sku',
      name: 'Sku',
      component: () => import('@/views/product/Sku'),
      meta: { title: 'Sku管理' }
    }]
  },
  // 权限管理路由
  {
    name: 'Acl',
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: {
      title: '权限管理',
      icon: 'el-icon-lock'
    },
    children: [
      {
        name: 'User',
        path: 'user/list',
        component: () => import('@/views/acl/user/list'),
        meta: {
          title: '用户管理',
        },
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import('@/views/acl/role/list'),
        meta: {
          title: '角色管理',
        },
      },
      {
        name: 'RoleAuth',
        path: 'role/auth/:id',
        component: () => import('@/views/acl/role/roleAuth'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权',
        },
        hidden: true,
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import('@/views/acl/permission/list'),
        meta: {
          title: '菜单管理',
        },
      },
    ]
  },
  // 测试管理路由
  {
    path: '/test',
    component: Layout,
    name: 'Test',
    meta: { title: '测试管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'test1',
        name: 'Test1',
        component: () => import('@/views/Test/Test1'),
        meta: { title: '测试管理1' }
      },
      {
        path: 'test2',
        name: 'Test2',
        component: () => import('@/views/Test/Test2'),
        meta: { title: '测试管理2' }
      },
    ]
  }
]

// 任意路由anyRoutes，当路径出现错误的时候重定向404
// 重定向 输入无效网址时跳转404
export const anyRoutes = [{ path: '*', redirect: '/404', hidden: true }]


const createRouter = () => new Router({
  // mode: 'history', // 模式，可以设置history 和hash模式
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 详细信息：https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重新设置路由
}

export default router
