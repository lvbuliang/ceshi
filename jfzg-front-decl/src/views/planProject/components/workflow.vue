<template>
  <div v-if="showWorkFlow" class="workflow">
    <div class="workflow_formAdd">
      <!--  -->
      <div
        v-if="
          (buttonList[0].showForm && $route.query.flog != 1) ||
          $route.query.flag == 0
        "
        class="workflow_formAdd_left"
      >
        <!-- v-if="buttonList[0].showForm" -->
        <!--  <SrAdd
          v-if="$route.query.flag != 0 && isAdd1Show"
          class="sradd"
          :config="auditJson.formAdd.config"
          :enums="auditJson.formAdd.enums"
          :form="auditJson.formAdd.data"
          :otherConfig="auditJson.formAdd.otherConfig"
          ref="add1"
        ></SrAdd> -->
        <SrAdd
          v-if="buttonList[0].showForm || $route.query.flag == 0"
          :config="form.config"
          :otherConfig="{ labelNum: 144 }"
          :form="form.data"
          :enums="form.enums"
          ref="add"
          class="add"
        >
          <div slot="inputBox">
            <el-popover
              placement="top"
              @hide="popover"
              :visible-arrow="false"
              popper-class="inputBoxPopper"
              :width="inputWidth"
              trigger="click"
            >
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入审核意见"
                autosize
                clearable
                show-word-limit
                maxlength="2000"
                :resize="'none'"
                v-model="form.data.auditOpinion"
              >
              </el-input>
              <el-input
                class="inputBox"
                v-model="form.data.auditOpinion"
                slot="reference"
                placeholder="请输入审核意见"
                maxlength="2000"
                @focus="inputclick2"
              >
              </el-input>
            </el-popover>
          </div>
          <div slot="inputBox2">
            <el-popover
              placement="top"
              @hide="popover"
              :visible-arrow="false"
              popper-class="inputBoxPopper disableTip"
              :width="inputWidth"
              trigger="click"
            >
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入意见"
                autosize
                clearable
                show-word-limit
                maxlength="2000"
                :resize="'none'"
                v-model="form.data.overallOpinion"
              >
              </el-input>
              <el-input
                class="input2"
                v-model="form.data.overallOpinion"
                slot="reference"
                placeholder="请输入意见"
                maxlength="2000"
                @focus="inputclick"
                :disabled="isDisabled"
              >
              </el-input>
            </el-popover>
          </div>
          <div slot="inputBox3">
            <el-input
              class="input2"
              v-model="form.data.overallOpinion"
              slot="reference"
              placeholder="请输入意见"
              maxlength="2000"
              @focus="inputclick3"
              :disabled="isDisabled"
              :readonly="true"
            >
            </el-input>
          </div>
        </SrAdd>
      </div>
      <el-popover
        placement="top"
        trigger="hover"
        width="320"
        v-model="visible"
        popper-class="workflow_popover"
        :offset="24"
      >
        <el-collapse v-model="activeName" accordion class="scroll">
          <el-collapse-item
            v-for="(item, index) in markData"
            :key="index"
            :name="index"
          >
            <template slot="title">
              <div class="el-collapse-item-list-box">
                <span class="markContentTime">{{ item.operatorTime }}</span>
                <sr-popover :content="item.operator">
                  <span class="markContentName">
                    <span>{{ item.operator }}</span>
                  </span>
                </sr-popover>

                <span
                  class="markContentOpinion"
                  :class="
                    item.color == 'FAIL'
                      ? 'fail'
                      : item.color == 'SUCCESS'
                      ? 'success'
                      : 'normal'
                  "
                  >{{ item.approvalResult }}</span
                >
              </div>
            </template>
          </el-collapse-item>
        </el-collapse>
        <div slot="reference" v-if="!hideTrackIcon" class="markBtton">
          <sr-trace-track :imgUrl="this.imgUrl" :trackData="trackData">
            <div class="markBttonIcon_box">
              <img
                v-if="buttonList[0].showForm"
                src="./xuanting.png"
                width="40%"
                height="auto"
                class="markBttonIcon"
                alt
              />
            </div>
          </sr-trace-track>
          <!-- <SrTraceTrack :imgUrl="this.imgUrl" :trackData="trackData">
            <div class="markBttonIcon_box">
              <img
                v-if="buttonList[0].showForm"
                src="./xuanting.png"
                width="40%"
                height="auto"
                class="markBttonIcon"
                alt
              />
            </div>
          </SrTraceTrack> -->
        </div>
      </el-popover>
    </div>
    <div class="workflow_buttons">
      <div class="automaticSave" v-if="typeof loading === 'boolean'">
        <div v-if="loading">
          <i
            class="el-icon-circle-check"
            style="margin-left: 4px; margin-right: 4px; color: #000000"
          ></i>
          {{ getToTime }}自动保存成功
        </div>
        <div v-else><i class="el-icon-loading"></i>自动保存中</div>
      </div>
      <div
        class="workflow_button btn"
        :key="index"
        v-for="(item, index) in buttonList[0].btns"
      >
        <el-dialog
          :visible.sync="dialogVisible"
          width="544px"
          :before-close="handleClose"
          :close-on-click-modal="false"
          append-to-body
          :showClose="false"
          class="bzhTableHeader"
        >
          <div class="content_box">
            <div class="content_title">选择函评专家 <span></span></div>
            <div class="content_left">
              <!-- <el-input
                class="search"
                placeholder="请输入内容"
                v-model="searchIndex"
                @change="searchChange"
                suffix-icon="el-icon-search"
              ></el-input> -->
              <el-input
                @change="searchData"
                placeholder="请输入专家名字"
                v-model="search"
              >
              </el-input>
              <!--  @click="deleteSelectData(item, index)" -->
              <i style="float: right" class="el-icon-search"></i>

              <div class="content_left_lists">
                <div class="content_left_title">所有可选</div>
                <div
                  class="content_left_list"
                  :key="item.jfid"
                  v-for="item in itemList"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    placement="bottom-start"
                    :disabled="!isShowTooltip"
                  >
                    <div slot="content">
                      <div v-for="item1 in expertSkillList" :key="item1.id">
                        {{ item1.label }}-{{ item1.chName }}
                      </div>
                    </div>
                    <span
                      class="content_left_name"
                      @mouseenter="visibilityChange($event, item)"
                      >{{ item.name }}</span
                    >
                  </el-tooltip>

                  <el-checkbox
                    @change="(e) => changechecbox(e, item)"
                    style="float: right"
                    v-model="item.isShow"
                    :disabled="item.disabled"
                  ></el-checkbox>
                </div>
                <div class="tixing" v-if="itemList.length == 0">
                  暂无可匹配专家
                </div>
              </div>
            </div>
            <div class="content_right">
              <div class="content_right_title">
                本次已选
                <span>已选{{ selectdata.length }}/{{ itemList.length }}</span>
              </div>

              <vuedraggable class="wrapper" v-model="selectdata">
                <transition-group>
                  <div
                    :key="item.jfid"
                    v-for="(item, index) in selectdata"
                    class="content_right_list"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      placement="bottom-start"
                      :disabled="!isShowTooltip"
                    >
                      <div slot="content">
                        <div v-for="item1 in expertSkillList" :key="item1.id">
                          {{ item1.label }}-{{ item1.chName }}
                        </div>
                      </div>
                      <span
                        class="content_right_name"
                        @mouseenter="visibilityChange($event, item)"
                        >{{ item.name }}</span
                      >
                    </el-tooltip>
                    <i
                      @click="deleteSelectData(item, index)"
                      style="float: right"
                      class="el-icon-close"
                      v-if="!item.disabled"
                    ></i>
                  </div>
                </transition-group>
              </vuedraggable>

              <div class="content_right_title1 allowTitle">
                已选择专家
                <span>已选{{ solicitedData.length }}</span>
              </div>
              <vuedraggable class="wrapper" v-model="solicitedData">
                <transition-group>
                  <div
                    :key="item.jfid"
                    v-for="(item, index) in solicitedData"
                    class="content_right_list"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      placement="bottom-start"
                      :disabled="!isShowTooltip"
                    >
                      <div slot="content">
                        <div v-for="item1 in expertSkillList" :key="item1.id">
                          {{ item1.label }}-{{ item1.chName }}
                        </div>
                      </div>
                      <span
                        class="content_right_name"
                        @mouseenter="visibilityChange($event, item)"
                        >{{ item.name }}</span
                      >
                    </el-tooltip>
                    <!-- <i
                      @click="deleteSelectData(item, index)"
                      style="float: right"
                      class="el-icon-close"
                      v-if="!item.disabled"
                    ></i> -->
                  </div>
                </transition-group>
              </vuedraggable>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <!-- @click="saveHeader" -->
            <el-button
              type="primary"
              v-debounce="[() => fpSumbit(), deTime || 1000]"
              >确 定</el-button
            >

            <el-button @click="handleClose">取 消</el-button>
          </span>
        </el-dialog>
        <!-- 征求意见 @click.stop="goback(item)" -->

        <el-button
          v-if="item.btnEventType == 'fp'"
          v-popover:popover5
          @click.stop="goback(item)"
          :type="item.btnType"
          >{{ item.btnName }}</el-button
        >
        <slot :name="item.slotName" :btn="item" v-else-if="item.slotName">
        </slot>
        <!-- 通过不通过 -->
        <el-button
          :disabled="item.disabled"
          v-else
          @click.stop="goback(item)"
          :type="item.btnType"
          >{{ item.btnName }}</el-button
        >
      </div>
      <div
        @click="gobackList(buttonList[0].backName)"
        v-if="backFlag"
        class="gobackList btn"
      >
        <el-button plain size="medium" round>返回列表</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import vuedraggable from "vuedraggable";
