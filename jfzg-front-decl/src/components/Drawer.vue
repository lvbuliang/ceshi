<template>
  <div>
    <el-drawer
      title=""
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      :show-close="false"
    >
      <div class="demo-drawer__content">
        <div v-if="isShowform">
          <SrAdd
            :config="form.config"
            :otherConfig="{ labelNum: 144 }"
            :form="form.data"
            :enums="form.enums"
            ref="add"
            class="add"
          >
          </SrAdd>
          <!-- && hasSubmit != 1 -->
          <!-- (userInfo.currentRole.roleCode == 'SPXZ_ZZ' && isEdit == true) ||
              (userInfo.currentRole.roleCode == 'SPXZ_ZZ' && isAdd == true) -->
          <!-- 原 -->
          <!-- v-if="userInfo.currentRole.roleCode == 'SPXZ_ZZ'" -->
          <el-button
            type="text"
            style="width: 230px; text-align: right"
            v-if="userInfo.currentRole.roleCode == 'PSZJ'"
          >
            <!-- 下载模板 href="/word/初审意见模版.docx"-->
            <a
              href="/decl/word/初审意见模版.docx"
              style="color: #1890ff; text-decoration: underline"
              download="初审意见模板.docx"
              >初审意见模板</a
            >
          </el-button>
          <!-- 文件查看 下载 ||
              (userInfo.currentRole.roleCode == 'SPXZ_ZZ' && hasSubmit == 1)-->
          <!--  userInfo.currentRole.roleCode != 'SPXZ_ZZ' ||
              (isEdit == false && isAdd == false) -->
          <!-- v-if="userInfo.currentRole.roleCode != 'SPXZ_ZZ'" -->
          <div class="fujianFix" v-if="userInfo.currentRole.roleCode != 'PSZJ'">
            <div class="fujiantitle">附件：</div>
            <div>
              <div
                v-for="item in form.data.preliminaryExaminationAnnex"
                class="fujianItem"
                :key="item"
              >
                <span @click="toView(item)" class="fujianItemName">{{
                  item.name
                }}</span>
                <i @click="toDwon(item)" class="el-icon-download"></i>
              </div>
              <div
                class="fujianItem"
                v-if="
                  form.data.preliminaryExaminationAnnex == null ||
                  form.data.preliminaryExaminationAnnex.length == 0
                "
              >
                暂无附件
              </div>
            </div>
          </div>
          <div class="xian"></div>
        </div>
        <!-- 审核经办人 -->
        <div v-if="isShowMoreform">
          <el-tabs v-model="formActiveName" @tab-click="formHandleClick">
            <el-tab-pane
              :label="item.expertName"
              :name="item.index"
              :key="item.index"
              v-for="(item, index) in moreformData"
            >
              <SrAdd
                :config="form.config"
                :otherConfig="{ labelNum: 144 }"
                :form="item"
                :enums="form.enums"
                ref="add"
                class="add"
              >
              </SrAdd>
              <div
                class="fujianFix"
                v-if="userInfo.currentRole.roleCode != 'PSZJ'"
              >
                <div class="fujiantitle">附件：</div>
                <div>
                  <div
                    v-for="item in item.preliminaryExaminationAnnex"
                    class="fujianItem"
                    :key="item"
                  >
                    <span @click="toView(item)" class="fujianItemName">{{
                      item.name
                    }}</span>
                    <i @click="toDwon(item)" class="el-icon-download"></i>
                  </div>
                  <div
                    class="fujianItem"
                    v-if="
                      item.preliminaryExaminationAnnex == null ||
                      item.preliminaryExaminationAnnex.length == 0
                    "
                  >
                    暂无附件
                  </div>
                </div>
              </div>
              <div class="xian"></div>
            </el-tab-pane>
          </el-tabs>
          <!-- <el-button
            type="text"
            style="width: 230px; text-align: right"
            v-if="userInfo.currentRole.roleCode == 'PSZJ'"
          >
            <a
              href="/decl/word/初审意见模版.docx"
              style="color: #1890ff; text-decoration: underline"
              download="初审意见模板.docx"
              >初审意见模板</a
            >
          </el-button> -->
        </div>
        <div>
          <div class="tableBtn">
            <el-button type="primary" size="small" @click="addTab" v-if="isAdd"
              >新增初审详细意见</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="editTab"
              v-if="isEdit"
              >编辑初审详细意见</el-button
            >
          </div>
          <el-tabs class="tabs2" v-model="activeName" @tab-click="handleClick">
            <!-- :label="'符合性前置审查意见详情' + item.id" -->
            <el-tab-pane
              :label="'符合性前置审查意见详情'"
              :name="item.id"
              :key="item.id"
              v-for="item in tabList"
            >
              <el-table
                :data="item.tabData"
                :span-method="arraySpanMethod"
                :show-header="false"
                border
                style="width: 100%"
              >
                <el-table-column prop="category" label="项目及分值" width="100">
                </el-table-column>
                <el-table-column prop="message" label="参考标准及评价方法">
                  <!-- <el-table-column prop="activityName"></el-table-column> -->
                  <!-- <el-table-column prop="message"></el-table-column> -->
                </el-table-column>
                <el-table-column prop="value" label="参考分值" width="200">
                  <template slot-scope="scope">
                    <el-radio-group
                      v-model="scope.row.value"
                      size="small"
                      :disabled="isRadio"
                    >
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>

          <div class="demo-drawer__footer">
            <el-button
              type="primary"
              @click="submitDrawer"
              size="small"
              round
              v-if="tj"
            >
              提 交
            </el-button>
            <el-button @click="saveDrawer" size="small" round v-if="bc"
              >保 存</el-button
            >
            <el-button @click="cancelForm" size="small" round v-if="qx"
              >返回列表</el-button
            >
          </div>
        </div>
        <!-- <div>没有分配小组,暂无初审详细意见</div>
        <div>暂无小组填写初审详细意见</div> -->
      </div>
    </el-drawer>
  </div>
