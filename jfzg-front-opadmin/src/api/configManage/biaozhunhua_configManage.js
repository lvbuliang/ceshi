import request from '@/utils/request'
const URL = 'jfzg/opcenter'

//消息设置查看
export function view_xiaoxi_biaozhunhua() {
  return request({
    url: `${URL}/schduleSystem/systemInfo`,
    method: 'get',
  })
}

//消息设置查看
export function set_xiaoxi_biaozhunhua(data) {
  return request({
    url: `${URL}/schduleSystem/saveAndUpdate`,
    method: 'post',
    data
  })
}

//邮件查看
export function view_youjian_biaozhunhua() {
  return request({
    url: `${URL}/email/getEmailConfig`,
    method: 'get',
  })
}

//邮件查看
export function set_youjian_biaozhunhua(data) {
  return request({
    url: `${URL}/email/saveOrUpdate`,
    method: 'post',
    data
  })
}
