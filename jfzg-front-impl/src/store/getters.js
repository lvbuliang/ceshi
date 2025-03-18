const getters = {
  msg: state => state.appstore.msg,
  userInfo: state => state.userinfo.userInfo,
  one: state => state.extract.one,
  two: state => state.extract.two,
  tree: state => state.extract.tree
};

export default getters;