</template>

<script>
import config from "@/settings.js";
import upload from "@/utils/upload";
import {
  api_getServiceTypeList,
  getCx,
  getBc,
  getTj,
  firstTrialByExpert,
  saveFirstTrialByExpert,
  getOpinionByExpert,
  getTjyj,
  getCkxsyj,
  getFirstTrialOpinion,
} from "@/api/planProject";
export default {
  name: "JfzgCommonSiteDrawer",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    currentStatus: Number,
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  data() {
    return {
      // baseUrl: config.uploadBaseUrl,
      isEdit: false, //是否出现编辑按钮
      isAdd: false, //是否出现新增
      activeName: "", //tab页
      tj: true, //提交是否存在
      bc: true, //保存是否存在
      qx: true, //取消是否存在
      isRadio: false, //单选是否禁用
      tabList: [], //表格数据
      hasSubmit: "", //是否提交
      table: false,
      dialog: false,
      isShowform: true, //是否展示表单
      list: [
        {
          id: "16EE8A54E6917F6479905CDC5B031F22",
          activityPointsDOS: [
            {
              id: "16EE8A54E0C17F647404A2DC7783EE88",
              activityPointsDOS: [
                {
                  id: "1",
                  value: "",
                  activityName: "必要性分析",
                  message:
                    " 是否属于深圳市智慧城市和数字政府建设 73 项重点工作任务。",
                  period: "19上半年",
                },
                {
                  id: "2",
                  value: "",
                  activityName: "必要性分析",
                  message: "是否属于数字李生城市重点项目。",
                  period: "19上半年",
                },
                {
                  id: "3",
                  value: "",
                  activityName: "必要性分析",
                  message:
                    "是否属于落实国家、省、市等上级部门部署，且相关要求与项目直接关联。",
                  period: "19上半年",
                },
                {
                  id: "4",
                  value: "",
                  activityName: "必要性分析",
                  message:
                    "是否属于落实本部门业务创新和管理优化要求，且相关要求与项目直接关联。",
                  period: "19上半年",
                },
                {
                  id: "5",
                  value: "",
                  activityName: "必要性分析",
                  message:
                    "相关依据文件是否明确要求本项目内容必须于今年内实施。",
                  period: "19上半年",
                },
                {
                  id: "6",
                  value: "",
                  activityName: "必要性分析",
                  message:
                    "项目在智 慧城市和数字政府建设规划中的定位是否清晰。",
                  period: "19上半年",
                },
              ],
              activityName: "必要性分析",
            },
          ],
          category: "必要性分析",
        },
        {
          id: "16EE8A54FF617F6491391BD04A0D4E7F",
          activityPointsDOS: [
            {
              id: "16EE8A54EA517F647D257760897C805F",
              activityPointsDOS: [
                {
                  id: "7",
                  value: "",
                  activityName: "关联性分析",
                  message:
                    " 是否清晰描述本单位业务、项目、系统在智慧城市与数字政府中的整体关联关系。",
                  period: "19上半年",
                },
                {
                  id: "8",
                  value: "",
                  activityName: "关联性分析",
                  message:
                    " 是否与外单位存在强关联关系，如不开展本项目将影响其他项目推进。",
                  period: "19上半年",
                },
                {
                  id: "9",
                  value: "",
                  activityName: "关联性分析",
                  message:
                    "外单位业务开展情况影响本项目进展，但项目总清单中未见该单位申报对应项目。",
                  period: "19上半年",
                },
              ],
              activityName: "关联性分析",
            },
          ],
          category: "关联性分析",
        },
        {
          id: "16EE8A54FF617F6491391BD04A0D4E7F",
          activityPointsDOS: [
            {
              id: "16EE8A54EA517F647D257760897C805F",
              activityPointsDOS: [
                {
                  id: "10",
                  value: "",
                  activityName: "总体可行性",
                  message: "是否已完成本部门信息化规划编制并印发实施。",
                  period: "19上半年",
                },
                {
                  id: "11",
                  value: "",
                  activityName: "总体可行性",
                  message:
                    "如未完成本部门信息化规划编制，是否正在编制中，并明确完成计划。",
                  period: "19上半年",
                },
                {
                  id: "12",
                  value: "",
                  activityName: "总体可行性",
                  message: "是否已完成本项目方案编制。",
                  period: "19上半年",
                },
                {
                  id: "13",
                  value: "",
                  activityName: "总体可行性",
                  message:
                    "如未完成本项目方案编制，是否正在编制中，并明确完成计划。",
                  period: "19上半年",
                },
                {
                  id: "14",
                  value: "",
                  activityName: "总体可行性",
                  message:
                    "是否明确组织架构及沟通协调机制，包括明确分管领导和牵头业务部门。",
                  period: "19上半年",
                },
                {
                  id: "15",
                  value: "",
                  activityName: "总体可行性",
                  message:
                    "是否已开展本项目相关标准规范体系、项目管理机制建设。",
                  period: "19上半年",
                },
                {
                  id: "16",
                  value: "",
                  activityName: "总体可行性",
                  message: "是否开展业务应用流程设计。",
                  period: "19上半年",
                },
              ],
              activityName: "总体可行性",
            },
          ],
          category: "总体可行性",
        },
      ],
      form: {
        config: [
          {
            type: "select",
            class: "xuanze",
            slotName: "inputBox",
            name: "初审总体结论",
            placeholder: "请选择结论",
            bind: "overallConclusion",
            dataList: "conclusionList",
            append: true,
            disabled: false,
            maxlength: 500,
            col: 12,
            trigger: "blur", // 校验时机
            required: "请选择初审总体结论",
          },
          {
            type: "textarea",
            name: "初审总体意见",
            placeholder: "请输入意见",
            bind: "overallOpinion",
            append: true,
            maxlength: 2000,
            col: 24,
            row: 4,
            trigger: "blur",
            disabled: false,
            required: "请输入意见",
          },
          {
            type: "upload",
            name: "附件",
            className: "fujian1",
            bind: "preliminaryExaminationAnnex",
            fileList: [],
            fileTip: "仅支持pdf,word,ofd格式文件",
            fileType: "pdf,doc,docx,ofd",
            limit: 10,
            display: "block",
            disabled: true,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 24,
          },
        ],
        enums: {
          conclusionList: [], //结论
        },
        data: {
          overallConclusion: "", //结论
          overallOpinion: "", //意见
          preliminaryExaminationAnnex: [], //附件
        },
      },
      version: null, //版本
      isShowMoreform: false, //是否展示多表单
      moreformData: [], //审核经办人查看结论意见
      formActiveName: "", //form的 tab
    };
  },
  computed: {
    userInfo() {
      return JSON.parse(sessionStorage.getItem("userInfo"));
    },
  },
  watch: {
    currentStatus: {
      handler(v) {
        console.log("状态...", this.currentStatus);
        this.tabList = [];
        if (
          this.userInfo.currentBizunit.buProperty == 9 ||
          (this.userInfo.currentBizunit.buProperty == 1 &&
            this.$route.query.type != 1 &&
            this.currentStatus != 2 &&
            this.currentStatus != 201)
        ) {
          // console.log("............");
          this.getCx(); //查询
        } else {
          // console.log("111111111111");
          this.getCx1(); //查询
          console.log("你好2");
        }
      },
    },
  },
  created() {
    console.log("代办过来", this.$route.query.type);
    if (this.$route.query.type && this.$route.query.type == 1) {
      this.dialog = true;
    } else {
      // type:2联合会审type:3专家评审
      this.dialog = false;
    }
    if (this.$route.query.drawerisshow && this.$route.query.type == 1) {
      this.dialog = true;
    }
    this.version = this.$route.query.version;

    // 原
    /*   if (this.userInfo.currentRole.roleCode != "SPXZ_ZZ") {
      this.$set(this.form.config[0], "disabled", true);
      this.$set(this.form.config[1], "disabled", true);
    } */
    // 经办人只能查看
    if (this.userInfo.currentRole.roleCode != "PSZJ") {
      this.$set(this.form.config[0], "disabled", true);
      this.$set(this.form.config[1], "disabled", true);
    }
    // 表格二次处理数据
    this.alldata = this.handleTableArr(this.list);
    console.log("表格", this.tabList);
    this.$EventBus.$on("drawerisshow", (data, data1, data2 = false) => {
      console.log("传递", data, data1, data2);
      this.dialog = data;
      // data1控制上面表单是否展示
      if (data1) {
        this.isShowform = false;
      }
      if (data2) {
        this.isShowMoreform = true;
      }
    });
    console.log(this.dialog);
    console.log("11111", typeof this.version);
    // 查询分组初审专家结论
    this.getFirstTrialOpinionList();
  },
  mounted() {
    /*// 不是组长附件禁用处理
    // 原
    /*  setTimeout(() => {
      console.log(
        "禁用了吗",
        this.userInfo.currentRole.roleCode,
        this.isEdit,
        this.isAdd
      );
      if (this.userInfo.currentRole.roleCode != "SPXZ_ZZ") {
        this.$set(this.form.config[2], "display", "none");
      } else if (
        this.userInfo.currentRole.roleCode == "SPXZ_ZZ" &&
        this.isEdit == false &&
        this.isAdd == false
      ) {
        // 组长附件禁用
        this.$set(this.form.config[2], "display", "none");
      }
    }, 300); */
    if (this.userInfo.currentRole.roleCode != "PSZJ") {
      this.$set(this.form.config[2], "display", "none");
    }
    this.getConclusionList();
    this.$nextTick(() => {
      if (this.currentStatus) {
        console.log("状态...", this.currentStatus);
        if (
          this.userInfo.currentBizunit.buProperty == 9 ||
          (this.userInfo.currentBizunit.buProperty == 1 &&
            this.$route.query.type != 1 &&
            this.currentStatus != 2 &&
            this.currentStatus != 201)
        ) {
          this.getCx(); //查询
        } else {
          console.log("你好1");
          this.getCx1(); //查询
        }
      }
    });
  },
  methods: {
    // 取消
    cancelForm() {
      this.dialog = false;
      this.$router.push({ name: "planProject" });
    },
    // 提交
    submitDrawer() {
      console.log("要提交的数据", this.form.data, this.tabList, this.userInfo);
      console.log("那个tab", this.activeName);
      // groupOpinions
      let params = []; //表格
      let opinionList = [];
      let obj = this.form.data; //表单
      let processInstanceId = this.$route.query.processId;
      // console.log("111", processInstanceId);
      this.tabList.map((item) => {
        console.log("tabList", item);
        if (item.id == this.activeName) {
          console.log("执行几次");
          item.tabData.map((item1, index) => {
            opinionList.push({
              opinionDescrition: item1.message, //描述
              opinionMessage: item1.value, //是否
              orderNum: index + 1,
              jfid: this.userInfo.jfid,
              // id: this.$route.query.id,
            });
          });
          params.push({ jfid: this.userInfo.jfid, opinionList: opinionList });
          console.log(params);
        }
      });
      console.log(".....", params, obj, processInstanceId);
      let flag = true;
      if (
        // 原
        // this.userInfo.currentRole.roleCode == "SPXZ_ZZ" &&
        this.userInfo.currentRole.roleCode == "PSZJ" &&
        (!obj.overallConclusion || !obj.overallOpinion)
      ) {
        let data = this.$refs["add"].validate();
        this.$message({
          type: "warning",
          message: `请填写"初审总体结论"和"初审总体意见"`,
        });
        flag = false;
      }
      if (flag) {
        console.log("yi");
        // 原  groupOpinions: params,
        // getTj({
        if (this.userInfo.currentBizunit.buProperty == 39) {
          // 协审人员
          params = {
            jfid: this.userInfo.jfid,
            opinionList: opinionList,
            processInstanceId: processInstanceId,
            version: this.version,
            hasSubmit: 1,
          };
          getTjyj(params).then((res) => {
            console.log("协审人员提交");
            if (res.msg.code == "0000") {
              this.dialog = false;
              this.$message({
                type: "success",
                message: "提交成功",
              });
              this.$router.push({ name: "planProject" });
            }
          });
        } else {
          // 专家
          params = {
            jfid: this.userInfo.jfid,
            // opinionList: opinionList,
            ...obj,
            processInstanceId: processInstanceId,
            version: this.version,
          };
          firstTrialByExpert(params).then((res) => {
            console.log("提交", res);
            if (res.msg.code == "0000") {
              this.dialog = false;
              this.$message({
                type: "success",
                message: "提交成功",
              });
              this.$router.push({ name: "planProject" });
            }
          });
        }
      }
      /* this.dialog = false;
      this.$router.push({ name: "planProject" }); */
    },
    // 保存
    saveDrawer() {
      console.log("要保存的数据", this.form.data, this.tabList, this.userInfo);
      console.log("那个tab", this.activeName);
      // groupOpinions
      let params = []; //表格
      let opinionList = [];
      let obj = this.form.data; //表单
      let processInstanceId = this.$route.query.processId;
      this.tabList.map((item) => {
        if (item.id == this.activeName) {
          item.tabData.map((item1, index) => {
            opinionList.push({
              opinionDescrition: item1.message, //描述
              opinionMessage: item1.value, //是否
              orderNum: index + 1,
              jfid: this.userInfo.jfid,
              // id: this.$route.query.id,
            });
          });
          params.push({ jfid: this.userInfo.jfid, opinionList: opinionList });
        }
      });
      let flag = true;
      if (
        // 原
        // this.userInfo.currentRole.roleCode == "SPXZ_ZZ" &&
        this.userInfo.currentRole.roleCode == "PSZJ" &&
        (!obj.overallConclusion || !obj.overallOpinion)
      ) {
        this.$message({
          type: "warning",
          message: `请填写"初审总体结论"和"初审总体意见"`,
        });
        flag = false;
      }
      if (flag) {
        // 原     groupOpinions: params,
        // getBc({
        if (this.userInfo.currentBizunit.buProperty == 39) {
          // 协审人员
          params = {
            jfid: this.userInfo.jfid,
            opinionList: opinionList,
            processInstanceId: processInstanceId,
            version: this.version,
            hasSubmit: 0,
          };
          getTjyj(params).then((res) => {
            console.log("协审人员提交");
            if (res.msg.code == "0000") {
              this.dialog = false;
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.$router.push({ name: "planProject" });
            }
          });
        } else {
          saveFirstTrialByExpert({
            jfid: this.userInfo.jfid,
            // opinionList: opinionList,
            ...obj,
            processInstanceId: processInstanceId,
            version: this.version,
          }).then((res) => {
            console.log("保存", res);
            if (res.msg.code == "0000") {
              this.dialog = false;
              this.$message({
                type: "success",
                message: "保存成功",
              });
              this.$router.push({ name: "planProject" });
            }
          });
        }
      }
    },
    // 点击抽屉外部
    handleClose(done) {
      this.dialog = false;
      /* this.$confirm("确定要退出页面吗？")
        .then((_) => {
          this.dialog = false;
          console.log(this.dialog);
          // if (this.userInfo.currentBizunit.buProperty == 38) {
          //   this.$router.push({ name: "planProject" });
          // }
        })
        .catch((_) => {}); */
    },
    // 解析数据
    handleTableArr(data) {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        let category_info = data[i];
        let activityPointsDOS = category_info["activityPointsDOS"];
        console.log("activityPointsDOS", activityPointsDOS);
        let count = 0;
        for (let j = 0; j < activityPointsDOS.length; j++) {
          let activityTwo_info = activityPointsDOS[j];
          let activityTwo_activityPointsDOS =
            activityPointsDOS[j]["activityPointsDOS"];
          console.log(
            "activityTwo_activityPointsDOS",
            activityTwo_activityPointsDOS
          );
          for (let k = 0; k < activityTwo_activityPointsDOS.length; k++) {
            count++;
            let info = {
              // 确定每天数据的 合并行的数量
              span_num: k === 0 ? activityTwo_activityPointsDOS.length : 0,
              value: activityTwo_activityPointsDOS[k]["value"],
              message: activityTwo_activityPointsDOS[k]["message"],
              // activityName: activityTwo_info["activityName"],
              category: category_info["category"],
            };
            arr.push(info);
          }
        }
        // 第一列的合并数量, 赋值给每个大项的第一个单元格. 比如合格积分要合并 8 行.
        arr[arr.length - count]["count"] = count;
      }
      return arr;
    },
    // 表格合并的方法
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // 第一列
      if (columnIndex === 0) {
        if (row.count) {
          return [row.count, 1];
        } else {
          return [0, 0];
        }
      }
      // 第二列
      // if (columnIndex === 1) {
      //   if (row.span_num > 0) {
      //     return [row.span_num, 1];
      //   } else {
      //     return [0, 0];
      //   }
      // }
    },
    // 单选
    changeRadio(scope, row) {
      console.log("单选值", scope, row);
    },
    // 切换tab
    handleClick(tab, event) {
      console.log("是否提交状态", this.hasSubmit);
      console.log(tab, event);
      this.tabList.map((item) => {
        if (item.id == this.activeName) {
          console.log(item);
          if (item.hasSubmit == 1 || item.hasSubmit == 0) {
            if (item.hasSubmit == 1) {
              // 提交
              this.tj = false;
              this.bc = false;
              this.qx = false;
              this.isRadio = true;
              this.isEdit = false; //一个提交一个编辑时,会一直出现编辑问题
              // this.hasSubmit = item.hasSubmit;
            } else if (item.hasSubmit == 0 && item.jfid == this.userInfo.jfid) {
              // 保存可编辑
              this.tj = false;
              this.bc = false;
              this.qx = false;
              this.isEdit = true;
              this.isRadio = true;
              this.hasSubmit = item.hasSubmit;
              // if (this.userInfo.currentRole.roleCode == "SPXZ_ZZ") {
              //   this.$set(this.form.config[2], "display", "block");
              // }
            } else if (item.hasSubmit == 0 && item.jfid != this.userInfo.jfid) {
              // 保存不可编辑
              this.tj = false;
              this.bc = false;
              this.qx = false;
              this.isEdit = false;
              this.isRadio = true;
              // this.hasSubmit = item.hasSubmit;
            }
          } else {
            // 新增tab
            this.tj = true;
            this.bc = true;
            this.qx = true;
            this.isRadio = false;
            // this.hasSubmit = "";
          }
        }
      });
    },
    // 总体结论
    getConclusionList() {
      /* topic = "";
       if (
        this.userInfo.currentBizunit.buProperty == 9 ||
        this.userInfo.currentBizunit.buProperty == 1
      ) {
        topic = "QDSH_CSZTJL";
      } else {
        topic = "JHXMK_FZSH_SHXZ_CSZTJL";
      } */
      let topic = "QDSH_CSZTJL";
      api_getServiceTypeList({ topic: topic }).then((res) => {
        console.log(res);
        // 处理项目标签枚举
        res.data.map((item) => {
          this.form.enums.conclusionList.push({
            dataName: String(item.chName),
            dataValue: String(item.itemCode),
          });
        });
      });
    },
    // 新增tab
    addTab() {
      let id = this.tabList.length + 1;
      this.tabList.push({
        id: id,
        tabData: JSON.parse(JSON.stringify(this.alldata)),
      });
      this.activeName = this.tabList.length; //处理新增到哪那个tab高亮
      this.isRadio = false; //处理对应高亮展示后的按钮与禁用
      this.tj = true; //处理对应高亮展示后的按钮与禁用
      this.bc = true; //处理对应高亮展示后的按钮与禁用
      this.qx = true; //处理对应高亮展示后的按钮与禁用
      this.isAdd = false;
      console.log(this.tabList);
    },
    // 编辑tab
    editTab() {
      // 编辑tab
      this.tj = true;
      this.bc = true;
      this.qx = true;
      this.isRadio = false;
    },
    // 查询 (旧)
    getCx() {
      let params = {
        projectId: this.$route.query.id,
        // version: null,
        version: this.version,
      };
      let arrSort = [];
      let result = [];
      // getCkxsyj(params).then((res) => {
      getOpinionByExpert(params).then((res) => {
        // getCx({ id: this.$route.query.id }).then((res) => {
        console.log("查询", res);
        if (res.data) {
          arrSort = res.data;
          res.data.map((currentItem, currentIndex) => {
            console.log("当前", currentItem);
            // 结论,意见
            // 只回显当前专家身份并且是本人的结论、意见、附件
            if (
              currentItem.jfid == this.userInfo.jfid &&
              this.userInfo.currentBizunit.buProperty == 9
            ) {
              this.form.data.overallConclusion = currentItem.overallConclusion;
              this.form.data.overallOpinion = currentItem.overallOpinion;
              this.form.data.preliminaryExaminationAnnex =
                currentItem.preliminaryExaminationAnnex;
            }
            if (currentItem.opinionList) {
              // for (let i = 0; i < currentItem.opinionList.length; i++) {
              this.tabList.push({
                // 原
                // id: i + 1,
                id: currentIndex + 1,
                tabData: JSON.parse(JSON.stringify(this.alldata)),
              });
              // }
              this.activeName = this.tabList[0].id;

              // 排序
              let groupOpinionsSort = currentItem.opinionList.sort((a, b) => {
                return a.order - b.order;
              });
              console.log("初始化this.tabList", this.tabList);
              console.log("初始化groupOpinionsSort", groupOpinionsSort);
              this.tabList.map((item1, index1) => {
                console.log("item1", item1, index1);
                groupOpinionsSort.map((item, index) => {
                  console.log("item", item, index);
                  if (index1 == currentIndex) {
                    item1.jfid = currentItem.jfid;
                    item1.hasSubmit = currentItem.hasSubmit;
                    item1.tabData.map((item1Child, index1Child) => {
                      if (index1Child == index) {
                        item1Child.value = Number(item.opinionMessage);
                      }
                    });
                  }
                  // 原代码
                  /*    if (index1 == index) {
                    item1.jfid = item.jfid;
                    item1.hasSubmit = item.hasSubmit;
                    item1.tabData.map((item1Child, index1Child) => {
                      item.opinionList.map((itemChild, indexChild) => {
                        if (index1Child == indexChild) {
                          item1Child.value = Number(itemChild.opinionMessage);
                        }
                      });
                    });
                  } */
                });
              });
              console.log("下标", this.tabList);
              this.tabList.map((item) => {
                console.log("-----", item);
                // 如果已存在本人填写或者费审核小组,不能新增
                if (
                  item.jfid == this.userInfo.jfid ||
                  // this.userInfo.currentBizunit.buProperty != 38
                  this.userInfo.currentBizunit.buProperty != 9
                ) {
                  console.log(".....");
                  this.isAdd = false;
                }
              });
              if (this.tabList[0].hasSubmit == 1) {
                // 提交
                this.tj = false;
                this.bc = false;
                this.qx = false;
                this.isRadio = true;
                // this.hasSubmit = this.tabList[0].hasSubmit;
              } else if (
                this.tabList[0].hasSubmit == 0 &&
                this.tabList[0].jfid == this.userInfo.jfid
              ) {
                // 保存可编辑
                this.tj = false;
                this.bc = false;
                this.qx = false;
                this.isEdit = true;
                this.isRadio = true;
                // this.hasSubmit = this.tabList[0].hasSubmit;
              } else if (
                this.tabList[0].hasSubmit == 0 &&
                this.tabList[0].jfid != this.userInfo.jfid
              ) {
                // 保存不可编辑
                this.tj = false;
                this.bc = false;
                this.qx = false;
                this.isEdit = false;
                this.isRadio = true;
                // this.hasSubmit = this.tabList[0].hasSubmit;
              }
              if (this.userInfo.currentBizunit.buProperty == 1) {
                this.isRadio = true;
                this.isAdd = false;
                this.isEdit = false;
                this.tj = false;
                this.bc = false;
                this.qx = false;
              }
              if (this.userInfo.currentBizunit.buProperty == 9) {
                console.log("........");
                // 专家进入只有查看权限单选
                // this.tj = false;
                // this.bc = false;
                // this.qx = false;
                this.isRadio = true;
                this.isAdd = false;
                this.isEdit = false;
                if (this.tabList[0].hasSubmit == 0) {
                  this.tj = true;
                  this.bc = true;
                  this.qx = true;
                } else if (this.tabList[0].hasSubmit == 1) {
                  this.tj = false;
                  this.bc = false;
                  this.qx = false;
                }
              }
            } else {
              console.log("......");
              this.tabList.push({
                id: 1,
                tabData: JSON.parse(JSON.stringify(this.alldata)),
              });
              this.tabList.map((item) => {
                // 如果已存在本人填写或者费审核小组,不能新增
                // if (this.userInfo.currentBizunit.buProperty != 38) {
                if (this.userInfo.currentBizunit.buProperty != 9) {
                  // 经办人
                  this.isAdd = false;
                  this.tj = false;
                  this.bc = false;
                  this.qx = false;
                  this.isEdit = false;
                  this.isRadio = true;
                } else if (this.userInfo.currentBizunit.buProperty == 9) {
                  this.isRadio = true;
                  this.isAdd = false;
                }
              });
              this.activeName = this.tabList[0].id;
            }
          });

          // 发展规划处经办人回显总体意见、附件、结论按时间戳最新专家评论回显
          if (this.userInfo.currentRole.roleCode == "GHFZC_JBR") {
            result = arrSort.sort((a, b) => {
              return b.subTime - a.subTime;
            });
            if (result.length > 0) {
              this.form.data.overallConclusion = result[0].overallConclusion;
              this.form.data.overallOpinion = result[0].overallOpinion;
              this.form.data.preliminaryExaminationAnnex =
                result[0].preliminaryExaminationAnnex;
            }
            console.log("排序结果", result);
          }
        } else {
          console.log("......", "你好");
          this.tabList.push({
            id: 1,
            tabData: JSON.parse(JSON.stringify(this.alldata)),
          });
          this.tabList.map((item) => {
            // 如果已存在本人填写或者费审核小组,不能新增
            // if (this.userInfo.currentBizunit.buProperty != 38) {
            if (
              // 专家单选禁用,协审人员放开
              this.userInfo.currentBizunit.buProperty != 9 &&
              this.userInfo.currentBizunit.buProperty != 39
            ) {
              // 经办人
              this.isAdd = false;
              this.tj = false;
              this.bc = false;
              this.qx = false;
              this.isEdit = false;
              this.isRadio = true;
            }
          });
          this.activeName = this.tabList[0].id;
        }
        console.log(this.isAdd);
      });
    },
    // 新
    getCx1() {
      let params = {
        projectId: this.$route.query.id,
        // version: null,
        version: this.version,
      };
      let arrSort = [];
      let result = [];
      getCkxsyj(params).then((res) => {
        if (res.data) {
          this.tabList.push({
            // 原
            // id: i + 1,
            id: 1,
            tabData: JSON.parse(JSON.stringify(this.alldata)),
          });
          // }
          this.activeName = this.tabList[0].id;

          // 排序
          // let groupOpinionsSort = currentItem.opinionList.sort((a, b) => {
          //   return a.order - b.order;
          // });
          console.log("初始化this.tabList", this.tabList);
          console.log("opinionList", res.data.opinionList);
          this.tabList.map((item1, index1) => {
            console.log("item1", item1, index1);
            res.data.opinionList.map((item, index) => {
              console.log("item", item, index);
              if (index1 == 0) {
                // item1.jfid = currentItem.jfid;
                item1.hasSubmit = res.data.hasSubmit;
                item1.tabData.map((item1Child, index1Child) => {
                  if (index1Child == index) {
                    item1Child.value = Number(item.opinionMessage);
                  }
                });
              }
              // 原代码
              /*    if (index1 == index) {
                      item1.jfid = item.jfid;
                      item1.hasSubmit = item.hasSubmit;
                      item1.tabData.map((item1Child, index1Child) => {
                        item.opinionList.map((itemChild, indexChild) => {
                          if (index1Child == indexChild) {
                            item1Child.value = Number(itemChild.opinionMessage);
                          }
                        });
                      });
                    } */
            });
          });
          console.log("下标", this.tabList);
          this.tabList.map((item) => {
            console.log("-----", item);
            // 如果已存在本人填写或者费审核小组,不能新增
            if (
              item.jfid == this.userInfo.jfid ||
              // this.userInfo.currentBizunit.buProperty != 38
              this.userInfo.currentBizunit.buProperty != 9
            ) {
              console.log(".....");
              this.isAdd = false;
            }
          });
          if (this.userInfo.currentBizunit.buProperty == 9) {
            // 专家进入只有查看权限单选
            this.tj = false;
            this.bc = false;
            this.qx = false;
            this.isRadio = true;
            this.isAdd = false;
          }
          if (this.userInfo.currentBizunit.buProperty == 1) {
            // 专家进入只有查看权限单选
            this.tj = false;
            this.bc = false;
            this.qx = false;
            this.isRadio = true;
            this.isAdd = false;
          }
          if (this.tabList[0].hasSubmit == 1) {
            // 提交
            this.tj = false;
            this.bc = false;
            this.qx = false;
            this.isRadio = true;
            // this.hasSubmit = this.tabList[0].hasSubmit;
          } else if (this.tabList[0].hasSubmit == 0) {
            // && this.tabList[0].jfid == this.userInfo.jfid
            console.log("......", "可编辑吗");
            // 保存可编辑
            this.tj = false;
            this.bc = false;
            this.qx = false;
            this.isEdit = true;
            this.isRadio = true;
            // this.hasSubmit = this.tabList[0].hasSubmit;
          } else if (
            this.tabList[0].hasSubmit == 0 &&
            this.tabList[0].jfid != this.userInfo.jfid
          ) {
            // 保存不可编辑
            this.tj = false;
            this.bc = false;
            this.qx = false;
            this.isEdit = false;
            this.isRadio = true;
            // this.hasSubmit = this.tabList[0].hasSubmit;
          }
        } else {
          console.log("......", "你好");
          this.tabList.push({
            id: 1,
            tabData: JSON.parse(JSON.stringify(this.alldata)),
          });
          this.tabList.map((item) => {
            // 如果已存在本人填写或者费审核小组,不能新增
            // if (this.userInfo.currentBizunit.buProperty != 38) {
            if (
              // 专家单选禁用,协审人员放开
              this.userInfo.currentBizunit.buProperty != 9 &&
              this.userInfo.currentBizunit.buProperty != 39
            ) {
              // 经办人
              this.isAdd = false;
              this.tj = false;
              this.bc = false;
              this.qx = false;
              this.isEdit = false;
              this.isRadio = true;
            }
          });
          this.activeName = this.tabList[0].id;
        }
      });
    },
    // 查看
    toView(file) {
      this.baseUrl = "";
      let token = sessionStorage.getItem("token");
      window.open(`${this.baseUrl}/viewPdf?id=${file.id}`);
    },
    // 下载
    toDwon(file) {
      this.baseUrl = "";
      let token = sessionStorage.getItem("token");
      window.open(
        `${this.baseUrl}/jfzg/file/api/file/download?key=${file.id}&access_token=${token}`
      );
    },
    // 分组初审-统筹单位经办人-获取评审会意见和结论
    getFirstTrialOpinionList() {
      getFirstTrialOpinion({
        projectId: this.$route.query.id,
      }).then((res) => {
        if (res.data) {
          console.log("统筹函评", res.data);
          console.log("表单结构", this.form.config);
          // res.data.
          let arr = [];
          res.data.map((item) => {
            arr.push({
              overallConclusion: item.conclusion,
              overallOpinion: item.opinion,
              preliminaryExaminationAnnex: item.examinationAnnexes,
              expertName: item.expertName,
            });
          });
          this.moreformData = arr;
          console.log("this.moreformData", this.moreformData);
        }
      });
    },
    //
    formHandleClick() {
      console.log("点击");
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .xuanze {
  width: 170px !important;
}
::v-deep .el-textarea > textarea {
  min-height: 100px !important;
  max-height: 132px;
}
::v-deep .el-drawer {
  width: 45% !important;
  overflow-y: scroll;
  .el-drawer__header {
    margin-bottom: 15px;
  }
  .el-form-item {
    margin-bottom: 15px;
  }

  .el-tabs {
    margin-left: 20px;
  }
  .tabs2 {
    margin-bottom: 72px;
  }
  .demo-drawer__footer {
    text-align: center;
    padding: 20px;
    position: fixed;
    bottom: 0;
    width: 45%;
    background-color: #fff;
  }
}
.xian {
  width: 100%;
  border: 1px solid #ccc;
  margin: 10px auto;
}
.tableBtn {
  text-align: right;
  margin-bottom: 15px;
}
::v-deep .tabs2 .el-tabs__item.is-active {
  border-bottom: 2px solid #1890ff;
}
// 文本域
::v-deep .el-textarea .el-input__count {
  line-height: 20px;
  bottom: 0px;
}
// 附件
.fujianFix {
  display: flex;
  .fujiantitle {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666;
    padding: 0;
    width: 144px;
    text-align: right;
  }
  .fujianItem {
    color: #888;
    .fujianItemName {
      border-bottom: 1px solid #888;
      margin-right: 20px;
    }
    .fujianItemName:hover {
      color: #1890ff;
      cursor: pointer;
    }
    i:hover {
      color: #1890ff;
      cursor: pointer;
    }
  }
}
</style>
