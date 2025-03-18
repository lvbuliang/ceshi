import { upload, uploadMerge } from "@/api/upload/index"

async function uploadFile(filed) {
    let rs = await upload(filed);
    return rs
}

async function BiguploadFile(file, callback) {
    let data;
    uploadMerge(file).then(async (res) => {
        if (res.msg.code == "0000" && res.data) {
            let rs = await upload(res.data);
            console.log(rs);
            callback(rs)
        }
    }).catch(err => {
        console.log(err, 'err');
    });

}


export default {
    uploadFile,
    BiguploadFile
}