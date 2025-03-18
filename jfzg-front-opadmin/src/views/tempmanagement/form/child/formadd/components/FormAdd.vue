<template>
  <div>
    <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="组件渲染" name="first">
          <SrAdd
            :config="formAdd.config"
            :form="formAdd.data"
            :otherConfig="formAdd.otherConfig"
            :enums="formAdd.enums"
            ref="add"
          ></SrAdd>
        </el-tab-pane>
        <el-tab-pane label="参数配置" name="second">
          <div style="text-align:right;margin-bottom: 10px;">
            <el-button type="primary" size="small" class="json-btn" :data-clipboard-text="jsonCopyValue">复制代码</el-button>
          </div>
          <div id="jsoneditor" style="height: 400px;width: 100%;">{{jsonTemplate}}</div>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
  import config from "@/settings";
  import upload from "@/utils/upload";
  import Clipboard from 'clipboard'
  import {formatFormAddConfig} from '@/utils/tem.js'
  export default {
    components:{
    },
    provide() {
      return {
        baseUrl: config.baseUrl,
        imgBaseUrl: config.imgBaseUrl,
        uploadRequest: upload,
        uploadBaseUrl: config.uploadBaseUrl,
      }
    },
    props:['formData'],
    data() {
      return {
        formAdd:{
          config: [],
          data: {},
          enums: {},
          otherConfig: {
            labelNum: 100
          }
        },
        jsonCopyValue: '',
        activeName: 'first',
        jsonTemplate: '',
        jsonClipboard: null
      }
    },
    watch:{
      'formData': {
        handler(val) {
          this.transData(val)
          console.log('watch.formData', val)
        },
        deep: true
      },
      'activeName': {
        handler(val) {
          if (val == 'second') {
            this.handleGenerateJson()
          }
        }
      }
    },
    mounted() {
      console.log('mounted.formData', this.formData)
      this.transData(this.formData)
    },
    methods:{
      resetClipboard() {
        if (this.jsonClipboard) {
          this.jsonClipboard.off('success')
          this.jsonClipboard.destroy()
        }
      },
      transData(_data) {
        let {config, data, enums, otherConfig} = formatFormAddConfig(_data)
        this.$set(this.formAdd, 'config', config)
        this.$set(this.formAdd, 'data', data)
        this.$set(this.formAdd, 'enums', enums)
        this.$set(this.formAdd, 'otherConfig', otherConfig)
      },
      handleGenerateJson () {
        if (this.jsonCopyValue != '') return
        this.jsonTemplate = {
          formAdd: {
            ...this.formAdd
          }
        }
        this.$nextTick(() => {
          const editor = ace.edit('jsoneditor')
          editor.session.setMode("ace/mode/json")
          if (!this.jsonClipboard) {
            this.jsonClipboard = new Clipboard('.json-btn')
            this.jsonClipboard.off('success').on('success', (e) => {
              this.$message.success('复制成功')
            })
          }
          this.jsonCopyValue = JSON.stringify(this.jsonTemplate)
        })
      }
    }
  }
</script>

<style>
</style>
