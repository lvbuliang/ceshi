const getters = {
  msg: state => state.appstore.msg,
  userInfo: state => state.userinfo.userInfo,
  auditQuery:state=>state.sotreQueryParams.auditQuery,
  showDialog:state=>state.sotreQueryParams.showDialog,
  
};

export default getters;
