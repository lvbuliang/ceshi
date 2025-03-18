<template>
  <div class="extract-page">
    <div>
      <el-row>
        <el-col :span="12">
          <span class="tree_extract_title"
            >专家列表({{ canhuizhuanjiaTable.data.length }})</span
          >
        </el-col>
        <el-col :span="12" style="line-height: 39px; text-align: right">
          <!--   <el-button
            type="primary"
            @click="setUpReviewGroup(1)"
            size="mini"
            round
            v-if="!canhuizhuanjiaTable.tableConfig.selectionConfig.display"
            >设置评审组</el-button
          > -->
          <!-- v-debounce="[() => setUpReviewGroup(1), config.deTime]" -->
          <!--   <el-button
            type="primary"
            @click="confirmClick(1)"
            size="mini"
            round
            v-if="canhuizhuanjiaTable.tableConfig.selectionConfig.display"
            >确定</el-button
          > -->
          <!-- v-debounce="[() => confirmClick(1), config.deTime]" -->
          <el-button
            type="primary"
            v-debounce="[() => exportAll(), config.deTime]"
            size="mini"
            round
            >导出专家</el-button
          >
          <el-button
            type="primary"
            v-debounce="[() => inviteAll(), config.deTime]"
            size="mini"
            round
            >邀请专家</el-button
          >
        </el-col>
      </el-row>
      <SrTable
        :data="canhuizhuanjiaTable.data"
        :config="canhuizhuanjiaTable.tableConfig"
        :page="canhuizhuanjiaTable.page"
        @select="selected"
        @selectAll="selectAll"
        ref="canhuizhuanjiaTableRef"
      >
        <template slot="cellSlot" slot-scope="scope">
          {{ scope.scope.row.statusName }}
        </template>
      </SrTable>
      <!--   <el-row>
        <el-col :span="12">
          <span class="tree_extract_title"
            >备选列表({{ beixuanzhuanjiaTable.data.length }})</span
          >
        </el-col>
        <el-col :span="12" style="line-height: 39px; text-align: right">
          <el-button
            type="primary"
            @click="setUpReviewGroup(0)"
            size="mini"
            round
            v-if="!beixuanzhuanjiaTable.tableConfig.selectionConfig.display"
            >设置评审组</el-button
          >
          <el-button
            type="primary"
            @click="confirmClick(0)"
            size="mini"
            round
            v-else
            >确定</el-button
          >
        </el-col></el-row
      > -->
      <span class="tree_extract_title"
        >备选列表({{ beixuanzhuanjiaTable.data.length }})</span
      >
      <SrTable
        :data="beixuanzhuanjiaTable.data"
        :config="beixuanzhuanjiaTable.tableConfig"
        :page="beixuanzhuanjiaTable.page"
      >
        <!-- @select="selected"
        @selectAll="selectAll"
        ref="beixuanzhuanjiaTableRef" -->
        <template slot="cellSlot" slot-scope="scope">
          {{ scope.scope.row.statusName }}
        </template></SrTable
      >
    </div>

    <!-- <el-dialog
      title="设置分组"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-radio-group v-model="selectedGroup">
        <template v-for="item in groupList">
          <el-radio :label="item.id" :key="item.id" class="radio-item">{{
            item.name
          }}</el-radio>
        </template>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addGroupConfim">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<!--
  功能：功能描述
  汪振涛
  时间：2021年07月13日 10:09:38
  版本：v1.0
