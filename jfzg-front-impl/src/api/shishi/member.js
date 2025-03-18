import request from "@/utils/request";


// 变更
export function BG_Ajax(data) {
  var url1 = data.roleCode.split('_')[0].toLowerCase();
  var url2 = data.roleCode.split('_')[1].toLowerCase();
  var url  = '/csportalsite/changeImplementationManager/change/'+url1+'/'+url2
  return request({
    url: url,
    method: "post",
    data,
  });
}
// 审核
export function SH_Ajax(data) {
  var url1 = data.roleCode.split('_')[0].toLowerCase();
  var url2 = data.roleCode.split('_')[1].toLowerCase();
  var url3 = (data.isCheck ==1)?'pass':'reject'
  var url  = '/csportalsite/changeImplementationManager/change/'+url1+'/'+url2+'/'+url3
  return request({
    url: url,
    method: "post",
    data,
  });
}

// 待审核列表
export function get_bg(data){
  return request({
    url:`/csportalsite/changeImplementationManager/change/list/${data}`,
    method:'get',
  })
}