import {
  api_getServiceTypeList,
  getOptionalApprovalExpertsWhenJhxmByProjectId,
  getSelectedApprovalExpertsWhenJhxmByProjectId,
  expertSkillDetail,
  getAuditTeamOpinion,
  getExpertopioinCx,
  getFirstTrialOpinion,
  queryJointTrialExpertOpinion,
  getJointTrialOpinion,
  getExpertCommentaryOpinion,
  queryExpertCommentaryOpinion,
} from "@/api/planProject";
export default {
  name: "SrQiankunWorkFlow",
  components: { vuedraggable },

  inject: ["srtracetrackRequest", "workflowRequest"],
  props: {
    currentStatus: Number,
    currentKind: Number,
    validate: {
      type: Boolean,
      default() {
        return false;
      },
    },
    workFlowConfig: {
      type: Object,
      default() {
        return {};
      },
    },
    buttonList: {
      type: Array,
      default() {
        return [];
      },
    },
    params: {
      type: Object,
      default() {
        return {};
      },
    },
    extraParams: {
      type: Object,
      default() {
        return {};
      },
    },
    hideFrom: Boolean,
    clickMethods: Object,
    customEventMethods: Object,
    taskId: String || Number,
    backName: String,
    hideTrackIcon: Boolean,

    backFlag: {
      type: Boolean,
      default() {
        return true;
      },
    },
    //自动保存时根据这个判断
    workFlowLoading: {
      type: String | Boolean,
      default() {
        return "";
      },
    },
    //返回是否携带路由参数
    routerQuery: {
      type: Boolean,
      default() {
        return false;
      },
    },
    //工单设置处理参数
    WorkOrderDisposeFlag: {
      type: Boolean,
      default() {
        return false;
      },
    },
    //防抖延迟时间
    deTime: {
      type: [String, Number],
      default() {
        return 1000;
      },
    },
    // 缓存方案中，点击按钮后的回调方法
    callbackFn: {
      type: Function,
      default: null,
    },
    // 工作流审批
    auditJson: {
      type: Object,
      default() {
        return {};
      },
    },
    // build
    createBuid: {
      type: String,
      default() {
        return "";
      },
    },
    expertViewList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    "$route.path": {
      handler(newVal) {},
    },
    workFlowLoading: {
      handler(val) {
        this.loading = val;
      },
    },
    workFlowConfig: {
      handler(val) {
        if (val && Object.keys(val).length) {
          // this.setFromConfig(val);
        }
      },
      deep: true,
    },
    buttonList: {
      handler(val) {
        console.log(val);
        if (val.length) {
          if (val[0].showForm) {
            // this.getFormConfig();
          }
        }
      },
      deep: true,
    },
  },
  computed: {
    busiId() {
      return this.$route ? this.$route.query.id : "";
    },
    busiType() {
      return this.$route ? this.$route.meta.busiType : "";
    },
    projectId() {
      return this.$route ? this.$route.query.projectId : "";
    },
    processId() {
      return this.$route ? this.$route.query.processId : "";
    },
    userInfo() {
      return sessionStorage.getItem("userInfo");
    },
    getToTime() {
      let myDate = new Date();
      let str = myDate.toTimeString();
      let timeStr = str.substring(0, 8);
      return timeStr;
    },
  },
  data() {
    return {
      transformData: null,
      commonDisabled: false,
      isShowTooltip: false,
      dialogVisible: false,
      data: [],
      search: "",
      selectdata: [],
      allData: [], //搜索所有专家数据
      nowSelectData: [],
      inputWidth: 0,
      textarea: "",
      timer: "",
      searchIndex: "",
      activeName: 1,
      activeItem: {},
      activeItemIndex: false,
      beAssignerList: [],
      itemList: [], //可选专家
      solicitedData: [], //已征求专家
      expertSkillList: [], //专家技能列表
      lastChildIndex: false,
      trackData: [],
      markData: [],
      visible: false,
      showWorkFlow: true,
      imgUrl: "",
      total: "",
      currentPage: 1,
      checkedCities: [],
      // 处理
      checkedCities1: [],
      cities: ["上海", "北京", "广州", "深圳"],
      isIndeterminate: true,
      fpForm: {
        config: [
          {
            type: "select",
            name: "分配人",
            bind: "beAssigner",
            placeholder: "请选择分配人",
            trigger: "change",
            dataList: "beAssignerList",
            required: "请选择分配人",
            col: 24,
          },
        ],
        data: {
          beAssigner: "",
        },
        enums: {
          beAssignerList: [],
        },
      },
      lastChildItem: {},
      form: {
        config: [
          {
            type: "slot",
            slotName: "inputBox2",
            name: "初审意见",
            placeholder: "请输入意见",
            bind: "overallOpinion",
            append: true,
            maxlength: 2000,
            col: 8,
            trigger: "change",
            disabled: true,
          },
          {
            type: "select",
            className: "xuanze",
            slotName: "inputBox",
            name: "初审结论",
            placeholder: "请选择结论",
            bind: "overallConclusion",
            dataList: "conclusionList",
            append: true,
            disabled: false,
            maxlength: 500,
            col: 8,
          },
          {
            type: "upload",
            name: "附件",
            className: "fujian",
            bind: "preliminaryExaminationAnnex",
            fileList: [],
            fileTip: "仅支持pdf,word,ofd格式文件",
            fileType: "pdf,doc,docx,ofd",
            limit: 10,
            disabled: true,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 8,
          },
          // 前置审查意见
          {
            type: "slot",
            slotName: "inputBox3",
            name: "前置审查意见",
            placeholder: "请输入前置审查意见",
            bind: "auditOpinion",
            append: true,
            maxlength: 2000,
            col: 24,
          },
          // 征求意见
          {
            type: "slot",
            slotName: "inputBox",
            name: "审核意见",
            placeholder: "请输入意见",
            bind: "auditOpinion",
            append: true,
            maxlength: 2000,
            col: 8,
          },
          {
            type: "upload",
            name: "附件",
            bind: "accessoryList",
            fileList: [],
            fileTip: "仅支持pdf,word,ofd格式文件",
            fileType: "pdf,doc,docx,ofd",
            limit: 10,
            tipPopover: true, // hover显示提示  默认外面显示
            col: 16,
          },
        ],
        enums: {
          conclusionList: [],
        },
        data: {
          overallOpinion: "", //初审意见
          overallConclusion: "", //初审结论
          preliminaryExaminationAnnex: [], //初审附件
          jointReviewOpinion: "", //联合会审意见
          jointReviewConclusion: "", //联合会审结论
          jointReviewAnnex: [], //联合会审附件
          onSiteReviewOpinion: "", //现场评审意见
          onSiteReviewConclusion: "", //现场评审结论
          onSiteReviewAnnex: [], //现场评审附件
          reexamineOpinion: "", //复审意见
          reexamineConclusion: "", //复审结论
          reexamineAnnex: [], //复审附件
          opinion: "", //函评意见
          conclusion: "", //函评结论
          fileList: [], //函评附件
          auditUserName: "",
          auditOpinion: "", //审核意见
          auditTime: "",
          accessoryList: [], //附件
        },
      },
      loading: "",
      isAdd1Show: false,
      noSubmitFlag: false,
      isDisabled: false,
    };
  },
  mounted() {
    // 工作流审批意见与附件
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

    // 根据状态动态显示审批意见和附件
    ///开始
    console.log("当前状态", this.currentStatus);
    if (
      (userInfo.currentBizunit.buProperty == 1 ||
        userInfo.currentBizunit.buProperty == 39) &&
      (this.currentStatus == 3 ||
        this.currentStatus == 5 ||
        this.currentStatus == 6 ||
        this.currentStatus == 8 ||
        this.currentStatus == 10 ||
        this.currentStatus == 12)
    ) {
      this.$nextTick(() => {
        this.form.config[2].disabled = true;
        let advicefujian1 = document.querySelectorAll(
          ".fujian .uploaderDisabled"
        );
        console.log(advicefujian1);
        console.log(advicefujian1[0].style.pointerEvents);
        advicefujian1[0].style.pointerEvents = "none";
        advicefujian1[0].style.backgroundColor = "#efefef";
        advicefujian1[0].style.borderRadius = "50%";
        advicefujian1[0].style.borderColor = "#efefef";
      });
      this.form.config.splice(3, 1);
    }
    if (
      this.$route.query.type == 1 ||
      this.currentStatus == 3 ||
      this.currentStatus == 5
    ) {
      console.log("5zh", this.form.config);
      if (userInfo.currentBizunit.buProperty == 9) {
        // this.form.config = this.form.config.splice(0, 3);
        // this.showWorkFlow = false;
      }
      // else if (
      //   // 初审是经办人为查询到专家结论和意见手动填写意见和附件(不展示附件)
      //   userInfo.currentBizunit.buProperty == 1 &&
      //   this.expertViewList.length == 0
      // ) {
      //   this.form.config.splice(2, 1);
      //   // this.form.config = this.form.config.slice(2, 1);
      //   this.$set(this.form.config[1], "col", 12);
      // }
    } else if (this.$route.query.type == 2 || this.currentStatus == 6) {
      // 联合会审
      this.$set(this.form.config[0], "name", "会审意见");
      this.$set(this.form.config[1], "name", "会审结论");
      this.$set(this.form.config[0], "bind", "jointReviewOpinion");
      this.$set(this.form.config[1], "bind", "jointReviewConclusion");
      this.$set(this.form.config[2], "bind", "jointReviewAnnex");
      if (userInfo.currentBizunit.buProperty == 9) {
        this.form.config = this.form.config.splice(0, 3);
      }
      /* else if (userInfo.currentBizunit.buProperty == 1) {
    this.form.config.splice(3, 2);
      } */
      console.log("1");
    } else if (
      this.$route.query.type == 3 ||
      this.currentStatus == 8 ||
      this.currentStatus == 10
    ) {
      // 专家评审函评
      if (userInfo.currentBizunit.buProperty == 9) {
        // 专家
        this.$set(this.form.config[0], "name", "评审意见");
        this.$set(this.form.config[1], "name", "评审结论");
        this.$set(this.form.config[0], "bind", "opinion");
        this.$set(this.form.config[1], "bind", "conclusion");
        this.$set(this.form.config[2], "bind", "fileList");
        this.form.config = this.form.config.splice(0, 3);
      } else if (
        userInfo.currentBizunit.buProperty == 1 ||
        userInfo.currentBizunit.buProperty == 39
      ) {
        this.$set(this.form.config[0], "name", "评审意见");
        this.$set(this.form.config[1], "name", "评审结论");
        this.$set(this.form.config[0], "bind", "opinion");
        this.$set(this.form.config[1], "bind", "conclusion");
        this.$set(this.form.config[2], "bind", "fileList");
        // this.form.config.splice(3, 1);
      }
      /* else if (userInfo.currentBizunit.buProperty == 1) {
        // 统筹单位
        this.form.config = this.form.config.splice(3, 2);
      } */
      console.log("2");
    } else if (this.currentStatus == 11 || this.currentStatus == 13) {
      /*    else if (this.currentStatus == 11) {
      // 专家现场函评
      this.$set(this.form.config[0], "name", "现场评审意见");
      this.$set(this.form.config[1], "name", "现场评审结论");
      this.$set(this.form.config[0], "bind", "onSiteReviewOpinion");
      this.$set(this.form.config[1], "bind", "onSiteReviewConclusion");
      this.$set(this.form.config[2], "bind", "onSiteReviewAnnex");
      console.log("3");
    } */
      // 项目复审
      this.$set(this.form.config[0], "name", "复审意见");
      this.$set(this.form.config[1], "name", "复审结论");
      this.$set(this.form.config[0], "bind", "reexamineOpinion");
      this.$set(this.form.config[1], "bind", "reexamineConclusion");
      this.$set(this.form.config[2], "bind", "reexamineAnnex");
      this.form.config = this.form.config.splice(0, 3);
      console.log("4");
    } else if (
      // this.currentStatus == 2 ||
      // this.currentStatus == 201 ||
      // this.currentStatus == 8 ||
      this.currentStatus == 15 ||
      this.currentStatus > 1000
    ) {
      //专家函评-待函评   //项目入库-待批复通过
      this.form.config = this.form.config.splice(4, 2);
    } else if (
      this.currentStatus == 2 ||
      this.currentStatus == 201
      // this.currentStatus == 8 ||
      // this.currentStatus == 15 ||
      // this.currentStatus > 1000
    ) {
      if (userInfo.currentBizunit.buProperty == 1) {
        // 符合性前置初审
        this.form.config.splice(0, 3);
      } else if (userInfo.currentBizunit.buProperty == 39) {
        this.form.config.splice(0, 4);
      }
    }
    if (this.currentStatus == 15 || this.currentStatus > 1000) {
      this.$set(this.form.config[0], "name", "入库意见");
      // this.$set(this.form.config[0], "placeholder", "请输入入库意见");
      this.$set(this.form.config[1], "name", "方案编制要求及其他附件");
      this.form.config[1].className = "appointStyle";
      this.$nextTick(() => {
        let advicefujian = document.querySelector(
          ".appointStyle .el-form-item__label"
        );
        let advicefujian2 = document.querySelector(
          ".appointStyle .el-form-item__content"
        );
        console.log(this.$refs.add.$refs);
        advicefujian.style.width = "200px";
        advicefujian2.style.marginLeft = "200px";
        advicefujian2.style.width = "calc(100% - 224px)";
      });
      // this.$set(this.form.config[0], "bind", "reexamineOpinion");
      // this.$set(this.form.config[1], "bind", "reexamineConclusion");
      // this.$set(this.form.config[2], "bind", "reexamineAnnex");
    }
    // 暂注释
    // else if (
    //   this.$route.query.type == 1 ||
    //   this.currentStatus == 3 ||
    //   this.currentStatus == 5
    // ) {
    //   console.log("5", this.form.config);
    //   if (userInfo.currentBizunit.buProperty == 9) {
    //     this.form.config = this.form.config.splice(0, 3);
    //   } else if (userInfo.currentBizunit.buProperty == 1) {
    //     this.form.config = this.form.config.splice(3, 2);
    //   }

    //   // 项目分组初审
    //   if (userInfo.currentBizunit.buProperty == 1) {
    //     // 规划处经办人时,禁用附件
    //     // 原---现在此段注释
    //     /*  let advicefujian = document.querySelector(".fujian");
    //     advicefujian.style.display = "none";
    //     this.$set(this.form.config[1], "col", 12); */
    //     /* advicefujian.style.pointerEvents = "none";
    //     let advicefujian1 = document.querySelector(".fujian .uploaderDisabled");
    //     advicefujian1.style.backgroundColor = "#efefef";
    //     advicefujian1.style.borderRadius = "50%";
    //     advicefujian1.style.borderColor = "#efefef"; */
    //   }
    // }
    if (
      // userInfo.currentBizunit.buProperty !== 1 &&
      this.currentStatus == 5 ||
      this.currentStatus == 3
    ) {
      // 隐藏初审意见,结论
      this.form.config.splice(0, 3);
      // 没有专家意见和结论
      if (
        userInfo.currentBizunit.buProperty == 1 &&
        this.expertViewList.length == 0
      ) {
        return;
      }
      // type为的初审阶段下拉选择
      if (
        userInfo.currentBizunit.buProperty == 9 &&
        this.$route.query.type == 1
      ) {
        return;
      }
      console.log("zhuan");
      let selectInput = document.querySelector(
        ".xuanze .el-form-item__content .el-select"
      );
      let selectInput1 = document.querySelector(".el-select-dropdown");
      selectInput.addEventListener("click", (event) => {
        // 阻止下拉框出现
        selectInput1.style.display = "none";
        // 抽屉弹框
        this.$EventBus.$emit("drawerisshow", true);
        console.log("有专家意见");
      });
    }
    if (this.buttonList[0].showForm) {
      // this.getFormConfig();
    }
  },
  created() {
    console.log("接收到的专家列表", this.expertViewList);
    // 初始化单选按钮数据
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    console.log(this.auditJson.formAdd);
    this.form.data.auditUserName = JSON.parse(
      sessionStorage.getItem("userInfo")
    ).fullname;

    if (this.workFlowConfig && Object.keys(this.workFlowConfig).length) {
      // this.setFromConfig(this.workFlowConfig);
    }
    this.form.data.auditTime = this.getNowTime();
    if (this.buttonList[0].showForm) {
      this.getTraceTrackImage();
      this.getTraceTrack();
      this.getHoverTraceTrack();
      this.getBeAssignerList(); //征求专家列表
      this.getSolicitedExpert(); //已征求专家列表
      if (
        this.$route.query.type == 1 ||
        this.currentStatus == 3 ||
        this.currentStatus == 5
      ) {
        // this.getAuditTeamOpinion(); //查询小组意见,结论
        console.log("这里删除了接口getAuditTeamOpinion");
        if (
          userInfo.currentBizunit.buProperty == 1 ||
          userInfo.currentBizunit.buProperty == 39
        ) {
          // 统筹单位查看初审评审会信息
          // this.$nextTick(() => {
          this.getFirstTrialOpinionByExpert();
          // });
        }
      } else if (this.$route.query.type == 2 || this.currentStatus == 6) {
        // 专家保存查询
        // 身份为专家查看保存意见
        if (userInfo.currentBizunit.buProperty == 9) {
          this.$nextTick(() => {
            this.queryJointTrialExpertOpinionList();
          });
        } else if (
          userInfo.currentBizunit.buProperty == 1 ||
          userInfo.currentBizunit.buProperty == 39
        ) {
          // 统筹单位查看评审会信息
          this.$nextTick(() => {
            this.getJointTrialOpinionList();
          });
        }
      } else if (
        this.$route.query.type == 3 ||
        this.currentStatus == 8 ||
        this.currentStatus == 10
      ) {
        // this.getExpertopioinCx(); //查询专家
        if (userInfo.currentBizunit.buProperty == 9) {
          // 专家查看专家函评保存意见
          this.$nextTick(() => {
            this.queryExpertCommentaryOpinionList();
          });
        } else if (
          userInfo.currentBizunit.buProperty == 1 ||
          userInfo.currentBizunit.buProperty == 39
        ) {
          // 统筹单位查看专家函评评审会信息
          this.$nextTick(() => {
            this.getExpertCommentaryOpinionList();
          });
        }
      }
    }
    // this.getBeAssignerList();
    // 抽屉弹框
    // type1
    if (this.$route.query.drawerisshow && this.$route.query.type == 1) {
      this.$EventBus.$emit("drawerisshow", true);
    }
    this.getConclusionList();
  },
  beforeDestroy() {
    this.showWorkFlow = false;
  },
  destroyed() {
    this.$destroy();
    this.showWorkFlow = false;
  },
  methods: {
    // 是否显示提示
    visibilityChange(event, item) {
      console.log(event, item);
      const ev = event.target;
      const ev_weight = ev.scrollWidth; // 文本的实际宽度   scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。
      const content_weight = ev.clientWidth; // 文本的可视宽度 clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。
      // const content_weight = this.$refs.tlp.$el.parentNode.clientWidth; // 文本容器宽度(父节点)
      /* if (ev_weight > content_weight) {
        // 实际宽度 > 可视宽度  文字溢出
        this.isShowTooltip = true;
      } else {
        // 否则为不溢出
        this.isShowTooltip = false;
        
      } */
      this.getExpertSkill(item.id); //专家技能接口
      this.isShowTooltip = true;
    },

    // 征求意见
    // 取消
    handleClose() {
      //   this.selectdata = this.nowSelectData;
      // this.$emit("close");
      this.dialogVisible = false;
    },
    searchData(e) {
      console.log(e);
      this.itemList = this.allData.filter((item) => {
        return item.name.includes(e);
      });
    },
    changechecbox(e, item) {
      if (e == true) {
        item.index = this.selectdata.length;
        item.isShow = true;
        this.selectdata.push(item);
        console.log(this.selectdata);
      } else {
        this.changeData();
      }
    },
    deleteSelectData(item, index) {
      // console.log(item.index, index);
      // console.log(this.selectdata);
      this.selectdata.splice(index, 1);
      this.itemList.forEach((item1) => {
        console.log(item1);
        if (item.jfid == item1.jfid) {
          item1.isShow = false;
        }
      });
    },
    changeData(flag) {
      this.selectdata = this.itemList.filter((item) => item.isShow);
      if (flag) {
        this.selectdata.sort((a, b) => a.index - b.index);
      }
      this.nowSelectData = this.selectdata.map((item) => item);
    },
    inputclick(el) {
      console.log(".....");
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      // 抽屉弹框
      this.$nextTick(() => {
        this.inputWidth = +el.target.offsetWidth;
      });
      console.log(userInfo.currentBizunit.buProperty);
      if (
        this.expertViewList.length == 0 &&
        userInfo.currentBizunit.buProperty == 1
      ) {
        return;
      }
      console.log("zhunajia");
      if (this.currentStatus == 5 || this.currentStatus == 3) {
        // 去掉光标
        document.activeElement.blur();
        this.$EventBus.$emit("drawerisshow", true);
      }
    },
    inputclick2(el) {
      this.$nextTick(() => {
        this.inputWidth = +el.target.offsetWidth;
      });
    },
    inputclick3(el) {
      // 去掉光标
      document.activeElement.blur();
      this.$EventBus.$emit("drawerisshow", true, true);
    },
    popover(item) {
      // this.form.data.auditOpinion = this.textarea;
    },
    getFormConfig() {
      let list = [
        {
          type: "slot",
          slotName: "inputBox",
          name: "审核意见",
          placeholder: "请输入审核意见",
          bind: "auditOpinion",
          append: true,
          maxlength: 500,
          col: 8,
        },
        {
          type: "upload",
          name: "附件",
          bind: "accessoryList",
          fileList: [],
          limit: 10,
          tipPopover: true, // hover显示提示  默认外面显示
          col: 18,
        },
      ];

      let form =
        this.buttonList[0] && this.buttonList[0].showFormdata
          ? this.buttonList[0].showFormdata.formAdd
          : "";
      if (this.buttonList.length > 1) {
        let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        this.buttonList.forEach((item) => {
          if (item.role == userInfo.currentRole.roleCode) {
            form = this.buttonList[0].showFormdata.formAdd;
          }
        });
      }
      if (form) {
        this.$nextTick(() => {
          if (form && Object.keys(form.enums).length) {
            this.$set(this.form, "enums", form.enums);
          }
          if (form && Array.isArray(form.config)) {
            let list1 = [...form.config, ...list];
            this.$set(this.form, "config", list1);
          }
          this.$set(this.form, "data", form.data ? form.data : {});
        });
      }
    },
    //设置工作流表单配置
    setFromConfig(list) {
      let list1 = [
        {
          type: "slot",
          slotName: "inputBox",
          name: "审核意见",
          placeholder: "请输入审核意见",
          bind: "auditOpinion",
          append: true,
          maxlength: 500,
          col: 8,
        },
        {
          type: "upload",
          name: "附件",
          bind: "accessoryList",
          fileList: [],
          limit: 10,
          tipPopover: true, // hover显示提示  默认外面显示
          col: 18,
        },
      ];
      if (list && Object.keys(list.enums).length) {
        let obj = { ...list.enums, ...this.form.enums };
        this.$set(this.form, "enums", obj);
      }
      if (list && Array.isArray(list.config)) {
        let list1 = [...list.config, ...list1];
        this.$set(this.form, "config", list1);
      }
    },
    //阻止冒泡
    maskLayerContent() {},
    //分配二次确定取消
    maskLayerClose() {
      this.activeItemIndex = false;
      this.activeItem = {};
    },
    //搜索筛选
    searchChange(val) {
      console.log(val, typeof val);

      this.getBeAssignerList(val);
    },
    // 征求意见
    getBeAssignerList(val) {
      getOptionalApprovalExpertsWhenJhxmByProjectId({
        id: this.$route.query.id,
      }).then((res) => {
        this.itemList = res.data.records;
        this.allData = this.itemList;
      });
    },
    // 专家技能提示expertSkillDetail
    getExpertSkill(id) {
      expertSkillDetail({ id: id }).then((res) => {
        console.log(res.data.expertIndustryVoList);
        this.expertSkillList = [];
        if (res.data.expertIndustryVoList) {
          res.data.expertIndustryVoList.map((item) => {
            if (item.itemCode.slice(0, 1) == "1") {
              this.expertSkillList.push({
                id: item.id,
                label: "政策法规标准",
                chName: item.chName,
              });
            } else if (item.itemCode.slice(0, 1) == "2") {
              this.expertSkillList.push({
                id: item.id,
                label: "项目规划与评审",
                chName: item.chName,
              });
            } else if (item.itemCode.slice(0, 1) == "3") {
              this.expertSkillList.push({
                id: item.id,
                label: "政务信息化领域",
                chName: item.chName,
              });
            } else if (item.itemCode.slice(0, 1) == "4") {
              this.expertSkillList.push({
                id: item.id,
                label: "擅长ICT技术领域",
                chName: item.chName,
              });
            } else if (item.itemCode.slice(0, 1) == "5") {
              this.expertSkillList.push({
                id: item.id,
                label: "擅长应用领域",
                chName: item.chName,
              });
            }
          });
        }
        if (res.data.other) {
          this.expertSkillList.push({
            id: 1500,
            label: "其他",
            chName: res.data.other,
          });
        }
      });
    },
    // 已征求专家
    getSolicitedExpert() {
      getSelectedApprovalExpertsWhenJhxmByProjectId({
        id: this.$route.query.id,
      }).then((res) => {
        this.solicitedData = res.data.records;
      });
    },
    arrFilter(arr, val, key) {
      return arr.filter((item) => item[key] != val);
    },
    gobackList() {
      this.routeClose();
      if (
        this.routerQuery ||
        (Object.keys(this.params) && Object.keys(this.params).length > 0)
      ) {
        this.$router.push({ name: this.backName, query: { ...this.params } });
      } else {
        this.$router.push({ name: this.backName });
      }
    },

    routeClose(timeout, routepath) {
      console.log(timeout, routepath);
      let newroutepath = "";
      if (routepath) {
        newroutepath = routepath;
      } else {
        newroutepath = window.location.pathname.replace(/\//g, "");
      }
      this.$SrUtils.routeClose.call(
        this,
        newroutepath,
        this.$setState,
        timeout
      );
    },

    getNowTime() {
      var date = new Date();
      var seperator1 = "-";

      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var hour = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var strDate = date.getDate();

      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate =
        year +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        hour +
        ":" +
        minutes +
        ":" +
        seconds;

      return currentdate;
    },
    //分配取消
    fpClose() {
      this.lastChildIndex = false;
    },
    getParam() {
      let item = this.lastChildItem;
      let param = {
        vars: item.btnValue,
        processInstanceId: this.processId,
        taskId: this.taskId,
        status: item.examineState,
        btnName: item.btnName,
        auditOpinion: this.form.data.auditOpinion,
        accessoryList: this.form.data.accessoryList,
        // expertReviewDate:
      };
      if (item.nextBuCode) {
        param.nextBuCode = item.nextBuCode;
      }
      if (item.agencyId) {
        param.agencyId = item.agencyId;
      }
      if (item.agencyNextrole) {
        param.agencyNextrole = item.agencyNextrole;
      }
      if (item.nextBuCode) {
        param.nextBuCode = item.nextBuCode;
      }
      //消息模板id
      if (item.messageId) {
        param.messageId = item.messageId;
      }
      //代理人
      if (this.buttonList[0].assignee) {
        param.assignee = this.buttonList[0].assignee;
      }
      return param;
    },
    //征求意见确定
    fpSumbit() {
      let item = this.lastChildItem;
      console.log("item", item);
      let param = {};
      if (this.buttonList[0].showForm) {
        this.form.data.accessory = this.form.data.accessoryList
          ? this.form.data.accessoryList.map((item) => {
              return item.id;
            })
          : [];
        param = { ...this.form.data };
      }
      let obj = this.getParam();
      param = { ...param, ...obj };
      console.log("params", param);
      if (this.selectdata.length > 0) {
        this.workflowRequest.setApiAfferentUrlOfPost(
          item.btnUrl,
          {
            approvalExpertVos: this.selectdata,
            processInstanceId: param.processInstanceId,
            status: param.status,
            btnName: item.btnName,
          },
          (res) => {
            this.$message.success("操作成功");
            if (res) {
              if (this.callbackFn) {
                // 缓存方案中，走回调方法
                this.callbackFn();
                return;
              }
              if (
                this.routerQuery ||
                (Object.keys(this.params) &&
                  Object.keys(this.params).length > 0)
              ) {
                this.routeClose();
                this.$router.push({
                  name: this.backName,
                  query: { ...this.params },
                });
              } else {
                this.routeClose();
                this.$router.push({ name: this.backName });
              }
            }
          }
        );
      }
    },
    goback(item) {
      let now = !this.timer;
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.timer = null;
      }, this.deTime || 1000);
      console.log(item);

      if (now) {
        // this.gobackClick(item);
        let flag = true;
        // 需要校验的按钮功能保存在数组中
        let validateList = ["bh", "gjzjyjzg"];
        if (validateList.includes(item.btnEventType)) {
          // 意见和附件得提交一个
          console.log(
            "--------------",
            this.form.data.auditOpinion,
            this.form.data.accessoryList.length
          );
          let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

          console.log("flag", flag);
          // debugger;

          // 判断意见和附件
          if (
            !this.form.data.auditOpinion &&
            this.form.data.accessoryList.length == 0
          ) {
            console.log("+++++++");
            // debugger;
            if (
              this.currentStatus == 6 ||
              this.currentStatus == 13 ||
              this.currentStatus == 8 ||
              this.currentStatus == 10 ||
              this.currentStatus == 12
              // ||
              // this.currentStatus == 1001
            ) {
              this.$message.warning(
                `${this.form.config[3].name}和${this.form.config[4].name}需选填一个!`
              );
              flag = false;
            } else {
              // this.currentStatus == 11 ||
              if (
                this.currentStatus == 11 &&
                !this.form.data.overallOpinion &&
                this.form.data.reexamineConclusion.length == 0
              ) {
                this.$message.warning(
                  `${this.form.config[0].name}和${this.form.config[1].name}需选填一个!`
                );
                flag = false;
              } else if (this.currentStatus != 11) {
                console.log("....");
                this.$message.warning(
                  `${this.form.config[0].name}和${this.form.config[1].name}需选填一个!`
                );
                flag = false;
              }
            }
          } else if (
            item.btnEventType == "bh" &&
            item.btnName == "根据专家意见整改"
          ) {
            console.log("333", item);
            if (
              (this.currentStatus == 8 ||
                this.currentStatus == 10 ||
                this.currentStatus == 12) &&
              userInfo.currentBizunit.buProperty == 1 &&
              this.noSubmitFlag
            ) {
              this.$message.warning("专家出具意见中，请稍后审批!");
              flag = false;
            }
          }
          /* this.$refs["add"] &&
          this.$refs["add"].validate((val) => {
            !val && (flag = false);
          }); */
        } else if (
          item.btnEventType == "zjtj" &&
          item.btnName != "批复通过" &&
          item.btnName != "提交"
        ) {
          // 意见和附件得提交一个
          if (
            !this.form.data.auditOpinion &&
            this.form.data.accessoryList.length == 0
          ) {
            this.$message.warning(
              `${this.form.config[0].name}和${this.form.config[1].name}需选填一个!`
            );
            flag = false;
          }
        } else if (item.btnName == "提交") {
          this.form.data;
          console.log("jie", this.form.data);
          console.log(this.form.config);
          // debugger;
          /* if (!this.form.data.overallOpinion || !this.form.data.conclusion) {
            this.$message.warning(
              `请填写${this.form.config[0].name}和${this.form.config[1].name}!`
            );
            flag = false;
          } */
          /*   if (this.currentStatus == 6) {

            if (!this.form.data.overallOpinion || !this.form.data.) {
            this.$message.warning(
              `请填写${this.form.config[0].name}和${this.form.config[1].name}!`
            );
            flag = false;
          }
          } */
        } else if (this.currentStatus == 5 || this.currentStatus == 3) {
          // 处理分组初审时的退回修改与结束
          if (item.btnName == "结束" || item.btnName == "退回修改") {
            if (
              !this.form.data.auditOpinion &&
              this.form.data.accessoryList.length == 0
            ) {
              this.$message.warning(
                `请填写${this.form.config[0].name}和${this.form.config[1].name}!`
              );
              flag = false;
            }
          }
        }
        if (flag) {
          console.log("flag", flag);
          if (
            this.$route.query.flag != 0 &&
            item.btnName != "发起专家函评" &&
            item.btnName != "已专家函评" &&
            item.btnName != "出具初审意见" &&
            item.btnName != "出具意见" &&
            // item.btnName != "征求意见" &&
            item.btnName != "组织专家评审" &&
            item.btnName != "已组织评审" &&
            item.btnName != "分配" &&
            item.btnName != "征求意见" &&
            item.btnName != "查看初审意见及结论"
          ) {
            console.log("11111");
            this.$confirm(
              // 原代码
              `${
                item.btnName == "初审通过" ||
                item.btnName == "审核通过" ||
                item.btnName == "函评通过" ||
                item.btnName == "现场评审通过" ||
                item.btnName == "复审通过"
                  ? `确认通过后，项目将${item.btnName}。`
                  : item.btnName == "退回修改"
                  ? "退回修改后项目驳回至申报节点，申报单位可重新编辑后提交。"
                  : item.btnName == "批复通过" || item.btnName == "项目入库"
                  ? "确认操作后，所申报项目审批流流转至项目入库，不可撤回。"
                  : item.btnName == "结束" || item.btnName == "项目不予入库"
                  ? "确认结束后该项目流程结束，不入库，不可撤回。"
                  : item.btnName == "不通过"
                  ? "不通过后项目驳回至申报节点，申报单位可重新编辑后提交。"
                  : item.btnName == "根据专家意见整改"
                  ? "要求根据专家有意见整改后，申报单位可重新编辑后提交。"
                  : item.btnName == "提交"
                  ? "提交后，不可修改函评意见与函评结论。"
                  : item.btnName == "批复不通过"
                  ? "确认批复不通过后该项目申报流程结束"
                  : item.btnName == "撤回"
                  ? "撤回后可支持修改后重新提交。"
                  : item.btnName == "重新整改"
                  ? "确认后申报单位会收到评审意见。"
                  : item.btnName == "纳入联合会审" ||
                    item.btnName == "进入专家评审"
                  ? `确认${item.btnName}，会进入下一节点。`
                  : item.btnName == "保存"
                  ? "保存后，支持修改函评意见与函评结论后再提交。"
                  : ""
              }`,
              `确认${item.btnName}`,
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                // center: true,
              }
            )
              .then(() => {
                this.gobackClick(item);
                this.$message({
                  type: "success",
                  message: "操作成功!",
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消",
                });
              });
          } else if (
            item.btnName == "发起专家函评" ||
            item.btnName == "已专家函评" ||
            item.btnName == "分配" ||
            item.btnName == "征求意见"
          ) {
            console.log("11111");
            this.gobackClick(item);
          } else if (
            item.btnName == "出具初审意见" ||
            item.btnName == "出具意见" ||
            item.btnName == "查看初审意见及结论"
          ) {
            this.gobackClick(item);
          } else if (
            /*  else if (item.btnName == "征求意见") {
            this.gobackClick(item);
          } */
            item.btnName == "组织专家评审" ||
            item.btnName == "已组织评审"
          ) {
            this.gobackClick(item);
          } else {
            console.log("11111");
            this.gobackClick(item);
            this.$message.success("操作成功");
          }
        }
      }
    },
    gobackClick(item) {
      this.lastChildItem = item;
      if (this.clickMethods && this.clickMethods[item.btnEventType]) {
        console.log("执行这");
        this.clickMethods[item.btnEventType]();
      } else {
        console.log("还是这");
        if (item.btnEventType == "fp") {
          this.dialogVisible = true;
          return;
        } else if (item.btnEventType == "zqzjyj") {
          console.log("征求意见");
          this.$emit("openExpert", true);
          return;
        } else if (item.btnEventType == "fhxqzsczqyj") {
          console.log("分配");
          this.$emit("openPinionSolverd", true);
          return;
        } else if (item.btnEventType == "fhxqzscxscjyj") {
          console.log("出具意见");
          // 协审
          this.$EventBus.$emit("drawerisshow", true, true);
          return;
        } else if (item.btnEventType == "cjyj") {
          // 专家
          this.$EventBus.$emit("drawerisshow", true, false);
          return;
        } else if (item.btnEventType == "ckcsyjjjl") {
          // 审核经办人
          this.$EventBus.$emit("drawerisshow", true, true, true);
          return;
        } else if (
          this.customEventMethods &&
          this.customEventMethods[item.btnEventType]
        ) {
          this.customEventMethods[item.btnEventType]();
          return;
        }
        let param = {};
        if (this.buttonList[0].showForm) {
          this.form.data.accessory = this.form.data.accessoryList
            ? this.form.data.accessoryList.map((item) => {
                return item.id;
              })
            : [];
          param = { ...this.form.data };
          console.log("zhe", param);
        }
        let obj = this.getParam();
        param = { ...param, ...obj, ...this.extraParams };
        param.advice = param.auditOpinion; //意见
        console.log("此时", param);
        // debugger;
        if (
          this.$route.query.type == 1 ||
          this.currentStatus == 3 ||
          this.currentStatus == 5
        ) {
          param.opinion = param.overallOpinion; //初审意见
          param.examinationAnnexes = param.preliminaryExaminationAnnex; //初审附件
        } else if (this.$route.query.type == 2 || this.currentStatus == 6) {
          // param.jointReviewOpinion= param.overallOpinion
          param.opinion = param.overallOpinion; //联合会审意见
          param.examinationAnnexes = param.jointReviewAnnex; //联合会审附件
        } else if (
          this.$route.query.type == 3 ||
          this.currentStatus == 8 ||
          this.currentStatus == 10
        ) {
          param.opinion = param.overallOpinion; //专家函评意见
          param.examinationAnnexes = param.fileList;
        } else if (this.currentStatus == 11) {
          param.onSiteReviewOpinion = param.overallOpinion; //现场评审意见
        } else if (this.currentStatus == 13) {
          param.reexamineOpinion = param.overallOpinion; //复审意见
        }
        // 初审总体结论
        this.form.enums.conclusionList.map((item) => {
          console.log("param", param.jointReviewConclusion);
          console.log(item);
          // debugger;
          if (item.dataValue == param.conclusion) {
            param.conclusion = item.dataName; //初审、专家评审、联合会审    --专家评审
          } else if (item.dataValue == param.jointReviewConclusion) {
            console.log("wozai");
            param.conclusion = item.dataName; //联合会审
          } else if (item.dataValue == param.onSiteReviewConclusion) {
            param.onSiteReviewConclusion = item.dataName; //现场评审结论
          } else if (item.dataValue == param.reexamineConclusion) {
            param.reexamineConclusion = item.dataName; //复审结论
          } else if (item.dataValue == param.overallConclusion) {
            param.conclusion = item.dataName; //初审
          }
          // 原
          /*  if (item.dataValue == param.overallConclusion) {
            param.overallConclusion = item.dataName; //初审
          } else if (item.dataValue == param.jointReviewConclusion) {
            param.jointReviewConclusion = item.dataName; //联合会审
          } else if (item.dataValue == param.onSiteReviewConclusion) {
            param.onSiteReviewConclusion = item.dataName; //现场评审结论
          } else if (item.dataValue == param.reexamineConclusion) {
            param.reexamineConclusion = item.dataName; //复审结论
          } else if (item.dataValue == param.conclusion) {
            param.conclusion = item.dataName; //专家函评结论
          } */
        });
        param.appendix = JSON.stringify(param.accessoryList); //附件
        console.log("替换后的param", param);
        // debugger;
        param.buName = JSON.parse(this.userInfo).currentBizunit.buName; //部门名称
        param.buUniqueCode = JSON.parse(
          this.userInfo
        ).currentBizunit.buUniqueCode; //部门唯一编码
        param.buid = JSON.parse(this.userInfo).currentBizunit.buid; //部门id
        // param.flag = 0; //通过
        param.fullname = JSON.parse(this.userInfo).fullname; //账号名称
        param.jfid = JSON.parse(this.userInfo).jfid; //账号id
        param.projectId = this.$route.query.id; //项目id
        param.roleCode = JSON.parse(this.userInfo).currentRole.roleCode; //角色信息
        param.roleName = JSON.parse(this.userInfo).currentRole.roleName; //角色roleName
        console.log("745", param);
        console.log(param, "this", this.extraParams);
        console.log("2222", this.$route.query.type);
        // if (this.$route.query.type == 1) {
        param.version = this.$route.query.version;
        // }
        if (
          this.validate &&
          (item.btnEventType != "bh" || item.btnEventType == "tjps")
        ) {
          console.log(this.$refs);
          console.log("val2", val2);
          console.log(param.conclusion);
          // debugger;
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            param,
            (res) => {
              console.log(res);
              if (res) {
                if (this.callbackFn) {
                  // 缓存方案中，走回调方法
                  console.log("11111", "1");
                  this.callbackFn();
                  return;
                }
                if (
                  this.routerQuery ||
                  (Object.keys(this.params) &&
                    Object.keys(this.params).length > 0)
                ) {
                  this.routeClose();
                  console.log("11111", "2");

                  this.$router.push({
                    name: this.backName,
                    query: { ...this.params },
                  });
                } else {
                  this.routeClose();
                  console.log("11111", "3");

                  this.$router.push({ name: this.backName });
                }
              }
            }
          );
          //       }
          //     });
          //   }
          // });
        } else {
          console.log("zheshi", param);
          // debugger;
          this.workflowRequest.setApiAfferentUrlOfPost(
            item.btnUrl,
            param,
            (res) => {
              // 不通过按钮
              console.log(res);
              if (res) {
                if (this.callbackFn) {
                  // 缓存方案中，走回调方法
                  this.callbackFn();
                  console.log("11111", "4");
                  return;
                }
                if (
                  this.routerQuery ||
                  (Object.keys(this.params) &&
                    Object.keys(this.params).length > 0)
                ) {
                  this.routeClose();
                  this.$message.success("操作成功");
                  console.log("11111", "5");

                  this.$router.push({
                    name: this.backName,
                    query: { ...this.params },
                  });
                } else {
                  this.routeClose();
                  console.log("11111", "6");
                  this.$router.push({ name: this.backName });
                }
              }
            }
          );
        }
      }
    },
    //多选
    handleCheckedCitiesChange() {
      // this.checkedCities=[]
      console.log(this.checkedCities);
    },
    // 结论枚举
    getConclusionList(node) {
      console.log("当前节点", this.currentStatus);
      let params = {};
      if (this.currentStatus == 6) {
        // 联合会审
        params = { topic: "JHXMK_LHHS_LHHSJL" };
      } else if (this.currentStatus == 5 || this.currentStatus == 3) {
        // 分组初审
        // params = { topic: "JHXMK_FZSH_SHXZ_CSZTJL" };
        params = { topic: "QDSH_CSZTJL" };
      } else if (this.currentStatus == 10 || this.currentStatus == 8) {
        // 函评
        params = { topic: "JHXMK_ZJPS_ZJ_HPJL" };
      } else if (this.currentStatus == 11) {
        // 现场函评
        params = { topic: "JHXMK_ZJXCPS_XCPSJL" };
      } else if (this.currentStatus == 13) {
        // 现场函评
        params = { topic: "JHXMK_XMFS_FSJL" };
      }
      api_getServiceTypeList(params).then((res) => {
        console.log(res);
        // 处理项目标签枚举
        res.data.map((item) => {
          this.form.enums.conclusionList.push({
            dataName: String(item.chName),
            dataValue: String(item.itemCode),
          });
        });
        console.log(this.form.enums.conclusionList);
        //初审总体结论
        this.$set(
          this.form.enums,
          "conclusionList",
          this.form.enums.conclusionList
        );
      });
    },
    // 查询小组意见,结论
    /*   getAuditTeamOpinion() {
      getAuditTeamOpinion({ id: this.$route.query.id }).then((res) => {
        if (res.data) {
          this.form.data.overallOpinion = res.data.overallOpinion;
          this.form.data.overallConclusion = res.data.overallConclusion;
          this.form.data.preliminaryExaminationAnnex =
            res.data.preliminaryExaminationAnnex;
        }
      });
    }, */
    // 初审统筹单位意见和结论
    getFirstTrialOpinionByExpert() {
      // debugger;
      console.log("统筹单位初审查询");
      getFirstTrialOpinion({ projectId: this.$route.query.id }).then((res) => {
        console.log("sss--------", res);
        if (res.data) {
          /*  if (res.data.examinationAnnexes.length != 0) {
            this.form.config[2].disabled = true;
            this.$set(this.form.config[2], "disabled", false);
          } */
          // 是否组织评审
          if (res.data.hasOrginizeMeeting) {
            // 是否线上会议
            console.log("134", !res.data.onlineMeeting);
            if (!res.data.onlineMeeting) {
              // 是否提交意见
              if (res.data.opinion) {
                this.form.data.overallOpinion = res.data.opinion;
                this.form.data.overallConclusion = res.data.conclusion;
                /*   ? this.formatConclusion(res.data.conclusion)
                  : ""; */
                this.form.data.preliminaryExaminationAnnex =
                  res.data.examinationAnnexes;
              }
              /*   else {
                this.$message.warning("等待专家提交意见！");
              } */
            }
            /*   else {
              this.$message.warning("请输入专家意见和结论！");
            } */
          }
          /*   else {
            this.$message.warning("请先组织评审会议！");
          } */
        }
      });
    },
    formatConclusion(val) {
      let result = "";
      this.form.enums.conclusionList.map((item) => {
        if (item.dataName == val) {
          result = item.dataValue;
        }
      });
      return result;
    },
    // 查询专家意见
    queryJointTrialExpertOpinionList() {
      console.log("version", this.$route.query.version);
      queryJointTrialExpertOpinion({
        projectId: this.$route.query.id,
        version: this.$route.query.version,
      }).then((res) => {
        if (res.data) {
          console.log("专家", res.data);
          console.log("表单结构", this.form.config);
          this.form.data.overallOpinion = res.data.opinion;
          this.form.data.jointReviewConclusion = res.data.conclusion
            ? this.formatConclusion(res.data.conclusion)
            : "";
          console.log(this.form.enums.conclusionList);
          console.log("转换后", this.form.data.jointReviewConclusion);
          // this.form.data.jointReviewConclusion = res.data.conclusion;
          this.form.data.jointReviewAnnex = res.data.examinationAnnexes;
        }
      });
    },
    // 统筹单位查询联合会审意见和结论
    getJointTrialOpinionList() {
      // debugger;
      console.log("version", this.$route.query.version);
      getJointTrialOpinion({
        projectId: this.$route.query.id,
        version: this.$route.query.version,
      }).then((res) => {
        if (res.data) {
          console.log("统筹", res.data);
          console.log("表单结构", this.form.config);
          // 是否组织评审
          if (res.data.hasOrginizeMeeting) {
            console.log("134", !res.data.onlineMeeting);
            // 是否线上会议
            if (!res.data.onlineMeeting) {
              // 是否提交意见
              if (res.data.opinion) {
                this.form.data.overallOpinion = res.data.opinion;

                this.form.data.jointReviewConclusion = res.data.conclusion
                  ? this.formatConclusion(res.data.conclusion)
                  : "";
                this.form.data.jointReviewAnnex = res.data.examinationAnnexes;
              }
              /*   else {
                this.$message.warning("等待专家提交意见！");
              } */
            }
            /*  else {
              this.$message.warning("请输入专家意见！");
            } */
          }
          /* else {
            this.$message.warning("请先组织评审会议！");
          } */
        }
      });
    },
    // 查询专家意见,结论
    getExpertopioinCx() {
      getExpertopioinCx({ id: this.$route.query.id }).then((res) => {
        if (res.data) {
          this.form.data.overallOpinion = res.data.opinion;
          this.form.data.conclusion = res.data.conclusion
            ? this.formatConclusion(res.data.conclusion)
            : "";
          this.form.data.fileList = res.data.fileList;
        }
      });
    },
    // 专家函评-审批专家-查询已提交意见
    queryExpertCommentaryOpinionList() {
      queryExpertCommentaryOpinion({
        projectId: this.$route.query.id,
        version: this.$route.query.version,
      }).then((res) => {
        if (res.data) {
          console.log("专家函评", res.data);
          console.log("表单结构", this.form.config);
          this.form.data.overallOpinion = res.data.opinion;
          this.form.data.conclusion = res.data.conclusion
            ? this.formatConclusion(res.data.conclusion)
            : "";
          this.form.data.fileList = res.data.examinationAnnexes;
        }
      });
    },
    // 分组初审-统筹单位经办人-获取评审会意见和结论
    getExpertCommentaryOpinionList() {
      getExpertCommentaryOpinion({
        projectId: this.$route.query.id,
        version: this.$route.query.version,
      }).then((res) => {
        if (res.data) {
          console.log("统筹函评", res.data);
          console.log("表单结构", this.form.config);
          // 是否组织评审
          if (res.data.hasOrginizeMeeting) {
            console.log("134", !res.data.onlineMeeting);
            // 是否线上会议
            if (!res.data.onlineMeeting) {
              // 是否提交意见
              if (res.data.opinion) {
                this.form.data.overallOpinion = res.data.opinion;
                this.form.data.conclusion = res.data.conclusion
                  ? this.formatConclusion(res.data.conclusion)
                  : "";
                this.form.data.fileList = res.data.examinationAnnexes;
              } else {
                let advice = document.querySelector(".disableTip");
                let assf = document.querySelector(".input2");
                assf.addEventListener("click", (event) => {
                  // 阻止下拉框出现
                  advice.style.display = "none";
                });
                this.isDisabled = true;
                this.form.config[1].disabled = true;
                console.log("专家未填写意见");
                this.noSubmitFlag = true;
              }
              /* else {
                this.$message.warning("等待专家提交意见！");
              } */
            } /* else {
              this.$message.warning("请输入专家意见！");
            } */
          } else {
            // 未组织线上会议不允许经办人提交
            let advice = document.querySelector(".disableTip");
            let assf = document.querySelector(".input2");
            assf.addEventListener("click", (event) => {
              // 阻止下拉框出现
              advice.style.display = "none";
            });
            this.isDisabled = true;
            this.form.config[1].disabled = true;
          } /* else {
            this.$message.warning("请先组织评审会议！");
          } */
        }
      });
    },
    //留痕轨迹
    getTraceTrack() {
      if (!this.busiType || !this.busiId) return;
      this.srtracetrackRequest.getTraceTrackList(
        { busiId: this.busiId, busiType: this.busiType },
        (res) => {
          console.log("1154", res);
          this.trackData = res.data;
        }
      );
    },
    //留痕轨迹图片
    getTraceTrackImage() {
      if (!this.processId) return;
      this.srtracetrackRequest.getTraceTrackImage(
        { processId: this.processId },
        (res) => {
          console.log("1165", res);
          this.imgUrl = res.data;
        }
      );
    },
    //触摸留痕轨迹
    getHoverTraceTrack() {
      if (!this.busiType || !this.busiId) return;
      this.srtracetrackRequest.hoverTraceTrackList(
        {
          busiId: this.busiId,
          busiType: this.busiType,
          // projectId: this.projectId,
        },
        (res) => {
          console.log(res);
          this.markData = res.data;
          this.markData = res.data.map((item) => {
            if (item.operatorTime) {
              let str = item.operatorTime.split("-").splice(1, 2).join("-");
              item.operatorTime = str;
            }
            return item;
          });
        }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.contentBox {
  position: relative;
}

.workflow .SrQiankunWorkFlowPopover {
  height: 400px !important;
  background-color: #ccc;
}

.items {
  width: 100%;
  max-height: 278px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.items::-webkit-scrollbar {
  display: none;
}

.buts {
  padding-top: 10px;
  text-align: center;
}

.workflow .SrQiankunWorkFlowPopover .contentBox .item {
  width: 100%;
}

.el-pagination {
  position: absolute;
  bottom: 0;
  left: 10%;
}

.bzhTableHeader
  .el-dialog__body
  .content_box
  .content_left
  .content_left_lists
  .content_left_list {
  display: flex;
  width: 100%;
  // justify-content: space-between;
  padding-left: 20px;

  .content_left_name {
    width: 100%;
    line-height: 32px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ::v-deep .el-checkbox {
    width: 100%;
  }
}

.content_right_list {
  .content_right_name {
    display: inline-block;
    width: 200px;
    line-height: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

// ::v-deep .el-icon-search {
//   top: -7px;
// }
// ::v-deep .search .el-input__suffix-inner .el-input__icon .el-icon-search {
//   top: -1px !important;
//   color: black;
// }
.sradd {
  ::v-deep .el-form {
    padding-top: 0px !important;
  }
}

::v-deep .el-message-box__btns {
  text-align: right;
}

// 为了避免内容太高,设置滚动
.workflow_formAdd_left {
  padding-top: 20px;
  max-height: 200px;
  overflow: auto;
}

// 为了去除原本el-form的最高值184px
::v-deep .workflow_formAdd_left .sradd .el-form {
  max-height: 1000px;
}
// 留痕hover事件滚动条样式
.scroll {
  max-height: 540px;
  overflow-y: scroll;
}
.scroll::-webkit-scrollbar {
  width: 0px;
  height: 9px;
  background-color: #969696;
}
.scroll::-webkit-scrollbar-track {
  background: #e2e2e2;
  border-radius: 2px;
}
.scroll::-webkit-scrollbar-thumb {
  background: #969696;
  border-radius: 8px;
}
.scroll::-webkit-scrollbar-thumb:hover {
  background: #a5a5a5;
}
.scroll::-webkit-scrollbar-corner {
  background: #969696;
}
// 已选择专家样式
.wrapper {
  height: 175px !important;
}
.allowTitle {
  margin-top: 13px;
  span {
    float: right;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999;
    line-height: 20px;
    margin-right: 16px;
  }
}
.content_right_title1 {
  margin-bottom: 5px !important;
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  padding: 0 16px 16px;
  line-height: 22px;
}
.tixing {
  text-align: center;
}
</style>
<style>
/* 解决征求意见窗口抖动问题 */
html {
  overflow: hidden;
}
</style>
