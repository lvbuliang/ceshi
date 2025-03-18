<template>
  <div class="bianzhifile">
    <div class="title">实施方案上传</div>
    <div class="fujian_01">
      <div class="fileBianzhi">
        <div v-if="scheme" class="filePng" @mouseenter="enter()" @mouseleave="leave()"><img :src="filePng" alt="" /></div>
        <div v-else class="nofilePng"><img :src="nofilePng" alt="" /></div>
        <div class="pathPng" v-if="scheme">
          <i class="el-icon-paperclip"></i>
          <span @click="seeclick" class="notitle">{{ scheme }}</span>
        </div>
        <div class="pathPng" v-else>
          <img :src="pathPng" class='pathsvg' alt="" @mouseover="mouseOver" @mouseleave="mouseLeave"/>
          <span class="notitle">暂无实施方案</span>
          <span class="uptitle">立即上传</span>
          <div id="fileUp">
            <SrBigUpload
              hideMore="true"
              ref="srbigupload"
              @uploadSuccess="
                (data) => {
                  uploadSuccess(data, uploadItem);
                }
              "
              @startUpload="
                (data) => {
                  startUpload(data,file,uploadItem);
                }
              "
              @fileProgress="
                (rootFile,file,chunk) => {
                  fileProgress(rootFile,file,chunk,uploadItem);
                }
              "
            />
          </div>
        </div>
         <el-progress v-if="showProgress" :percentage="percentage"></el-progress>
      </div>
    </div>
    <div class="margintop16">
      <div class="contentBox" v-if="$route.name == 'bianzhiInitiateDetail'">
        <SrAdd
          :config="form.config"
          :otherConfig="otherConfig"
          :enums="form.enums"
          :form="form.data"
          :ref="`form`"
        ></SrAdd>
      </div>
      <div class="contentBox" v-else>
        <SrView :formData="form1.config" :ruleForm="form1.data"></SrView>
      </div>
    </div>
    
    <div
      class="fujian_02"
      v-if="scheme && $route.name == 'bianzhiInitiateDetail'"
      v-show='seen'
    >
      <!-- <div class="fujian_01">
        <div class="fileBianzhi">
          <div v-if="scheme" class="filePng"><img :src="filePng" alt="" /></div>
          <div class="pathPng" v-if="scheme">
            <i class="el-icon-paperclip"></i>
            <span class="notitle">{{ scheme }}</span>
          </div>
        </div>
      </div> -->
      <div class="fujian_03">
        <div class='mouse'  @mouseenter="enter()" @mouseleave="leave2()">
          <div class="fileBianzhi">
          <div class="return_class">
            <img :src="returnPng" alt="" />
            <span class="uptitle">重新上传</span>
              <div id="fileUp">
                <SrBigUpload
                  ref="srbigupload"
                  hideMore="true"
                  @uploadSuccess="
                    (data) => {
                      uploadSuccess(data, uploadItem);
                    }
                  "
                  @startUpload="
                (data) => {
                  startUpload(uploadItem);
                }
              "
              @fileProgress="
                (rootFile,file,chunk) => {
                  fileProgress(rootFile,file,chunk,uploadItem);
                }
              "
                />
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store";
import filePng from "@/assets/shishi/file.png";
import pathPng from "@/assets/shishi/path.svg";

import pathPng2 from "@/assets/shishi/path2.svg";
import pathPng3 from "@/assets/shishi/path.svg";
import nofilePng from "@/assets/shishi/nofile.png";
import returnPng from "@/assets/shishi/return.png";

import { getBianzhiFilelist } from "@/api/bianzhi/index";
import config from "@/settings.js";

