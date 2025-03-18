import { getList, srtraceTrackImage, api_workFlowGetList } from "./index.js"

async function getTraceTrackList(params, callback) {
    let rs = await getList(params);
    callback(rs)
}
async function getTraceTrackImage(params, callback) {
    let rs = await srtraceTrackImage(params);
    callback(rs)
}
async function hoverTraceTrackList(params, callback) {
    let rs = await api_workFlowGetList(params);
    callback(rs)
}


export default {
    getTraceTrackList,
    getTraceTrackImage,
    hoverTraceTrackList
}