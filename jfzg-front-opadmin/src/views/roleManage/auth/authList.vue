<template>
  <div class="authList">
    <div class="navTitle"></div>
    <!-- <el-button class="outBtn" type="primary" @click="exportFlie"
      >标签导出</el-button
    > -->
    <!-- <el-button class="inBtn" type="primary" @click="bootFile"
      >批量导入</el-button
    > -->
    <div class="container">
      <el-container>
        <el-aside class="el-aside" width="362px">
          <div class="title">权限管理</div>
          <div class="search">
            <!-- <div class="demo-input-suffix first" @click="setInput($event)"> -->
            <div class="demo-input-suffix first">
              <span class="lable">权限名称：</span>
              <el-input
                class="input"
                placeholder="请输入权限名称"
                v-model="permissionName"
                suffix-icon="el-icon-search"
              ></el-input>
            </div>
          </div>
          <el-scrollbar style="height: 460px">
            <div>
              <el-tree
                v-if="flag"
                node-key="permissionId"
                @node-click="handleNodeClick"
                :data="dataList"
                :props="treeProps"
                :setCurrentKey="setCurrentKey"
                :default-expanded-keys="showId"
                :default-expand-all="false"
                :expand-on-click-node="false"
                :filter-node-method="filterNode1"
                ref="tree"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>
                    <!-- <img
                      v-if="data.icon"
                      class="img"
                      :src="imgBaseUrl + data.icon"
                      alt
                    />-->
                    {{ data.permissionName }}
                  </span>
                  <span>
                    <el-dropdown size="small" :hide-on-click="false">
                      <span class="el-dropdown-link">
                        <i
                          style="transform: rotate(270deg)"
                          slot="reference"
                          class="el-icon-more tree_icon"
                        ></i>
                      </span>

                      <div class="buttonOperation">
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            v-if="data.menuLevel < 4"
                            @click.native="addSubordinate(node, data, 1)"
                            >添加下级</el-dropdown-item
                          >
                          <el-dropdown-item
                            v-if="data.permissionId != '0'"
                            @click.native="remove(node, data)"
                            >删除</el-dropdown-item
                          >
                          <el-dropdown-item
                            v-if="
                              data.permissionName != '后台管理' &&
                                data.permissionName != '沙盘' &&
                                data.permissionType == '0' &&
                                data.permissionHidden != '-2'
                            "
                            @click.native="moveMenu(node, data)"
                            >移动</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </div>
                    </el-dropdown>
                  </span>
                  <template></template>
                </span>
              </el-tree>
            </div>
          </el-scrollbar>
        </el-aside>
        <el-main class="el-main" v-if="unitName">
          <div class="title">{{ unitName }}</div>
          <div class="form">
            <FForm
              ref="modelMgrRef"
              :config="form.config"
              :form="form.data"
              :rules="form.rules"
              :enums="form.enums"
              :other-config="otherConfig"
              refForm="modelMgrRefForm"
              @eventNotify="eventNotify"
              :column="2"
            ></FForm>
            <span class="dialog-footer">
              <el-button type="primary" @click="submit">保 存</el-button>
            </span>
          </div>
        </el-main>
      </el-container>
      <el-dialog
        title="批量导入"
        :visible.sync="dialogFlag"
        width="672px"
        center
      >
        <el-steps
          class="steps"
          :active="active"
          align-center
          finish-status="success"
        >
          <el-step title="下载模板/上传文件">
            <template slot="description">
              <span class="itemDes">
                可
                <span class="downloadTemplate" @click="downloadTemplate"
                  >下载自定义模板</span
                >，完善后上传
              </span>
            </template>
          </el-step>
          <el-step title="导入文件">
            <template slot="description">
              <span class="itemDes">一次性增量导入数据，错误数据报错提示</span>
            </template>
          </el-step>
          <el-step title="导入完成">
            <template slot="description">
              <span class="itemDes">导入完成，数据更新成功</span>
            </template>
          </el-step>
        </el-steps>
        <div class="fileContent">
          <div class="step_empty" v-if="active == 0">
            <img :src="emptyImg" class="empty_img" />
            <span class="empty_null">暂无内容，请选择文件</span>
            <el-upload
              ref="upload"
              name="file"
              action
              :auto-upload="false"
              :on-exceed="handleExceed"
              :file-list="filelist"
              :on-change="handleChansge"
              :before-remove="beforeRemove"
              :on-remove="removeFile"
            >
              <el-button
                slot="trigger"
                size="small"
                class="emptyBtn"
                type="primary"
                >选取文件</el-button
              >
              <!-- <div slot="tip" class="el-upload__tip">
            上传文件只能为excel文件，且为xlsx,xls格式
              </div>-->
            </el-upload>
          </div>

          <div class="stepTwo" v-if="active == 1 && stepStatus == '0'">
            <el-upload
              ref="upload"
              name="file"
              action
              :auto-upload="false"
              :on-exceed="handleExceed"
              :file-list="filelist"
              :on-change="handleChansge"
              :before-remove="beforeRemove"
              :on-remove="removeFile"
            >
              <el-button
                class="baginPost"
                size="small"
                type="primary"
                @click="postFile"
                >开始导入</el-button
              >
              <el-button slot="trigger" size="small">重新选择</el-button>
              <div class="chooseFile">已选择文件</div>
            </el-upload>
          </div>

          <div class="stepThree" v-if="active >= 1 && stepStatus !== '0'">
            <div class="threeContent" v-if="stepStatus == '1'">
              <img :src="waitImg" class="waitImg" />
              <span class="stepThree_title">表格导入中，请耐心等待…</span>
            </div>
            <div class="threeContent" v-if="stepStatus == '2'">
              <img :src="checkImg" class="checkImg" />
              <span class="stepThree_title">
                表格导入成功，更新
                <span style="color: #4CB93C;"> {{ checkNum }} </span>条数据
              </span>
            </div>
            <div class="threeContent" v-if="stepStatus == '3'">
              <img :src="warningImg" class="warningImg" />
              <span class="stepThree_title"
                >表格导入完成，未获取到有效数据</span
              >
            </div>
            <div
              :class="warningList.length ? 'circleContent' : 'threeContent'"
              v-if="stepStatus == '4'"
            >
              <img :src="circleImg" class="circleImg" />
              <span class="stepThree_title">
                表格导入失败，检测到
                <span style="color: #D62F4C;"> {{ warningList.length }} </span
                >条错误
              </span>
              <ul class="warningList" v-if="warningList.length">
                <li v-for="(item, index) in warningList" :key="index">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer dialogFooter">
          <el-button size="small" type="primary" @click="reseveInfo"
            >确 定</el-button
          >
          <el-button size="small" @click="reseveInfo">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog
      class="authListDailog common-dialog"
      title="移动权限菜单"
      :visible.sync="authListDailogVisible"
      width="700px"
    >
      <div class="authListDailog-main">
        <div class="title">权限管理</div>
        <!-- <div class="search">
          <div class="demo-input-suffix first">
            <span class="lable">权限名称：</span>
            <el-input
              class="input"
              placeholder="请输入权限名称"
              v-model="permissionName"
              suffix-icon="el-icon-search"
            ></el-input>
          </div>
        </div> -->
        <el-scrollbar style="height: 400px">
          <div>
            <el-tree
              v-if="flag"
              class="treeBox"
              node-key="permissionId"
              :data="dataList"
              :props="treeProps"
              :setCurrentKey="setCurrentKey"
              :default-expanded-keys="showId"
              :default-expand-all="false"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="dialogTree"
            >
              <span class="custom-tree-node" slot-scope="{ data }">
                <span>
                  {{ data.permissionName }}
                </span>
                <span>
                  <div class="buttonOperation">
                    <a
                      type="primary"
                      @click="setSameLevel(data)"
                      v-if="data.menuLevel != 0"
                      >移动到同级</a
                    >
                    <a type="primary" @click="setSubordinate(data)"
                      >移动到下一级</a
                    >
                  </div>
                </span>
                <template></template>
              </span>
            </el-tree>
          </div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let id = 1000;
