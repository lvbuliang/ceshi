const getters = {
  menu: state => state.menu.menu,
  bread: state => state.menu.bread,
  is_collapse: state => state.menu.is_collapse,
  size: state => state.app.size,
  token: state => state.app.token,
  userInfo: state => state.app.userInfo,
  permission_views: state => state.app.permission_views,
  msg: state => state.appstore.msg,
  knowledgeBaseKeyword: state => state.app.knowledgeBaseKeyword
}

export default getters