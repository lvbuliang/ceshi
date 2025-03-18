import SparkMD5 from "spark-md5";
import { upload, uploadMerge } from "@/api/upload/index";
export const md5Mixin = {
  inject: ["baseUrl", "imgBaseUrl", "uploadRequest"],
  data() {
    return {
      options: {
        target: this.baseUrl + "/jfzg/file/api/file/partFileUpload",
        testChunks: false, //不校验
        chunkSize: "20720000",
        headers: {
          Authorization: `${sessionStorage.getItem(
            "token_type"
          )} ${sessionStorage.getItem("token")}`,
        },
        query: {
          timestamp: new Date().getTime(),
        },
        processResponse: function (response, cb, file) {
          try {
            const res = JSON.parse(response);
            if (res.msg.code !== "0000") {
              cb("error", response);
            } else {
              cb(null, response);
            }
          } catch (err) {
            cb("error", response);
          }
        },
        // checkChunkUploadedByResponse: function(chunk, message) {
        // 	const response = JSON.parse(message)
        // 	console.log(response, chunk.offset)
        // 	response.uploaded = [1, 2]
        // 	return (response.uploaded || []).indexOf(chunk.offset + 1) >= 0
        // }
      },
      uploader: null,
    };
  },
  mounted() {
    // 获取uploader对象
    this.$nextTick(() => {
      this.uploader = this.$refs.uploader.uploader;
    });
  },
  methods: {
    computeMD5(file) {
      // const loading = this.$loading({
      // 	lock: true,
      // 	text: '正在计算MD5',
      // 	spinner: 'el-icon-loading',
      // 	background: 'rgba(0, 0, 0, 0.7)'
      // });
      let fileReader = new FileReader();
      let time = new Date().getTime();
      let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice;
      let currentChunk = 0;
      const chunkSize = 20 * 1024 * 1000;
      let chunks = Math.ceil(file.size / chunkSize);
      let spark = new SparkMD5.ArrayBuffer();
      file.pause();

      loadNext();
      fileReader.onload = (e) => {
        spark.append(e.target.result);
        if (currentChunk < chunks) {
          currentChunk++;
          loadNext();
          this.$nextTick(() => {
            console.log(
              "校验MD5 " + ((currentChunk / chunks) * 100).toFixed(0) + "%"
            );
          });
        } else {
          let md5 = spark.end();
          // loading.close();
          this.computeMD5Success(md5, file);
          console.log(
            `MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${
              file.size
            } 用时：${new Date().getTime() - time} ms`
          );
        }
      };
      fileReader.onerror = function () {
        this.error(`文件${file.name}读取出错，请检查该文件`);
        // loading.close();
        file.cancel();
      };

      function loadNext() {
        let start = currentChunk * chunkSize;
        let end =
          start + chunkSize >= file.size ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
      }
    },
    computeMD5Success(md5, file) {
      file.uniqueIdentifier = md5; //把md5值作为文件的识别码
      file.resume(); //开始上传
    },
    // 上传之前对文件进行校验
    beforeUpload(item, file) {
      let length = this.list.length + this.uploader.fileList.length;
      const limit = item.limit || 1;
      if (length > limit && limit != 1) {
        this.$message({
          message: `上传文件不能超过${limit}个！`,
          type: "warning",
        });
        return false;
      }
      //验证大小,格式
      //fileType是字符串
      item.fileType =
        item.fileType ||
        "doc,docx,xls,xlsx,pdf,ppt,pptx,txt,jpg,jpeg,jpe,png,rar,zip";
      item.fileSize = 5000000;
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      let type = item.fileType.split(",");
      let index = type.indexOf(testmsg);
      if (type.indexOf(testmsg) != -1 || item.fileType == "*") {
        const extension = testmsg === type[index];
        const isLt2M = file.size / 1024 / 1024 < item.fileSize;
        if (!extension && item.fileType != "*") {
          this.$message({
            message: `上传文件只能是${item.fileType}格式!`,
            type: "warning",
          });
        }
        if (!isLt2M) {
          this.$message({
            message: `上传文件大小不能超过 ${item.fileSize}MB!`,
            type: "warning",
          });
        }
        return (extension || item.fileType == "*") && isLt2M;
      } else {
        this.$message({
          message: `上传文件只能是${item.fileType}格式!`,
          type: "warning",
        });
        return false;
      }
    },
    //上传成功的事件
    async fileSuccess(rootFile, file, message, chunk) {
      const response = JSON.parse(message);
      response.data.size = file.file.size;

      uploadMerge(response.data).then(async (res) => {
        if (res.msg.code == "0000" && res.data) {
          let rs = await upload(res.data);

          // console.log("res,data",res.data);
          res.data.id = res.data.url;
          this.fileListChange();
          this.$emit("fileUpload", res.data);
        }
      });
    },
    // 选择文件事件
    onFileAdded(file) {
      //修改当前分片上传时间戳
      this.$set(this.options.query, "timestamp", new Date().getTime());
      if (this.beforeUpload(this.item, file)) {
        this.computeMD5(file);
      } else {
        file.ignored = true;
      }
      this.$emit("startUpload", file);
    },
    onFileProgress(rootFile, file, chunk) {
      console.log(rootFile._prevProgress, file._prevProgress, chunk);
      this.$emit("fileProgress", rootFile, file, chunk);
    },
    // 移除上传列表中的文件
    onFileRemove(file) {
      this.fileListChange();
    },
    // 上传失败
    onFileError(rootFile, file, message, chunk) {
      console.log(rootFile, file, message, chunk);
    },
    // 移除已存在的文件
    remove(item) {
      this.list = this.list.filter((res) => {
        return res.id != item.id;
      });
      this.fileListChange();
    },
    // 文件列表发生改变时
    fileListChange() {
      this.$emit("uploadSuccess", this.list);
    },
    mobanclick(item) {
      this.$utils.exportFile(
        `${this.baseUrl}/csportalsite/yuhua/projectapply/exportTemple`
      );
    },
    // 预览
    seeclick(item, e = {}) {
      let type = "";
      if (item.fileName) {
        type = item.fileName.split(".").pop();
      } else {
        type = item.name.split(".").pop();
      }
      if (["zip", "rar"].includes(type)) {
        this.$utils.exportFile(
          `${this.baseUrl}/csportalsite/api/file/download?id=${item.id}`
        );
      } else {
        if (e.asyncView) {
          this.$utils.getFileView.call(this, item.id);
        } else {
          window.open(`${this.imgBaseUrl}${item.id}`);
        }
      }
    },
    // 根据文件格式渲染图标
    fileImg(item) {
      return this.fileTypeImg(this.getFileType(item.name));
    },
    pause() {
      this.$emit("pause");
    },
    resume() {
      this.$emit("resume");
    },
    startUpload() {
      this.$emit("startUpload");
    },
    fileTypeImg(type) {
      const TYPE = type.toLowerCase();
      const arr = fileType;
      let flag = true;
      for (const item of arr) {
        flag = item.status.some((res) => res == TYPE);
        if (flag) {
          return item.img;
        }
      }

      if (!flag) {
        return arr[arr.length - 1].img;
      }
    },
    getFileType(filePath) {
      return filePath.substr(filePath.lastIndexOf(".") + 1);
    },
  },
};
