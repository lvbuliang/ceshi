import {
    api_getSystemTime
} from "@/api/client";

async function getSystemTime() {
    const res = await api_getSystemTime();
    if (res && res.data) {
        return res.data;
    }
    return null;
}

function getTimeDifference(endTime) {
    const end = new Date(endTime).getTime();
    const start = new Date().getTime();
    let day = 0;
    let hours = 0;
    let minute = 0;
    if (end > start) {
        const difference = end - start;
        day = Math.floor(difference / (24 * 3600 * 1000));
        const leave1 = difference % (24 * 3600 * 1000);
        hours = Math.floor(leave1 / (3600 * 1000));
        const leave2 = leave1 % (3600 * 1000);
        minute = Math.floor(leave2 / (60 * 1000));
    }
    return {
        day,
        hours,
        minute
    };
}

function exportFile(url) {
    const a = document.createElement('a')
    a.url = url
    a.click()
}
export default {
    exportFile,
    getSystemTime,
    getTimeDifference
}