export default {
  //组件注册
  // components: {
  //   SrTbale
  // },
  props: {},
  watch: {},
  data() {
    return {
      showProgress:false, //是否显示进度条
      percentage: 0, //进度百分比
      seen: false,
      scheme: "",
      uploadItem: {},
      fileList: [],
      filePng: filePng,
      pathPng: pathPng,
      pathPng2: pathPng2,
      pathPng3: pathPng3,
      nofilePng: nofilePng,
      returnPng: returnPng,
      otherConfig: {
        labelNum: 155,
      },
      form1: {
        config: [
          {
            value: "accessory",
            label: "其他附件",
            span: 24,
            type: "uploader",
            colNum: 3, // 一行几个附件
            maxFeild: 15, // 单个附件显示几个字
            showIcon: true,
            showExpand: true, // 是否需要展开收起功能
            labelWidth: 249,
          },
        ],
        data: {
          accessory: "",
        },
        enums: {},
      },
      form: {
        config: [
          {
            key: "1626078408000_82205",
            type: "upload",
            disabled:
              this.$route.name == "bianzhiInitiateDetail" ? false : true,
            bind: "accessory",
            name: "其他附件",
            col: 24,
            className: "",
            isHide: false,
            isHideView: false,
            fileList: [],
            fileTip: "支持doc、pdf、docx，文件不能超过200MB",
            limit: 10,
            fileType: "",
            // "required": "文档模板为必填项",
            trigger: "blur",
            rules: [],
          },
        ],
        data: {
          scheme: "",
          accessory: "",
        },
        otherConfig: {
          labelNum: 130,
        },
        enums: {},
      },
    };
  },

  methods: {
    mouseOver(){
      this.pathPng = pathPng2
    },
    mouseLeave(){
      this.pathPng = pathPng3
    },
     enter(index){
        this.seen = true;
      },
      leave(){
        this.seen = false;
      },
      leave2(){
        this.seen = false;
      },

    seeclick() {
      let token = sessionStorage.getItem("token");
      if (
        [
          'txt','ppt','pptx','doc','docx','xls','xlsx','html','pdf'
        ].includes(this.form.data.scheme[0].name.split(".").pop())
      ) {
        window.open(
          `${config.uploadBaseUrl}/viewPdf?id=${this.form.data.scheme[0].id}`
        );
      } else {
        window.open(
          `${config.uploadBaseUrl}/jfzg/file/api/file/download?key=${this.form.data.scheme[0].id}&access_token=${token}`
        );
      }
    },
    // 开始上传回调
    startUpload(data,file) {
      console.log("...",data,file);
      this.showProgress=true
    },
    // 上传成功回调
    uploadSuccess(res) {
      this.$set(this.form.data, "scheme", res);
      this.scheme = res[0].name;
      this.showProgress=false
    },
    //进度条百分比
    fileProgress(rootFile,file,chunk){
      console.log(rootFile,file,chunk)
      this.percentage=Number(file._prevProgress*100).toFixed(0)
    },
    getBianzhiFilelist() {
      getBianzhiFilelist({ projectId: this.$route.query.id }).then((res) => {
        if (res && res.success) {
          this.scheme = res.data?res.data.scheme
            ? JSON.parse(res.data.scheme)[0].name
            : "": "";
          if (res.data &&res.data.scheme) {
            this.$set(this.form.data, "scheme", JSON.parse(res.data.scheme));
          }
          if (res.data &&res.data.accessory) {
            this.$set(
              this.form.data,
              "accessory",
              JSON.parse(res.data.accessory)
            );
            this.$set(
              this.form1.data,
              "accessory",
              JSON.parse(res.data.accessory)
            );
          }
        }
      });
    },
  },
  created() {
    this.getBianzhiFilelist();
  },
};
</script>
<style lang="scss" scoped>
.pathsvg{
  cursor: pointer;
  color:#666666;
}
.title {
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: #333333;
  line-height: 22px;
  margin-bottom: 16px;
}
::v-deep .uploaderDisabled {
  display: none;
}
.margintop16 {
  margin-top: 16px;
}
.bianzhifile {
  .fujian_02 {
    position: relative;
    width: 100%;
    height: 162px;
    border-radius: 8px;
    .fujian_03 {
      top: -227px;
      position: absolute;
      width: 100%;
      height: 162px;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      ::v-deep .return_class {
        img {
          vertical-align: sub;
          margin-right: 5px;
        }
        left: 0px;
        top: -15px;
        position: relative;
        #fileUp {
          position: absolute;
          top: -4px;
          right: 12px;
          opacity: 0;
          .more_file {
            display: none;
          }
        }
      }
      .mouse{
        height: 100%;
        display: flex;
        align-items: center;
      }
    }
  }
  
  .fujian_01 {
    width: 100%;
    height: 162px;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: center;
    .fileBianzhi {
      // height: 90px;
    }
    .filePng {
      display: flex;
      justify-content: center;
      cursor: pointer;
      
    }
    .nofilePng {
      display: flex;
      justify-content: center;
    }
    .pathPng {
      position: relative;
      margin-top: 8px;
      ::v-deep #fileUp {
        position: absolute;
        top: -4px;
        right: 12px;
        opacity: 0;
        .more_file {
            display: none;
          }
      }
      img {
        width: 16px;
        height: 16px;
        vertical-align: sub;
      }
    }
    .notitle {
      cursor: pointer;
      margin-left: 11px;
      margin-right: 8px;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 22px;
    }
    .uptitle {
      cursor: pointer;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1890ff;
      line-height: 20px;
    }
  }
}
</style>
