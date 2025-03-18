
import request from "@/utils/request"
const URL = '/jfzg'
// 上传 /jfzg/file/api/file/uploadBig
export function upload(data) {
    return request({
        url: `${URL}/file/api/file/uploadBig`,
        method: 'post',
        timeout: 300000,
        data
    })
}
// 合并上传
export function uploadMerge(data) {
    return request({
        url: `${URL}/file/api/file/mergePartFile`,
        method: 'post', 
        timeout: 300000,
        data
    })
}