-->
<script>
import {
  queryByReviewId,
  queryExtract,
  autoExtract,
  invite,
  getGroupList,
  saveOrUpdateGroupDetail,
} from "@/api/activityList";
import config from "@/settings.js";
export default {
  components: {},
  props: {},

  data() {
    return {
      config,
      loading: true,
      querenExtractNum: [],
      canhuizhuanjiaTable: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: true, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver

          tooltipEffect: "light",
          header: [
            {
              label: "姓名",
              prop: "expertName",
            },
            {
              label: "手机号",
              prop: "phone",
            },
            {
              label: "专家职称类型",
              prop: "professionalLevelName",
            },
            /* {
              label: "所属分组",
              prop: "groupName",
            }, */
            {
              label: "行业领域",
              prop: "hyName",
            },
            {
              label: "评审次数",
              prop: "reviewTimes",
              width: 80,
            },
            {
              label: "评审平均分",
              prop: "avgScore",
              width: 80,
            },
            {
              label: "劳务计算比例",
              prop: "feePercentage",
            },
            {
              label: "税后劳务费",
              prop: "fee",
            },
            {
              label: "邀请状态",
              prop: "statusName",
              cellSlot: true,
            },
          ],
          selectionConfig: {
            display: false,
            width: "40",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "156",
            fixed: "right",
            hideHeaderSetting: true,
            hideHeaderexport: true,
          },
          innerBtn: [
            {
              name: "发送邀请",
              method: "yaoqing",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
          ],
        },
      },
      beixuanzhuanjiaTable: {
        data: [], // 表格数据
        tableConfig: {
          rowClassName: this.rowClassName,
          title: "表格的标题", // 表格标题
          highlightCurrentRow: true, // 控制表格是否单选
          // maxLength: 20, // 一行最多显示多少字，超出显示popver
          tooltipEffect: "light",
          header: [
            {
              label: "姓名",
              prop: "expertName",
            },
            {
              label: "手机号",
              prop: "phone",
            },
            {
              label: "专家职称类型",
              prop: "professionalLevelName",
            },
            /*    {
              label: "所属分组",
              prop: "groupName",
            }, */
            {
              label: "行业领域",
              prop: "hyName",
            },
            {
              label: "评审次数",
              prop: "reviewTimes",
              width: 80,
            },
            {
              label: "评审平均分",
              prop: "avgScore",
              width: 80,
            },
            {
              label: "劳务计算比例",
              prop: "feePercentage",
            },
            {
              label: "税后劳务费",
              prop: "fee",
            },
            {
              label: "邀请状态",
              prop: "avgScore",
              cellSlot: true,
            },
          ],
          selectionConfig: {
            display: false,
            width: "40",
          },
          operateConfig: {
            display: true,
            label: "操作",
            width: "156",
            fixed: "right",
            hideHeaderSetting: true,
            hideHeaderexport: true,
          },
          innerBtn: [
            {
              name: "发送邀请",
              method: "yaoqing",
              type: "text",
              size: "medium",
              icon: "el-icon-document",
              className: "font-size-20",
              validate: this.btnValidate, //自定义判断是否展示按钮权限
            },
          ],
        },
      },
      // dialogVisible: false,
      // selectedGroup: "",
      // groupList: [], //分组列表
      // remarkConfirmVal: null, //确定标志
    };
  },
  methods: {
    /*    selectAll(val) {
      console.log("所选数据change", val);
      this.selectItemList = val;
    },
    selected(val) {
      this.selectItemList = val;
      console.log("所选数据", this.selectItemList);
    },
    // 分组确定按钮
    addGroupConfim() {
      console.log("分组", this.selectedGroup);
      if (!this.selectedGroup) {
        this.$message.warning("设置分组不能为空！");
        return;
      }
      console.log(this.selectItemList);
      let expertIdList = this.selectItemList.map((item) => {
        return item.expertId;
      });
      console.log("专家id", expertIdList);
      console.log("选中分组", this.selectedGroup);
      let result = this.groupList.find(
        (item2) => item2.id == this.selectedGroup
      );
      console.log("结果", result);
      let groupName = "";
      if (result) {
        groupName = result.name;
      }
      console.log("groupName", groupName);
      let params = [
        {
          expertIdList: expertIdList,
          groupDto: {
            // conferenceId: 0,
            id: this.selectedGroup,
            name: groupName,
            remark: "",
            reviewId: this.$route.query.id,
          },
        },
      ];
      saveOrUpdateGroupDetail(params).then((res) => {
        console.log("res", res);
        if (res.msg.code == "0000") {
          this.$message.success("操作成功");
          this.dialogVisible = false;
          console.log("refs", this.$refs);
          if (this.remarkConfirmVal) {
            this.canhuizhuanjiaTable.tableConfig.selectionConfig.display = false;
            // 移除勾选状态
            this.$refs.canhuizhuanjiaTableRef.$refs.SrTable.clearSelection();
          } else {
            this.beixuanzhuanjiaTable.tableConfig.selectionConfig.display = false;
            // 移除勾选状态
            this.$refs.beixuanzhuanjiaTableRef.$refs.SrTable.clearSelection();
          }
        }
      });
    },
    // 查询分组
    initGroupList() {
      let params = {
        conferenceId: this.$route.query.id,
      };
      getGroupList(params).then((res) => {
        console.log("分组列表", res);
        this.groupList = res.data;
      });
    }, */
    handleClose() {
      this.dialogVisible = false;
    },
    getQueryByReviewId() {
      queryByReviewId({ reviewId: this.$route.query.id }).then((res) => {
        console.log("+++++", res.data);
        if (res.msg.code === "0000") {
          if (res.data) {
            let one = [],
              two = [],
              tree = [];
            console.log("有什么", res.data[0], res.data[1], res.data[2]);
            console.log(res.data[1], "beixuanzhuanjiaTable");
            if (res.data[0] && res.data[0].length) {
              one = res.data[0];
              res.data[0].forEach((item) => {
                console.log("每项", item);
                item.feePercentage = item.feePercentage
                  ? item.feePercentage + "%"
                  : "-";
              });
              this.$set(this.beixuanzhuanjiaTable, "data", res.data[0]);
              // this.$set(this.canhuizhuanjiaTable, "data", res.data[0]);
            }
            if (res.data[1] && res.data[1].length) {
              two = res.data[1];
              res.data[1].forEach((item) => {
                console.log("每项", item);
                item.feePercentage = item.feePercentage
                  ? item.feePercentage + "%"
                  : "-";
              });
              this.$set(this.canhuizhuanjiaTable, "data", res.data[1]);
              // this.$set(this.beixuanzhuanjiaTable, "data", res.data[1]);
            }
            if (res.data[2] && res.data[2].length) {
              tree = res.data[2];
              res.data[2].forEach((item) => {
                console.log("每项", item);
                item.feePercentage = item.feePercentage
                  ? item.feePercentage + "%"
                  : "-";
              });
              this.$set(this.canhuizhuanjiaTable, "data", [...res.data[2]]);
            }
            //判断当前确认专家的数量是否大于抽取专家的数量
            // 如果不大于 那就disabled确认按钮

            let querenExtractNum = [...one, ...two, ...tree].filter(
              (rs) => rs.status == "4"
            );
            console.log(querenExtractNum);
            this.querenExtractNum = querenExtractNum;
            let flag =
              Number(this.$route.query.extractNum) === querenExtractNum.length
                ? false
                : true;
            this.$emit("disabled", flag);
            this.loading = false;
          }
        }
      });
    },
    btnValidate(row, item) {
      if (row.name == "发送邀请" && item.inviteFlag) {
        if (
          Number(this.$route.query.extractNum) <= this.querenExtractNum.length
        ) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    },
    queryInvite(jfids = []) {
      invite({ jfids: jfids, reviewId: this.$route.query.id }).then(
        ({ msg, data }) => {
          if (msg.code == "0000") {
            this.getQueryByReviewId();
            let querenExtractNum = [...one, ...two, ...tree].filter(
              (rs) => rs.status == "4"
            );

            let flag =
              Number(this.$route.query.extractNum) === querenExtractNum.length
                ? false
                : true;
            this.$emit("disabled", flag);
            this.loading = false;
          }
        }
      );
    },
    yaoqing(item, row) {
      console.log(item.expertId);
      console.log(row);
      console.log([item.expertId]);
      if (row === "发送邀请") {
        this.queryInvite([item.expertId]);
      }
    },
    //只邀请专家
    //状态：1.待邀请 2.待确认 3.拒绝参加 4.同意参加   不传默认查询全部
    inviteAll() {
      if (
        Number(this.$route.query.extractNum) <= this.querenExtractNum.length
      ) {
        this.$message({
          type: "warning",
          message: "邀请专家超过所需专家人数",
        });
      } else {
        let list = this.canhuizhuanjiaTable.data.filter(
          (res) => res.status == "1"
        );
        list = list.map((rs) => rs.expertId);
        this.queryInvite(list);
      }
    },
    exportAll() {
      window.open(
        `${
          config.baseUrl
        }/jfzg/projectImpl/api/expertAspiration/export?reviewId=${
          this.$route.query.id
        }&access_token=${sessionStorage.getItem("token")}`
      );
    },
    /*     // 设置评审小组
    setUpReviewGroup(val) {
      console.log("设置评审小组");
      if (val) {
        console.log("专家列表");
        this.canhuizhuanjiaTable.tableConfig.selectionConfig.display = true;
      } else {
        console.log("备选列表");
        this.beixuanzhuanjiaTable.tableConfig.selectionConfig.display = true;
      }
    },
    //确定
    confirmClick(val) {
      console.log("确定");
      this.remarkConfirmVal = val;
      this.dialogVisible = true;
    }, */
  },
  mounted() {
    this.getQueryByReviewId();
    // this.initGroupList();
  },
};
</script>

<style lang="scss">
.tree_extract_title {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  display: inline-block;
  margin: 8px 0;
}

.radio-item {
  display: block;
}
</style>
