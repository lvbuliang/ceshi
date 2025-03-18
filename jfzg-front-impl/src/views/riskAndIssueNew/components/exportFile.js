export default function(res,filename) {
     // 创建a标签，并处理二进制数据
     const link = document.createElement("a");
     const blob = new Blob([res.data], {
       type: "application/vnd.ms-excel",
     });
     const pat = new RegExp("filename=([^;]+\\.[^\\.;]+)"); // 设置下载文件名称
     let contentDisposition;
     if (res.headers["content-disposition"])
       contentDisposition = res.headers["content-disposition"];
     if (res.headers["Content-Disposition"])
       contentDisposition = res.headers["Content-Disposition"];
     const result = pat.exec(contentDisposition);
     let fileName = result && result[1]; // 生成下载链接
     const URL = window.URL || window.webkitURL;
     console.log(blob, URL);
     link.href = URL.createObjectURL(blob); // 如果Content-Disposition没有提供文件名，则使用默认名称
     fileName = filename;
     link.setAttribute("download", decodeURIComponent(fileName)); // 使用URI解码而不是解码
     document.body.appendChild(link);
     link.click(); // 释放URL对象
     window.URL.revokeObjectURL(link.href);
     document.body.removeChild(link);
}