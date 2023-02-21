const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // user模块下
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  routes: state => state.user.routes,
  roles: state => state.user.roles,
  buttons: state => state.user.buttons
}
export default getters
