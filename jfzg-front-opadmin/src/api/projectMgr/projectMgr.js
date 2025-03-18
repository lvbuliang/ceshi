import request from '@/utils/request'
const URL = '/jfzg/opcenter'

// 获取标签列表
export function api_getTreeList(params) {
  return request({
    url: `${URL}/api/label/treeList`,
    method: 'get',
    params
  })
}

// 列表点击展示子级
export function api_getChildList(params) {
  return request({
    url: `${URL}/api/label/childList`,
    method: 'get',
    params
  })
}

// 新增或修改标签
export function api_saveOrUpdate(data) {
  return request({
    url: `${URL}/api/label/save`,
    method: 'post',
    data
  })
}

// 删除标签
export function api_deleteById(data) {
  return request({
    url: `${URL}/api/label/delete/${data}`,
    method: 'post',
    data
  })
}

// 导出文件
export function api_exportFlie(params) {
  return request({
    url: `${URL}/api/label/export`,
    method: 'get',
    params
  })
}

// 下载导入模板
// export function api_downloadTemplate(params) {
//   return request({
//     url: `${URL}/api/label/download`,
//     method: 'get',
//     params
//   })
// }

// 导入标签
export function api_bootFile(data) {
  return request({
    url: `${URL}/api/label/import`,
    method: 'post',
    data
  })
}
