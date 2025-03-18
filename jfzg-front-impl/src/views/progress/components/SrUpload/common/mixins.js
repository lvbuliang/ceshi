import SparkMD5 from "spark-md5";
import config from "@/settings.js";
import { uploadMerge, upload } from "@/api/progress";
import { getFileType } from "@/utils/plan";
export const uploaderMixin = {
	inject: ["uploader"],
};

export const supportMixin = {
	data() {
		return {
			support: true,
		};
	},
	mounted() {
		this.support = this.uploader.uploader.support;
	},
};

export const md5Mixin = {
	data() {
		return {
			options: {
				target:
					config.baseUrl + "/zuul/csopenapi/docapi/partFileUpload",
				testChunks: false, //不校验
				chunkSize: "20720000",
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
					} catch {
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
			const loading = this.$loading({
				lock: true,
				text: '文件加载中',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});
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
							"校验MD5 " +
							((currentChunk / chunks) * 100).toFixed(0) +
							"%"
						);
					});
				} else {
					let md5 = spark.end();
					loading.close();
					this.computeMD5Success(md5, file);
					console.log(
						`MD5计算完毕：${file.name
						} \nMD5：${md5} \n分片：${chunks} 大小:${file.size
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
					start + chunkSize >= file.size
						? file.size
						: start + chunkSize;
				fileReader.readAsArrayBuffer(
					blobSlice.call(file.file, start, end)
				);
			}
		},
		computeMD5Success(md5, file) {
			file.uniqueIdentifier = md5; //把md5值作为文件的识别码
			file.resume(); //开始上传
		},
		// 上传之前对文件进行校验
		beforeUpload(item, file) {
			let length = this.list.length + this.uploader.fileList.length;
			item.limit = item.limit || 1;
			if (length > item.limit) {
				var that = this
				setTimeout(function () {
					that.$message({
						message: "上传文件不能超过" + (item.limit || 1) + "个！",
						type: "warning",
					});
					return false;
				}, 0);
			} else {
				//验证大小,格式
				//fileType是字符串
				item.fileType = item.fileType || "doc,docx,xls,xlsx,pdf,ppt,pptx,txt,jpg,jpeg,jpe,png,rar,zip";
				item.fileSize = item.fileSize || 500;
				var testmsg = file.name
					.substring(file.name.lastIndexOf(".") + 1)
					.toLowerCase();
				let type = item.fileType.split(",");
				let index = type.indexOf(testmsg);
				if (type.indexOf(testmsg) != -1 || item.fileType == "*") {
					const extension = testmsg === type[index];
					const isLt2M = file.size / 1024 / 1024 < item.fileSize;
					if (!extension && item.fileType != "*") {
						var that = this
						setTimeout(function () {
							that.$message({
								message: `上传文件只能是${item.fileType}格式!`,
								type: "warning",
							});
						}, 0);
					} else {
						if (!isLt2M) {
							var that = this
							setTimeout(function () {
								that.$message({
									message: `上传文件大小不能超过 ${item.fileSize}MB!`,
									type: "warning",
								});
							}, 0);
						} else {
							return (extension || item.fileType == "*") && isLt2M;
						}
					}
				} else {
					var that = this
					setTimeout(function () {
						that.$message({
							message: `上传文件只能是${item.fileType}格式!`,
							type: "warning",
						});
						return false;
					}, 0);
				}
			}

		},
		//上传成功的事件
		fileSuccess(rootFile, file, message, chunk) {
			const response = JSON.parse(message);
			response.data.size = file.file.size;
			// 根据md5进行文件合并
			uploadMerge(response.data).then((res) => {
				if (res.msg.code == "0000" && res.data) {
					upload(res.data).then(r => {
						let flag = false;
						if (this.list) {
							// 过滤重名的文件
							this.list = this.list.filter((val) => {
								if (val.name == r.data.fileInfo.name || val.fileName == r.data.fileInfo.name) {
									flag = true;
								}
								return val.name != r.data.fileInfo.name && val.fileName != r.data.fileInfo.name;
							});
							this.list.push(r.data.fileInfo);
						} else {
							this.list.push(r.data.fileInfo);
						}
						if (!flag) {
							this.$emit('uploadImgSuccess', r.data.fileInfo)
						}
						flag
							? this.$message.warning("文件名重复,已自动覆盖同名文件!")
							: this.$message.success("上传成功!");
						this.fileListChange();
						this.uploader.removeFile(file);
					})

				} else {
					this.uploader.removeFile(file);
					this.$message({
						message: "文件合并失败！",
						type: "error",
					});
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
			this.$emit("startUpload");
		},
		onFileProgress(rootFile, file, chunk) {
			// console.log(file);
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
		// 移除已存在的文件
		remove_jungong(item) {
			this.list = this.list.filter((res) => {
				return res.id != item.fileId;
			});
			this.fileListChange();
		},

		// 文件列表发生改变时
		fileListChange() {
			this.$emit("uploadSuccess", this.list);
		},
		mobanclick(item) {
			this.$utils.exportFile(
				`${config.baseUrl}/csportalsite/yuhua/projectapply/exportTemple`
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
				let fileUrl = config.getEncryUrl(item.id, true);
				this.$utils.exportFile(fileUrl);
			} else {
				if (e.asyncView) {
					this.$utils.getFileView.call(this, item.id);
				} else {
					let fileUrl = config.getEncryUrl(item.id);
					window.open(`${fileUrl}`);
				}
			}
		},
		// 下载
		download(item) {
			let fileUrl = config.getEncryUrl(item.id, true);
			this.$utils.exportFile(fileUrl);
		},
		// 根据文件格式渲染图标
		fileImg(item) {
			const fileType = [{
				status: ['jpg'],
				img: require('@/views/progress/assets/components/filetype/jpg.png')
			},
			{
				status: ['png'],
				img: require('@/views/progress/assets/components/filetype/png.png')
			},
			{
				status: ['pdf'],
				img: require('@/views/progress/assets/components/filetype/pdf.png')
			},
			{
				status: ['ppt'],
				img: require('@/views/progress/assets/components/filetype/ppt.png')
			},
			{
				status: ['excle', 'xlsx'],
				img: require('@/views/progress/assets/components/filetype/excle.png')
			},
			{
				status: ['txt'],
				img: require('@/views/progress/assets/components/filetype/txt.png')
			},
			{
				status: ['word', 'doc', 'docx'],
				img: require('@/views/progress/assets/components/filetype/word.png')
			},
			{
				status: ['rar'],
				img: require('@/views/progress/assets/components/filetype/rar.png')
			},
			{
				status: ['zip'],
				img: require('@/views/progress/assets/components/filetype/zip.png')
			},
			{
				status: [],
				img: require('@/views/progress/assets/components/filetype/else.png')
			},
			]

			return this.fileTypeImg(this.getFileType(item.name), fileType);

		},
		fileTypeImg(type, fileType) {
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
		},
		getFileType(filePath) {
			return filePath && filePath.substr(filePath.lastIndexOf('.') + 1)
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
		tpluploadclick(url) {
			this.$utils.exportFile(`${config.baseUrl}${url}`);
		}
	},
};
