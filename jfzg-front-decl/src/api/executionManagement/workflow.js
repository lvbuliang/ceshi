import { api_afferentUrlOfPost } from "./index.js"

async function setApiAfferentUrlOfPost(url, params, callback) {
    let { data, msg } = await api_afferentUrlOfPost(url, params);
    if (msg.code == '0000') {
        callback(data || true)
    }

}

export default {
    setApiAfferentUrlOfPost
}