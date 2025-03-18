// 附件文件大小转换
function getSize(size) {
    if (typeof size == "string") {
      return size;
    } else {
      let size1 = (size / 1024 / 1024).toFixed(2) + "mb";
      return size1;
    }
  }
// 附件数组转换JSON
function getJSONStr(list, deliveryName) {
  let strList = [];
  if(list.length > 0) {
    list.forEach((i) => {
      strList.push({
        name: i.name,
        id: i.id,
        size: getSize(i.size),
        createTime: i.createTime,
        deliveryName: deliveryName,
      });
    });
  }else {
    strList = []
  }
  return JSON.stringify(strList);
}
// 附件JSON转数组
function setFile(file) {
  let files = [];
  if (JSON.parse(file).length > 0) {
    JSON.parse(file).forEach((e) => {
      files.push(e);
    });
  } else {
    files = [];
  }
  return files;
}
export { getJSONStr, setFile };
