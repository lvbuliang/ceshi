import { api_afferentUrlOfPost, api_queryUsersByBuUniqueCode,api_workFlowGetList } from "@/api/index"

async function setApiAfferentUrlOfPost(url, params, callback) {
    let { data, msg } = await api_afferentUrlOfPost(url, params);
    if (msg.code == '0000') {
        callback(data || true)
    }
}
//获取分配人下拉数据
async function queryUsersByBuUniqueCode(data, callback) {
    let rs = await api_queryUsersByBuUniqueCode(data);
    callback(rs)
}
//留痕接口
async function hoverTraceTrackList(params, callback) {
    console.log(params);
    let rs = await api_workFlowGetList(params);
    callback(rs)
}
export default {
    setApiAfferentUrlOfPost,
    queryUsersByBuUniqueCode,
    hoverTraceTrackList
}