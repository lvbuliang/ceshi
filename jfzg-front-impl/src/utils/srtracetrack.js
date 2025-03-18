import { getList, srtraceTrackImage, api_workFlowGetList } from "@/api/srtracetrack/index.js"

async function getTraceTrackList(params, callback) {
    let rs = await getList(params);
    callback(rs)
}
async function getTraceTrackImage(params, callback) {
    console.log(params);
    let rs = await srtraceTrackImage(params);
    callback(rs)
}
async function hoverTraceTrackList(params, callback) {
    console.log(params);
    let rs = await api_workFlowGetList(params);
    callback(rs)
}


export default {
    getTraceTrackList,
    getTraceTrackImage,
    hoverTraceTrackList
}