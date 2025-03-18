const fileType = [
  // {
  //   status: ["jpg"],
  //   img: require("@/assets/keyan/filetype/jpg.png"),
  // },
  // {
  //   status: ["png"],
  //   img: require("@/assets/keyan/filetype/png.png"),
  // },
  {
    status: ["pdf"],
    img: require("@/assets/file/pdf.svg"),
  },
  // {
  //   status: ["ppt"],
  //   img: require("@/assets/keyan/filetype/ppt.png"),
  // },
  // {
  //   status: ["excle", "xlsx"],
  //   img: require("@/assets/keyan/filetype/excle.png"),
  // },
  // {
  //   status: ["txt"],
  //   img: require("@/assets/keyan/filetype/txt.png"),
  // },
  {
    status: ["word", "doc", "docx"],
    img: require("@/assets/file/word.svg"),
  },
  // {
  //   status: ["rar"],
  //   img: require("@/assets/keyan/filetype/rar.png"),
  // },
  // {
  //   status: ["zip"],
  //   img: require("@/assets/keyan/filetype/zip.png"),
  // },
  // {
  //   status: [],
  //   img: require("@/assets/keyan/filetype/else.png"),
  // },
]

export function fileTypeImg(type) {
  const TYPE = type && type.toLowerCase()
  const arr = fileType
  let flag = true
  for (const item of arr) {
    flag = item.status.some(res => res == TYPE)
    if (flag) {
      return item.img
    }
  }

  if (!flag) {
    return arr[arr.length - 1].img
  }
}

export function getFileType(filePath) {
  return filePath && filePath.substr(filePath.lastIndexOf('.') + 1)
}

export function arrFind(arr, val, key) {
  return arr.find(item => item[key] == val)
}