import FForm from "@/components/FForm/form-add";
import {
  api_getPermissionyInfo,
  api_listByTopicAndItem,
  api_delPermissiony,
  api_getPermissionyInfoList,
  api_permissionSaveOrUpdate,
  api_bootFile,
  api_moveMenus,
} from "@/api/roleManage/roleManage";
import config from "@/settings.js";
import { getStorageToken } from "@/utils/user-vali";

import {
  api_getTreeList,
  api_getChildList,
  api_saveOrUpdate,
  api_deleteById,
} from "@/api/projectMgr/projectMgr";

export default {
  components: {
    FForm,
  },
  data() {
    const data = [
      {
        id: -1,
        label: "上云管理",
        children: [
          {
            id: 1,
            label: "一级 1",
            children: [
              {
                id: 4,
                label: "二级 1-1",
                children: [
                  {
                    id: 9,
                    label: "三级 1-1-1",
                  },
                  {
                    id: 10,
                    label: "三级 1-1-2",
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            label: "一级 2",
            children: [
              {
                id: 5,
                label: "二级 2-1",
              },
              {
                id: 6,
                label: "二级 2-2",
              },
            ],
          },
          {
            id: 3,
            label: "一级 3",
            children: [
              {
                id: 7,
                label: "二级 3-1",
              },
              {
                id: 8,
                label: "二级 3-2",
              },
            ],
          },
        ],
      },
    ];
    return {
      activePermissionId: "",
      authListDailogVisible: false,
      treeProps: {
        children: "childPermissionEntityList",
      },
      imgBaseUrl: config.imgBaseUrl,
      showId: [0],
      flag: true,
      setCurrentKey: 28,
      dataList: [],
      field0: "",

      unitName: "",
      unitid: " ",

      otherConfig: {
        // 其他配置
        labelNum: 80, // label宽度，可选120和150，默认120
      },
      dialog: {
        dialogVisible: false,
        width: "",
        title: "",
        type: "",
      },
      otherConfig: {
        // 其他配置
        labelNum: 150, // label宽度，可选120和150，默认120
        column: 2, // 列数，默认2
        validateOnRuleChange: false,
      },
      form2: {
        config: [
          {
            col: 24,
            type: "select",
            name: "权限类型",
            placeholder: "请选择权限类型",
            bind: "permissionType",
            dataList: "typeList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择权限类型", // 必填需要指定提示信息
            change: this.permissionTypeChange,
          },
          {
            col: 24,
            type: "select",
            name: "权限分类",
            placeholder: "请选择权限分类",
            bind: "permissionHidden",
            dataList: "permissionHiddenList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择权限分类", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单名称",
            placeholder: "请输入菜单名称",
            bind: "permissionName",
            trigger: "blur", // 校验时机
            required: "请输入菜单名称", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单别名",
            placeholder: "请输入菜单别名",
            bind: "permissionStr",
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单图标",
            placeholder: "请输入菜单图标",
            bind: "icon",
          },
          // {
          //   type: "uploadAvatar",
          //   listType: "1",
          //   fileSize: 2,
          //   fileList: [],
          //   url: config.baseUrl + "/api/file/upload",
          //   col: 24, // 独占一行
          //   name: "菜单图标",
          //   bind: "icon",
          //   limit: 1,
          //   fileType: "jpg,jpeg,jpe,png", //校验
          //   tipInfo: "温馨提示：请上传2M以内，JPG、PNG格式的图标",
          // },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单链接",
            placeholder: "请输入菜单链接",
            bind: "remark",
          },
          {
            col: 24, // 独占一行
            type: "Number",
            name: "菜单序号",
            placeholder: "请输入菜单序号",
            bind: "sortNo",
            trigger: "blur", // 校验时机
            required: "请输入菜单序号", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单编码",
            placeholder: "请输入菜单编码",
            bind: "permissionCode",
            trigger: "blur", // 校验时机
            required: "请输入菜单编码", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "静态资源地址",
            placeholder: "请输入静态资源地址",
            bind: "entry",
            trigger: "blur", // 校验时机
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "路由前缀",
            placeholder: "请输入路由前缀",
            bind: "routerBase",
            trigger: "blur", // 校验时机
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "模块名称",
            placeholder: "请输入模块名称",
            bind: "module",
            trigger: "blur", // 校验时机
          },
        ],
      },
      form3: {
        config: [
          {
            col: 24,
            type: "select",
            name: "权限类型",
            placeholder: "请选择权限类型",
            bind: "permissionType",
            dataList: "typeList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择权限类型", // 必填需要指定提示信息
            change: this.permissionTypeChange,
          },
          {
            col: 24,
            type: "select",
            name: "权限分类",
            placeholder: "请选择权限分类",
            bind: "permissionHidden",
            dataList: "permissionHiddenList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择权限分类", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单名称",
            placeholder: "请输入菜单名称",
            bind: "permissionName",
            trigger: "blur", // 校验时机
            required: "请输入菜单名称", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单别名",
            placeholder: "请输入菜单别名",
            bind: "permissionStr",
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单图标",
            placeholder: "请输入菜单图标",
            bind: "icon",
          },
          // {
          //   type: "uploadAvatar",
          //   listType: "1",
          //   fileSize: 2,
          //   fileList: [],
          //   url: config.baseUrl + "/api/file/upload",
          //   col: 24, // 独占一行
          //   name: "菜单图标",
          //   bind: "icon",
          //   limit: 1,
          //   fileType: "jpg,jpeg,jpe,png", //校验
          //   tipInfo: "温馨提示：请上传2M以内，JPG、PNG格式的图标",
          // },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单链接",
            placeholder: "请输入菜单链接",
            bind: "remark",
          },
          {
            col: 24, // 独占一行
            type: "Number",
            name: "菜单序号",
            placeholder: "请输入菜单序号",
            bind: "sortNo",
            trigger: "blur", // 校验时机
            required: "请输入菜单序号", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单编码",
            placeholder: "请输入菜单编码",
            bind: "permissionCode",
            trigger: "blur", // 校验时机
            required: "请输入菜单编码", // 必填需要指定提示信息
          },
        ],
      },
      form4: {
        config: [
          {
            col: 24, // 独占一行
            type: "text",
            name: "静态资源地址",
            placeholder: "请输入静态资源地址",
            bind: "entry",
            trigger: "blur", // 校验时机
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "路由前缀",
            placeholder: "请输入路由前缀",
            bind: "routerBase",
            trigger: "blur", // 校验时机
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "模块名称",
            placeholder: "请输入模块名称",
            bind: "module",
            trigger: "blur", // 校验时机
          },
        ],
      },
      form: {
        config: [
          {
            col: 24,
            type: "select",
            name: "权限类型",
            placeholder: "请选择权限类型",
            bind: "permissionType",
            dataList: "typeList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择权限类型", // 必填需要指定提示信息
            change: this.permissionTypeChange,
          },
          {
            col: 24,
            type: "select",
            name: "权限分类",
            placeholder: "请选择权限分类",
            bind: "permissionHidden",
            dataList: "permissionHiddenList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择权限分类", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单名称",
            placeholder: "请输入菜单名称",
            bind: "permissionName",
            trigger: "blur", // 校验时机
            required: "请输入菜单名称", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单别名",
            placeholder: "请输入菜单别名",
            bind: "permissionStr",
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单图标",
            placeholder: "请输入菜单图标",
            bind: "icon",
          },
          // {
          //   type: "uploadAvatar",
          //   listType: "1",
          //   fileSize: 2,
          //   fileList: [],
          //   url: config.baseUrl + "/api/file/upload",
          //   col: 24, // 独占一行
          //   name: "菜单图标",
          //   bind: "icon",
          //   limit: 1,
          //   fileType: "jpg,jpeg,jpe,png", //校验
          //   tipInfo: "温馨提示：请上传2M以内，JPG、PNG格式的图标",
          // },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单链接",
            placeholder: "请输入菜单链接",
            bind: "remark",
          },
          {
            col: 24, // 独占一行
            type: "Number",
            name: "菜单序号",
            placeholder: "请输入菜单序号",
            bind: "sortNo",
            trigger: "blur", // 校验时机
            required: "请输入菜单序号", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单编码",
            placeholder: "请输入菜单编码",
            bind: "permissionCode",
            trigger: "blur", // 校验时机
            required: "请输入菜单编码", // 必填需要指定提示信息
          },
        ],
        data: {
          permissionStr: "",
          permissionCode: "",
          icon: "",
          remark: "",
          permissionType: "",
          permissionHidden: "",
          permissionName: "",
          routerBase: "",
          module: "",
          entry: "",
        },
        enums: {
          typeList: [
            {
              dataName: "菜单",
              dataValue: 0,
            },
            {
              dataName: "页面组件",
              dataValue: 1,
            },
            {
              dataName: "视图显示",
              dataValue: 3,
            },
            {
              dataName: "快捷入口",
              dataValue: 4,
            },
            {
              dataName: "工作台鱼骨",
              dataValue: 5,
            },
          ],
          permissionHiddenList: [
            {
              dataName: "前台菜单",
              dataValue: 0,
            },
            {
              dataName: "公共部分",
              dataValue: -1,
            },
            {
              dataName: "后台菜单",
              dataValue: -2,
            },
            {
              dataName: "移动端菜单",
              dataValue: -3,
            },
          ],
          menuUrlList: [],
        },
        rules: {},
      },
      permissionName: "",
      permissionId: "",
      parentId: "",
      menuLevel: "",
      loading: true,
      permissionTypeIndex: "",
      handleNodeData: "",
      active: 0,
      file: "",
      dialogFlag: false, // 弹窗
      filelist: [], // 上传文件列表
      stepStatus: "0", // 步骤条状态  0：导入前   1：导入中  2：成功
      emptyImg: require("@/assets/empty.png"), // 空白
      waitImg: require("@/assets/step_wait.png"), // 导入中
      checkImg: require("@/assets/Check.png"), // 成功
      circleImg: require("@/assets/Circle.png"), // 失败
      warningImg: require("@/assets/warning.png"), // 警告
      warningList: [],
      checkNum: 0,
      node_had: "", // 当前节点
      main_node: "", // 根节点
      main_resolve: "", // 根节点函数
      btnFlag: false,
    };
  },
  watch: {
    permissionName(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.getPermissionyInfoList();
    this.getListByTopicAndItem();
  },
  methods: {
    //移动到下一级
    setSubordinate(data) {
      let parentId = data.permissionId;
      let params = {
        sourcePermissionId: this.activePermissionId,
        targetParentPermissionId: parentId,
      };
      api_moveMenus(params).then((res) => {
        if (res.msg.code == "0000") {
          this.$message({
            message: "移动成功",
            type: "success",
          });
          this.getPermissionyInfoList();
          this.authListDailogVisible = false;
        }
      });
    },
    //移动到同级
    setSameLevel(data) {
      let parentId = data.parentId || 0;
      let params = {
        sourcePermissionId: this.activePermissionId,
        targetParentPermissionId: parentId,
      };
      api_moveMenus(params).then((res) => {
        if (res.msg.code == "0000") {
          this.$message({
            message: "移动成功",
            type: "success",
          });
          this.getPermissionyInfoList();
          this.authListDailogVisible = false;
        }
      });
    },
    moveMenu(node, data) {
      this.activePermissionId = data.permissionId;
      this.authListDailogVisible = true;
      this.$nextTick(() => {
        let list = this.getChildIds(this.dataList, this.activePermissionId);
        this.$refs.dialogTree.filter(list);
      });
    },
    getChildIds(arr, id) {
      var childIds = [];
      console.log(arr, id);
      function a(arr) {
        for (var i = 0; i < arr.length; i++) {
          if (id === arr[i].permissionId) {
            childIds.push(arr[i].permissionId);
            if (arr[i].childPermissionEntityList) {
              b(arr[i].childPermissionEntityList);
            }
          } else {
            if (arr[i].childPermissionEntityList) {
              a(arr[i].childPermissionEntityList);
            }
          }
        }
      }
      function b(arr) {
        for (var i = 0; i < arr.length; i++) {
          childIds.push(arr[i].permissionId);
          if (arr[i].childPermissionEntityList) {
            b(arr[i].childPermissionEntityList);
          }
        }
      }
      a(arr);
      return childIds;
    },
    permissionTypeChange(value) {
      this.setFormConfig(value);
    },
    setFormConfig(value) {
      if (value == 4) {
        this.form.config = [
          {
            col: 24,
            type: "select",
            name: "权限类型",
            placeholder: "请选择权限类型",
            bind: "permissionType",
            dataList: "typeList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择权限类型", // 必填需要指定提示信息
            change: this.permissionTypeChange,
          },
          {
            col: 24,
            type: "select",
            name: "权限分类",
            placeholder: "请选择权限分类",
            bind: "permissionHidden",
            dataList: "permissionHiddenList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择权限分类", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单名称",
            placeholder: "请输入菜单名称",
            bind: "permissionName",
            trigger: "blur", // 校验时机
            required: "请输入菜单名称", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单别名",
            placeholder: "请输入菜单别名",
            bind: "permissionStr",
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单图标",
            placeholder: "请输入菜单图标",
            bind: "icon",
          },
          {
            col: 24,
            type: "select",
            name: "快捷入口",
            placeholder: "请选择快捷入口",
            bind: "menuUrl",
            dataList: "menuUrlList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择快捷入口", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单链接",
            placeholder: "请输入菜单链接",
            bind: "remark",
          },
          {
            col: 24, // 独占一行
            type: "Number",
            name: "菜单序号",
            placeholder: "请输入菜单序号",
            bind: "sortNo",
            trigger: "blur", // 校验时机
            required: "请输入菜单序号", // 必填需要指定提示信息
            rules: {
              validator_1: this.validator, // 自定义事件校验（仅在其他校验方式无法实现时使用）
            },
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单编码",
            placeholder: "请输入菜单编码",
            bind: "permissionCode",
            trigger: "blur", // 校验时机
            required: "请输入菜单编码", // 必填需要指定提示信息
          },
        ];
      } else {
        this.form.config = [
          {
            col: 24,
            type: "select",
            name: "权限类型",
            placeholder: "请选择权限类型",
            bind: "permissionType",
            dataList: "typeList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择权限类型", // 必填需要指定提示信息
            change: this.permissionTypeChange,
          },
          {
            col: 24,
            type: "select",
            name: "权限分类",
            placeholder: "请选择权限分类",
            bind: "permissionHidden",
            dataList: "permissionHiddenList", // 定义在this.form.enums中的typeList
            trigger: "blur", // 校验时机
            required: "请选择权限分类", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单名称",
            placeholder: "请输入菜单名称",
            bind: "permissionName",
            trigger: "blur", // 校验时机
            required: "请输入菜单名称", // 必填需要指定提示信息
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单别名",
            placeholder: "请输入菜单别名",
            bind: "permissionStr",
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单图标",
            placeholder: "请输入菜单图标",
            bind: "icon",
          },

          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单链接",
            placeholder: "请输入菜单链接",
            bind: "remark",
          },
          {
            col: 24, // 独占一行
            type: "number",
            name: "菜单序号",
            placeholder: "请输入菜单序号",
            bind: "sortNo",
            trigger: "blur", // 校验时机
            required: "请输入菜单序号", // 必填需要指定提示信息
            rules: {
              validator_1: this.validator, // 自定义事件校验（仅在其他校验方式无法实现时使用）
            },
          },
          {
            col: 24, // 独占一行
            type: "text",
            name: "菜单编码",
            placeholder: "请输入菜单编码",
            bind: "permissionCode",
            trigger: "blur", // 校验时机
            required: "请输入菜单编码", // 必填需要指定提示信息
          },
        ];
      }
      // if (this.menuLevel == 1) {
      this.form.config = this.form.config.concat(this.form4.config);
      // }
    },
    validator(rule, value, callback) {
      console.log(Number.isInteger(Number(value)));
      if (Number.isInteger(Number(value)) && Number(value) > 0) {
        callback();
      } else {
        callback(new Error("请输入大于0的整数"));
      }
    },
    getListByTopicAndItem() {
      api_listByTopicAndItem({ topic: "JFZG_QUICK_ENTRY_ICON" }).then((res) => {
        if (res.msg.code == "0000") {
          this.form.enums.menuUrlList = res.data.map((item) => {
            return {
              dataName: item.memo,
              dataValue: item.itemCode,
            };
          });
        }
      });
    },
    handleNodeClick(data) {
      this.menuLevel = data.menuLevel;
      this.handleNodeData = data;
      let arr = [
        {
          dataName: "菜单",
          dataValue: 0,
        },
        {
          dataName: "页面组件",
          dataValue: 1,
        },
        {
          dataName: "视图显示",
          dataValue: 3,
        },
        {
          dataName: "快捷入口",
          dataValue: 4,
        },
        {
          dataName: "工作台鱼骨",
          dataValue: 5,
        },
      ];
      if (this.menuLevel == 1) {
        this.$set(this.form, "config", this.form2.config);
      } else {
        this.$set(this.form, "config", this.form3.config);
      }
      this.$set(this.form.enums, "typeList", arr);
      if (data.permissionId == "0") {
        return;
      }
      this.unitName = "编辑";
      let list = {
        permissionId: data.permissionId,
      };
      api_getPermissionyInfo(list).then((res) => {
        if (res.data && res.msg && res.msg.code == "0000") {
          this.setFormConfig(res.data.permissionType);
          this.form.data = res.data;
          this.permissionId = data.permissionId;
          this.parentId = "";
          this.menuLevel = res.data.menuLevel;
        }
      });
    },
    filterNode1(value, data) {
      // console.log(data)
      // return
      if (!value) return true;
      return data.permissionName.indexOf(value) !== -1;
    },
    filterNode(value, data) {
      if (data.permissionType != 0) {
        return;
      }
      return value.indexOf(data.permissionId) === -1;
    },
    //获取权限树列表
    getPermissionyInfoList() {
      let data = {
        permissionName: this.permissionName,
      };
      api_getPermissionyInfoList(data).then((res) => {
        if (res.data && res.msg && res.msg.code == "0000") {
          if (this.dataList.length == 0) {
            this.dataList.push({
              permissionName: "权限管理",
              permissionId: 0,
              menuLevel: 0,
              childPermissionEntityList: {},
            });
          }
          this.dataList[0].childPermissionEntityList = [...res.data];
          this.loading = false;
        }
      });
    },
    setInput(event) {
      if (event.target.className.includes("el-icon-search")) {
        this.loading = true;
        this.getPermissionyInfoList();
      } else {
        return;
      }
    },
    // 重置信息
    reseveInfo() {
      if (
        this.stepStatus == "2" ||
        this.stepStatus == "3" ||
        this.stepStatus == "4"
      ) {
        this.stepStatus = "0";
        this.active = 0;
        this.getPermissionyInfoList(this.main_node, this.main_resolve);
      }
      this.dialogFlag = false;
    },

    eventNotify() {},
    //新建或修改
    submit() {
      if ("1345".includes(this.form.data.permissionType + "")) {
        this.menuLevel = 4;
      }
      let data = {
        permissionId: this.permissionId,
        permissionName: this.form.data.permissionName,
        permissionType: this.form.data.permissionType,
        permissionHidden: this.form.data.permissionHidden,
        remark: this.form.data.remark,
        icon: this.form.data.icon,
        permissionCode: this.form.data.permissionCode,
        permissionStr: this.form.data.permissionStr,
        routerBase: this.form.data.routerBase,
        module: this.form.data.module,
        entry: this.form.data.entry,
        parentId: this.parentId,
        menuLevel: this.menuLevel,
        sortNo: +this.form.data.sortNo,
      };
      let newPromise = new Promise((resolve, reject) => {
        this.$refs["modelMgrRef"].$refs["modelMgrRefForm"].validate((valid) => {
          if (valid) {
            resolve();
          }
        });
      });
      Promise.all([newPromise]).then(() => {
        api_permissionSaveOrUpdate(data).then((res) => {
          if (res.msg && res.msg.code == "0000") {
            if (this.unitName == "添加下级") {
              this.form.data = {};
              this.permissionId = "";
              this.parentId = "";
              this.getPermissionyInfoList();
            } else if (this.unitName == "编辑") {
              // this.unitName = "";
            }
            this.$message({
              message: this.unitName.substring(0, 2) + "成功",
              type: "success",
            });
          }
        });
      });
    },
    // 添加下级
    addSubordinate(data, type) {
      this.unitName = "添加下级";
      let list = {
        permissionStr: "",
        permissionCode: "",
        icon: "",
        remark: "",
        permissionType: "",
        permissionName: "",
      };
      if (type.menuLevel == 0) {
        let arr = [
          {
            dataName: "菜单",
            dataValue: 0,
          },
        ];
        this.$set(this.form.enums, "typeList", arr);
      } else if (type.menuLevel == 3) {
        let arr = [
          {
            dataName: "页面组件",
            dataValue: 1,
          },
          {
            dataName: "视图显示",
            dataValue: 3,
          },
          {
            dataName: "快捷入口",
            dataValue: 4,
          },
          {
            dataName: "工作台鱼骨",
            dataValue: 5,
          },
        ];
        this.$set(this.form.enums, "typeList", arr);
      } else {
        let arr = [
          {
            dataName: "菜单",
            dataValue: 0,
          },
          {
            dataName: "页面组件",
            dataValue: 1,
          },
          {
            dataName: "视图显示",
            dataValue: 3,
          },
          {
            dataName: "快捷入口",
            dataValue: 4,
          },
          {
            dataName: "工作台鱼骨",
            dataValue: 5,
          },
        ];
        this.$set(this.form.enums, "typeList", arr);
      }
      this.parentId = type.permissionId;
      this.form.data = list;
      this.menuLevel = type.menuLevel + 1;
      this.permissionId = "";
    },
    remove(node, data) {
      if (
        !data.childPermissionEntityList ||
        data.childPermissionEntityList.length <= 0
      ) {
        let list = {
          permissionId: data.permissionId,
        };
        api_delPermissiony(list).then((res) => {
          if (res.msg && res.msg.code == "0000") {
            console.log(res);
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getPermissionyInfoList();
            this.form.data = {};
            this.permissionId = "";
            this.parentId = "";
            this.unitName = "";
          }
        });
      } else {
        this.$message.error("删除失败,里面还有成员");
      }
    },
    // 开始导入
    postFile() {
      if (this.file == "") {
        this.$message({
          type: "error",
          message: "上传文件不能为空",
        });
        return false;
      } else {
        this.stepStatus = "1";
        // 文件形式的需要用 formData形式
        let formData = new FormData();
        formData.append("file", this.file);
        formData.append("url", window.location.origin);
        api_bootFile(formData).then((res) => {
          if (res.msg.reasonPhrase == "SUCCESS" || res.msg.code == "0000") {
            if (res.msg.message == "SUCCESS") {
              if (res.data == "0") {
                this.stepStatus = "3";
                this.active = 2;
              } else {
                this.stepStatus = "2";
                this.active = 3;
                this.checkNum = res.data;
              }
            } else {
              if (res.data && res.data.length) {
                this.warningList = res.data;
              }
              this.stepStatus = "4";
            }
          }
        });
      }
    },
    // 标签导出
    exportFlie() {
      // let access_token = "8fc9dac6-21fb-441b-883d-8de161a64f46";
      let access_token = getStorageToken();
      let exportUrl =
        config.baseUrl +
        `/jfzg/opcenter/api/label/export?access_token=${access_token}`;
      window.location.href = exportUrl;
    },

    // 下载模板
    downloadTemplate() {
      // let access_token = "8fc9dac6-21fb-441b-883d-8de161a64f46";
      let access_token = getStorageToken();
      let downloadUrl =
        config.baseUrl +
        `/jfzg/opcenter/api/label/download?access_token=${access_token}`;
      window.location.href = downloadUrl;
    },

    // 标签导入
    bootFile() {
      this.dialogFlag = true;
    },
    // 选择文件
    handleExceed(e) {
      // 判断上传文件个数，超过提示报错
      // console.log(e);
      // this.$message({
      //   message: "只能上传一个文件",
      //   type: "error"
      // });
    },

    handleChansge(file, fileList) {
      let name = file.name;
      if (!/\.(xlsx|xls|XLSX|XLS)$/.test(file.name)) {
        this.$message({
          type: "error",
          message: "上传文件只能为excel文件，且为xlsx,xls格式",
        });
        this.file = "";
        this.filelist = [];
        return;
      } else {
        this.active = 1;
        this.file = file.raw;
        this.fileList = fileList;
      }
    },

    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    removeFile(file, fileList) {
      this.file = "";
    },
  },
};
</script>
<style lang="scss">
.authList {
  .img {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .authListOperation {
    display: block;
    text-align: center;
    width: 80px;
    .ml10 {
      margin-left: 10px;
    }
  }
  .el-tree-node__content {
    height: 38px;
    line-height: 38px;
  }
  .el-tree-node__content:hover {
    background: #e6f7ff;
  }
  .rightSearch {
    .container {
      padding: 10px;
    }
  }
}
</style>
<style lang="scss" scoped>
.authList {
  position: relative;
  /deep/.el-input__icon.el-icon-search {
    cursor: pointer;
  }
  /deep/ .el-aside {
    padding-top: 0;
  }
  /deep/ .el-tree {
    margin: 10px 0;
  }
  .el-button {
    height: 32px;
    border-radius: 16px;
    line-height: 0 !important;
  }
  .outBtn {
    position: absolute;
    right: 114px;
  }
  .inBtn {
    position: absolute;
    right: 0;
  }
  .title {
    // height: 20px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
  }
  .form {
    width: 80%;
    margin: 0 auto;
  }
  .search {
    padding: 16px 0 14px 0;
    line-height: 31px;
    position: relative;
    .buttonGroup {
      display: inline-block;
      /deep/.button1 {
        margin-right: 8px;
      }
      /deep/ .el-button {
        border-radius: 16px;
      }
    }
  }

  .demo-input-suffix {
    width: 302px;
    display: inline-block;
    position: relative;
    padding-left: 80px;
    // margin-right: 48px;
    .lable {
      width: 80px;
      text-align: right;
      position: absolute;
      left: 0;
      font-size: 14px;
      top: 50%;
      transform: translateY(-50%);
    }
    .input {
      width: 224px;
      height: 32px;
      /deep/.el-input__inner {
        line-height: 32px;
        height: 32px;
        border-radius: 16px;
      }
      /deep/.el-input__icon {
        line-height: 35px;
      }
    }
  }
  .first {
    width: 302px;
    padding-left: 70px;
    .lable {
      width: 70px;
    }
  }
  ::v-deep {
    .treeBox {
      .custom-tree-node {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
        .tree_popover {
          width: 60px !important;
        }
        .tree_icon {
          color: #bfbfbf;
        }
        .tree_icon:hover {
          color: #007aff;
        }
        .buttonOperation {
          display: flex;
          align-items: center;
          margin: 0;
          a {
            height: 100%;
            margin-right: 5px;
            &:hover {
              color: #0090ff;
            }
          }
        }
      }
    }
  }
  .container {
    width: 100%;
    .title {
      height: 54px;
      line-height: 54px;
    }
    .el-aside {
      background: white;
      border-right: 1px solid #eee;
      .custom-tree-node {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
        .tree_popover {
          width: 60px !important;
        }
        .tree_icon {
          color: #bfbfbf;
        }
        .tree_icon:hover {
          color: #007aff;
        }
        .buttonOperation {
          display: inline-grid;
        }
      }
    }
    .el-main {
      padding-top: 0;
      .title {
        height: 54px;
        line-height: 54px;
        padding-left: 11px;
      }
    }

    .steps {
      /deep/ .el-step__head .el-step__icon {
        width: 24px;
        height: 24px;
        border: 4px solid #d9d9d9;
      }

      /deep/ .el-step__title {
        font-size: 14px;
      }
      /deep/ .is-finish {
        font-weight: 400;
        color: #666666;
      }
      /deep/ .is-process .el-step__icon {
        background: #ffffff;
        border: 8px solid #0090ff;
      }
      /deep/ .el-step__head.is-success .el-step__icon {
        border: 1px solid #0090ff;
      }
      // /deep/ .is-finish .el-step__icon {
      //   border: 1px solid #0090ff;
      // }
      /deep/ .el-step__head.is-success {
        border-color: #0090ff;
        color: #0090ff;
      }
      /deep/ .is-success .el-step__line {
        background-color: #0090ff;
      }
      /deep/ .el-step__title.is-success {
        color: #666666;
      }
      /deep/ .el-step__icon-inner {
        color: #0090ff;
      }
      .itemDes {
        font-size: 12px;
        color: #999999;
        // margin-top: 10px;
      }
      .downloadTemplate {
        color: #0090ff;
        cursor: pointer;
      }
    }

    .fileContent {
      width: 624px;
      height: 228px;
      border: 1px solid #d9d9d9;
      border-radius: 8px;
      margin-top: 24px;

      .step_empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: initial;

        .empty_img {
          width: 80px;
          height: 60px;
          margin-top: 48px;
        }

        .empty_null {
          margin: 8px 0;
          color: #666;
        }

        .emptyBtn {
          margin-top: 20px;
        }
      }

      .stepTwo {
        padding-left: 16px;
        .baginPost {
          margin-top: 24px;
          margin-left: 8px;
        }
        .chooseFile {
          height: 22px;
          font-size: 14px;
          font-weight: 500;
          color: #333333;
          line-height: 22px;
          margin-top: 16px;
        }
      }

      .stepThree {
        height: 100%;
        .threeContent {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          line-height: initial;
          img {
            width: 40px;
            height: 40px;
          }
          .stepThree_title {
            color: #333333;
            margin-top: 12px;
          }
        }

        .circleContent {
          display: flex;
          align-items: center;
          flex-direction: column;
          .circleImg {
            width: 40px;
            height: 40px;
            margin-top: 24px;
          }
          .stepThree_title {
            color: #333333;
            margin-top: 12px;
          }
          .warningList {
            width: 592px;
            height: 102px;
            background: #f5f5f5;
            border-radius: 8px;
            margin-top: 12px;
            overflow-y: scroll;
            padding: 16px 0 8px 16px;
            li {
              height: 22px;
              line-height: 22px;
              color: #333333;
              margin-bottom: 4px;
            }
          }
        }
      }
    }
  }
  // 弹框
  .springBox {
    .springBox_button {
      text-align: center;
    }
  }
  .dialog-footer {
    width: 100%;
    height: 100%;
    display: inline-block;
    text-align: center;
    padding-top: 24px;
  }
}
</style>
