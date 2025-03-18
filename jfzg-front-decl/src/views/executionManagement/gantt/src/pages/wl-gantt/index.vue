<template>
  <div class="wl-gantt" id="wl-gantt">
    <!-- 甘特图区 -->
    <el-table
      ref="wl-gantt"
      class="wl-gantt-table"
      v-loading="loading"
      :border="true"
      :fit="fit"
      :size="size"
      :load="loadTree"
      :lazy="lazy"
      :class="dateTypeClass"
      :data="tableData"
      :stripe="stripe"
      :max-height="maxH"
      :row-key="rowKey"
      :tree-props="selfProps"
      :expand-row-keys="expandRowKeys"
      :default-expand-all="defaultExpandAll"
      :header-cell-style="{
        color: '#000',
        fontSize: '14px',
        fontWeight: '700',
      }"
    >
      <el-empty v-if="empty" description="暂无数据"></el-empty>
      <el-table-column
        fixed
        type="index"
        width="50"
        label="序号"
      ></el-table-column>
      <template>
        <slot name="prv"></slot>
        <el-table-column
          fixed
          label="全部任务"
          width="200"
          class-name="name-col"
          :formatter="nameFormatter"
          :show-overflow-tooltip="name_show_tooltip"
        >
          <template slot-scope="scope">
            <span
              class="ellipsis"
              style="font-size: 15px; font-weight: 700; color: black"
              >{{ scope.row.stageName }}</span
            >

            <span class="ellipsis" style="color: black">{{
              scope.row.subTaskName
            }}</span>
          </template>
        </el-table-column>

        <!-- this.ganttStartTime != null && this.ganttEndTime != null -->

        <!-- <el-table-column v-if="!ganttOnly" fixed label="任务状态">
          <template slot-scope="scope">
            <div class="task-item">
              <div :class="['task-status', getTaskStatusClass(scope.row)]">
                {{
                  scope.row.stageName == null ? getTaskStatus(scope.row) : ""
                }}
              </div>
            </div>
          </template>
        </el-table-column> -->

        <el-table-column
          v-if="!ganttOnly"
          :width="
            ganttStartTime === null && ganttEndTime === null ? '120' : null
          "
          label="任务状态"
          fixed
        >
          <template slot-scope="scope">
            <div class="task-item">
              <div :class="['task-status', getTaskStatusClass(scope.row)]">
                {{
                  scope.row.stageName == null ? getTaskStatus(scope.row) : ""
                }}
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
      <!-- year and week gantt -->
      <template v-if="self_date_type === 'yearAndWeek'">
        <el-table-column
          :resizable="false"
          v-for="i in ganttTitleDate"
          :label="i.full_date ? i.full_date : i.date"
          :key="i.id"
        >
          <el-table-column
            class-name="wl-gantt-item"
            v-for="t in i.children"
            :resizable="false"
            :key="t.id"
            :label="t.name"
          >
            <template slot-scope="scope">
              <div v-if="!t.children">
                <div
                  :class="
                    dayGanttType(scope.row, t.full_date, t.full_dates, 'week')
                  "
                  class="wl-item1 cell-content"
                  @mouseover="showInfo(scope.row, $event)"
                  @mouseout="hideInfo"
                ></div>
                <div
                  v-if="useRealTime"
                  :class="
                    realDayGanttType(
                      scope.row,
                      t.full_date,
                      t.full_dates,
                      'week'
                    )
                  "
                  class="cell-content"
                  @mouseover="showInfo(scope.row, $event, 'practical')"
                  @mouseout="hideInfo"
                ></div>
              </div>

              <div v-else v-for="z in t.children" :key="z.id" :label="z.name">
                <div
                  :class="
                    dayGanttType(scope.row, z.full_date, z.full_dates, 'week')
                  "
                  class="wl-item1 cell-content"
                  @mouseover="showInfo(scope.row, $event)"
                  @mouseout="hideInfo"
                ></div>
                <div
                  v-if="useRealTime"
                  :class="
                    realDayGanttType(
                      scope.row,
                      z.full_date,
                      z.full_dates,
                      'week'
                    )
                  "
                  class="cell-content"
                  @mouseover="showInfo(scope.row, $event, 'practical')"
                  @mouseout="hideInfo"
                ></div>
              </div>

              <!-- {{ scope.row.planStartTime }} -->
            </template>
          </el-table-column>
        </el-table-column>
      </template>

      <!-- mouth and day gantt -->
      <template v-else>
        <el-table-column
          :resizable="false"
          v-for="i in ganttTitleDate"
          :label="i.full_date"
          :key="i.id"
        >
          <el-table-column
            class-name="wl-gantt-item"
            v-for="t in i.children"
            :resizable="false"
            :key="t.id"
            :label="t.name"
          >
            <template slot-scope="scope">
              <div
                :class="dayGanttTypeDay(scope.row, t.full_date, t.full_dates)"
                class="wl-item1 cell-content"
                @mouseover="showInfo(scope.row, $event)"
                @mouseout="hideInfo"
              ></div>

              <div
                v-if="useRealTime"
                :class="realDayGanttTypeDay(scope.row, t.full_date)"
                class="cell-content"
                @mouseover="showInfo(scope.row, $event, 'practical')"
                @mouseout="hideInfo"
              ></div>
            </template>
          </el-table-column>
        </el-table-column>
      </template>
    </el-table>

    <!-- 用于显示信息的悬浮框 -->
    <div v-if="infoVisible" class="info-box" :style="infoBoxStyle">
      {{ infoContent }}
    </div>
  </div>
</template>

<script>
import { viewGantt } from "@/api/executionManagement";
import dayjs from "dayjs"; // 导入日期js
const uuidv4 = require("uuid/v4"); // 导入uuid生成插件
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
export default {
  name: "WlGantt",
  data() {
    return {
      infoVisible: false,
      infoContent: "",
      infoBoxStyle: {
        top: "0px",
        left: "0px",
      },
      tableData: [],
      tooltipContent: null,
      tooltipStyle: {
        top: "0px",
        left: "0px",
        display: "none",
      },
      self_start_date: "", // 项目开始时间
      self_end_date: "", // 项目结束时间
      self_date_type: "", // 自身日期类型
      self_id: 1, // 自增id
      name_show_tooltip: true, // 名称列是否开启超出隐藏
      GStartDates: null,
      GMon: null,
      GDay: null,
      maxH: null,
    };
  },
  props: {
    loading: Boolean,
    // 开始时间
    ganttStartTime: String || Number,
    ganttEndTime: String || Number,
    maxHeight: String || Number,
    empty: {
      type: Boolean,
    },
    // gantt数据
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // gantt数据
    arrayData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 日期类型
    dateType: {
      type: String,
      default: "yearAndWeek", // monthAndDay,yearAndMonth,yearAndWeek
    },
    // 树表配置项
    props: Object,
    // 开始日期
    startDate: {
      type: [String, Object],
      required: true,
    },
    // 结束时间
    endDate: {
      type: [String, Object],
      required: true,
    },
    // 是否使用实际开始时间、实际结束时间
    useRealTime: {
      type: Boolean,
      default: false,
    },
    // 是否检查源数据符合规则，默认开启，如果源数据已遵循project规则，可设置为false以提高性能
    checkSource: {
      type: Boolean,
      default: true,
    },
    // 自动变化gantt标题日期模式
    autoGanttDateType: {
      type: Boolean,
      default: true,
    },
    nameFormatter: Function, // 名称列的格式化内容函数
    preFormatter: Function, // 前置任务列的格式化内容函数
    ganttOnly: {
      type: Boolean,
      default: false,
    }, // 是否只显示图形
    // ---------------------------------------------以下为el-table Attributes--------------------------------------------
    defaultExpandAll: {
      type: Boolean,
      default: true,
    }, // 是否全部展开
    rowKey: {
      type: String,
      default: "id",
    }, // 必须指定key来渲染树形数据
    stripe: {
      type: Boolean,
      default: true,
    }, // 是否要高亮当前行
    fit: {
      type: Boolean,
      default: true,
    }, // 列的宽度是否自撑开
    expandRowKeys: Array, // 可以通过该属性设置 Table 目前的展开行
    lazy: {
      type: Boolean,
      default: true,
    }, // 是否懒加载子节点数据
    load: Function, // 加载子节点数据的函数，lazy 为 true 时生效
  },
  computed: {
    // 判断是否设置固定宽度
    getTaskStatusWidth() {
      if (this.ganttStartTime != null && this.ganttEndTime != null) {
        return {
          width: "auto", // 不设置固定宽度
        };
      } else {
        return {
          width: "100px", // 设置固定宽度，例如 100px
        };
      }
    },
    // 甘特图标题日期分配
    ganttTitleDate() {
      // 分解开始和结束日期
      let start_date_spilt = dayjs(this.self_start_date)
        .format("YYYY-M-D")
        .split("-");
      let end_date_spilt = dayjs(this.self_end_date)
        .format("YYYY-M-D")
        .split("-");

      let start_year = Number(start_date_spilt[0]);
      let start_mouth = Number(start_date_spilt[1]);
      let end_year = Number(end_date_spilt[0]);
      let end_mouth = Number(end_date_spilt[1]);
      // 自动更新日期类型以适应任务时间范围跨度
      if (this.autoGanttDateType) {
        let mouth_diff = this.timeDiffTime(
          this.self_start_date,
          this.self_end_date,
          "months"
        );
        if (mouth_diff > 12) {
          // 12个月以上的分到yearAndMouth
          this.setDataType("yearAndWeek");
        } else if (mouth_diff > 2) {
          // 2个月以上的分到yearAndWeek
          this.setDataType("yearAndWeek");
        } else {
          this.setDataType("monthAndDay");
        }
      }
      // 不自动更新日期类型，以dateType固定展示
      if (this.self_date_type === "yearAndWeek") {
        return this.yearAndWeekTitleDate(
          start_year,
          start_mouth,
          end_year,
          end_mouth
        );
      } else if (this.self_date_type === "monthAndDay") {
        return this.yearAndWeekTitleDate(
          start_year,
          start_mouth,
          end_year,
          end_mouth
        );
      } else {
        return this.yearAndWeekTitleDate(
          start_year,
          start_mouth,
          end_year,
          end_mouth
        );
      }
    },
    // 树表配置项
    selfProps() {
      return {
        hasChildren: "hasChildren", // 字段来指定哪些行是包含子节点
        children: "projectExecutionSubTaskVos", // children字段来表示有子节点
        name: "stageName", // 任务名称字段
        id: "id", // id字段
        pid: "pid", // pid字段
        startDate: "startDate", // 开始时间字段
        realStartDate: "realStartDate", // 实际开始时间字段
        endDate: "endDate", // 结束时间字段
        realEndDate: "realEndDate", // 实际结束时间字段
        identityId: "identityId",
        parents: "parents",
        pre: "pre", // 前置任务字段【注意：如果使用recordParents，则pre值应是目标对象的identityId字段(可配置)】
        ...this.props,
      };
    },
    dateTypeClass() {
      if (this.self_date_type === "yearAndMonth") {
        return "year-and-month";
      } else if (this.self_date_type === "monthAndDay") {
        return "month-and-day";
      } else if (this.self_date_type === "yearAndWeek") {
        return "year-and-week";
      }
      return "";
    },
    // 看板样式
    infoCardStyle() {
      return {
        left: this.infoCard.x + "px",
        top: this.infoCard.y + "px",
      };
    },
  },

  methods: {
    Gantt_tip() {
      this.$message({
        showClose: true,
        message:
          "此项目中的各阶段还未开始填写子任务计划开始/结束时间或实际开始/结束时间！",

        duration: 3000,
      });
    },
    // 获取任务状态类名
    showInfo(row, event, type) {
      // 显示悬浮框内容
      if (type == "practical") {
        if (row.actualEndTime != null) {
          this.infoContent = `实际开始时间: ${row.actualStartTime}, 实际结束时间: ${row.actualEndTime}`;
          this.infoVisible = true;
        } else {
          this.infoContent = `实际开始时间: ${row.actualStartTime}`;
          this.infoVisible = true;
        }
        this.infoVisible = true;
      } else {
        this.infoContent = `计划开始时间: ${row.planStartTime}, 计划结束时间: ${row.planEndTime}`;
        this.infoVisible = true;
      }

      // 获取鼠标位置
      const x = event.clientX;
      const y = event.clientY;

      // 在当前鼠标点击的上边显示，如果鼠标太靠近边框就在另一边显示
      if (x + 150 > window.innerWidth) {
        this.infoBoxStyle.left = `${x - 150}px`;
      }
      // 计算悬浮框位置
      this.infoBoxStyle = {
        top: `${y - 40}px`, // 在鼠标上方显示
        left: `${x}px`,
      };
      // 设置悬浮框位置
      // this.infoBoxStyle = {
      //   top: `${y - 40}px`, // 在鼠标上方显示
      //   left: `${x}px`,
      // };
    },
    hideInfo() {
      this.infoVisible = false;
    },
    getTaskStatus(task) {
      // 状态：已完成 状态描述：超前完成 绿色显示 实际结束时间不为空 实际结束时间小于计划结束时间
      // 状态：已完成 状态描述： 正常完成 绿色显示 实际结束时间不为空 实际结束时间等于小于计划结束时间
      // 状态：已完成 状态描述：超时完成 浅绿色 实际结束时间不为空 实际结束时间大于计划结束时间
      // 状态：进行中 状态描述：正常进行中 橙色显示 实际开始时间不为空且实际结束时间为空 当前系统时间小于等于计划结束时间
      // 状态：进行中 状态描述：超时进行中 红色显示 实际开始时间不为空且实际结束时间为空 当前系统时间大于计划结束时间
      // 状态：未开始 状态描述：正常未开始 灰色显示 实际开始时间为空 当前系统时间小于计划开始时间
      // 状态：未开始 状态描述：超时未开始 红色显示 实际开始时间为空 当前系统时间大于等于计划开始时间
      let status = "";
      let status_desc = "";
      let status_color = "";
      let now = dayjs();
      let plan_start_time = dayjs(task.planStartTime);
      let plan_end_time = dayjs(task.planEndTime);
      let actual_start_time = dayjs(task.actualStartTime);
      let actual_end_time = dayjs(task.actualEndTime);
      if (
        actual_end_time.isValid() &&
        actual_end_time.isBefore(plan_end_time)
      ) {
        status = "已完成";
        status_desc = "超前完成";
        status_color = "green";
      }
      if (actual_end_time.isValid() && actual_end_time.isSame(plan_end_time)) {
        status = "已完成";
        status_desc = "正常完成";
        status_color = "green";
      } else if (
        actual_end_time.isValid() &&
        actual_end_time.isAfter(plan_end_time)
      ) {
        status = "已完成";
        status_desc = "超时完成";
        status_color = "green";
      } else if (
        actual_start_time.isValid() &&
        !actual_end_time.isValid() &&
        now.isBefore(plan_end_time)
      ) {
        status = "进行中";
        status_desc = "正常进行中";
        status_color = "orange";
      } else if (
        actual_start_time.isValid() &&
        !actual_end_time.isValid() &&
        now.isAfter(plan_end_time)
      ) {
        status = "进行中";
        status_desc = "超时进行中";
        status_color = "red";
      } else if (
        !actual_start_time.isValid() &&
        now.isBefore(plan_start_time)
      ) {
        status = "未开始";
        status_desc = "正常未开始";
        status_color = "gray";
      } else if (!actual_start_time.isValid() && now.isAfter(plan_start_time)) {
        status = "未开始";
        status_desc = "超时未开始";
        status_color = "red";
      } else if (actual_start_time.isValid() && !actual_end_time.isValid()) {
        status = "进行中";
        status_desc = "正常进行中";
        status_color = "orange";
      } else if (actual_start_time.isValid() && !actual_end_time.isValid()) {
        status = "进行中";
        status_desc = "正常进行中";
        status_color = "orange";
      }
      return `${status} `;
    },

    getTaskStatusClass(task) {
      // 状态：已完成 状态描述：超前完成 绿色显示 实际结束时间不为空 实际结束时间小于计划结束时间
      // 状态：已完成 状态描述： 正常完成 绿色显示 实际结束时间不为空 实际结束时间等于小于计划结束时间
      // 状态：已完成 状态描述：超时完成 浅绿色 实际结束时间不为空 实际结束时间大于计划结束时间
      // 状态：进行中 状态描述：正常进行中 橙色显示 实际开始时间不为空且实际结束时间为空 当前系统时间小于等于计划结束时间
      // 状态：进行中 状态描述：超时进行中 红色显示 实际开始时间不为空且实际结束时间为空 当前系统时间大于计划结束时间
      // 状态：未开始 状态描述：正常未开始 灰色显示 实际开始时间为空 当前系统时间小于计划开始时间
      // 状态：未开始 状态描述：超时未开始 红色显示 实际开始时间为空 当前系统时间大于等于计划开始时间
      let status = "";
      let status_desc = "";
      let status_color = "";
      let now = dayjs();
      let plan_start_time = dayjs(task.planStartTime);
      let plan_end_time = dayjs(task.planEndTime);
      let actual_start_time = dayjs(task.actualStartTime);
      let actual_end_time = dayjs(task.actualEndTime);
      if (
        actual_end_time.isValid() &&
        actual_end_time.isBefore(plan_end_time)
      ) {
        status = "已完成";
        status_desc = "超前完成";
        status_color = "green";
      }
      if (actual_end_time.isValid() && actual_end_time.isSame(plan_end_time)) {
        status = "已完成";
        status_desc = "正常完成";
        status_color = "green";
      } else if (
        actual_end_time.isValid() &&
        actual_end_time.isAfter(plan_end_time)
      ) {
        status = "已完成";
        status_desc = "超时完成";
        // 浅绿
        status_color = "light-green";
      } else if (
        actual_start_time.isValid() &&
        !actual_end_time.isValid() &&
        now.isBefore(plan_end_time)
      ) {
        status = "进行中";
        status_desc = "正常进行中";
        status_color = "orange";
      } else if (
        actual_start_time.isValid() &&
        !actual_end_time.isValid() &&
        now.isAfter(plan_end_time)
      ) {
        status = "进行中";
        status_desc = "超时进行中";
        status_color = "red";
      } else if (
        !actual_start_time.isValid() &&
        now.isBefore(plan_start_time)
      ) {
        status = "未开始";
        status_desc = "正常未开始";
        status_color = "gray";
      } else if (!actual_start_time.isValid() && now.isAfter(plan_start_time)) {
        status = "未开始";
        status_desc = "超时未开始";
        status_color = "red";
      } else if (actual_start_time.isValid() && !actual_end_time.isValid()) {
        status = "进行中";
        status_desc = "正常进行中";
        status_color = "orange";
      } else if (actual_start_time.isValid() && !actual_end_time.isValid()) {
        status = "进行中";
        status_desc = "正常进行中";
        status_color = "orange";
      }
      return status_color;
    },
    planTime(row) {
      if (
        (row.planStartTime || row.actualStartTime) &&
        !row.actualEndTime &&
        !row.planEndTime
      ) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * 年-月模式gantt标题
     * start_year: 起始年
     * start_mouth：起始月
     * end_year：结束年
     * end_mouth：结束月
     */
    yearAndMouthTitleDate(start_year, start_mouth, end_year, end_mouth) {
      // 日期数据盒子
      let dates = [
        {
          name: `${start_year}年`,
          date: start_year,
          id: uuidv4(),
          children: [],
        },
      ];
      // 处理年份
      let year_diff = end_year - start_year;
      // 年间隔小于一年
      if (year_diff === 0) {
        let isLeap = this.isLeap(start_year); // 是否闰年
        let mouths = this.generationMonths(
          start_year,
          start_mouth,
          end_mouth + 1,
          isLeap,
          false
        ); // 处理月份
        dates[0].children = mouths;
        return dates;
      }
      // 处理开始月份
      let startIsLeap = this.isLeap(start_year);
      let start_mouths = this.generationMonths(
        start_year,
        start_mouth,
        13,
        startIsLeap,
        false
      );
      // 处理结束月份
      let endIsLeap = this.isLeap(end_year);
      let end_mouths = this.generationMonths(
        end_year,
        1,
        end_mouth + 1,
        endIsLeap,
        false
      );
      // 年间隔等于一年
      if (year_diff === 1) {
        dates[0].children = start_mouths;
        dates.push({
          name: `${end_year}年`,
          date: end_year,
          children: end_mouths,
          id: uuidv4(),
        });
        return dates;
      }
      // 年间隔大于1年
      if (year_diff > 1) {
        dates[0].children = start_mouths;
        for (let i = 1; i < year_diff; i++) {
          let item_year = start_year + i;
          let isLeap = this.isLeap(item_year);
          let month_and_day = this.generationMonths(
            item_year,
            1,
            13,
            isLeap,
            false
          );
          dates.push({
            name: `${item_year}年`,
            date: item_year,
            id: uuidv4(),
            children: month_and_day,
          });
        }
        dates.push({
          name: `${end_year}年`,
          date: end_year,
          children: end_mouths,
          id: uuidv4(),
        });
        return dates;
      }
    },

    mouthAndDayTitleDate(start_year, start_mouth, end_year, end_mouth) {
      // 处理年份
      let year_diff = end_year - start_year;

      // 只存在同年或前后年的情况
      if (year_diff === 0) {
        // 年间隔为同一年
        let isLeap = this.isLeap(start_year); // 是否闰年
        let mouths = this.generationMonths(
          start_year,
          start_mouth,
          end_mouth + 1,
          isLeap
        ); // 处理月份
        return mouths;
      }
      // 处理开始月份
      let startIsLeap = this.isLeap(start_year);
      let start_mouths = this.generationMonths(
        start_year,
        start_mouth,
        13,
        startIsLeap
      );
      // 处理结束月份
      let endIsLeap = this.isLeap(end_year);
      let end_mouths = this.generationMonths(
        end_year,
        1,
        end_mouth + 1,
        endIsLeap
      );
      return start_mouths.concat(end_mouths);
    },

    dayGanttTypeDay(row, date, dates, unit = "days") {
      // 先判断当前任务名称是否存在然后判断当前计划开始时间和计划结束时间是否存在
      if (row.subTaskName) {
        if (row.planStartTime && row.planEndTime) {
          let start_date = row.planStartTime ? row.planStartTime : "";
          let end_date = row.planEndTime ? row.planEndTime : "";
          const between = dayjs(date).isBetween(
            start_date,
            end_date,
            unit,
            "[]"
          );
          // let between = dayjs(date).isBetween(start_date, end_date, unit);
          if (between) {
            return "wl-item-on";
          }
          let start = dayjs(start_date).isSame(dates, unit);
          let end = dayjs(end_date).isSame(dates, unit);
          if (start && end) {
            return "wl-item-on wl-item-full wl-border";
          }
          if (start) {
            return "wl-item-on wl-item-start wl-border";
          }
          if (end) {
            return " wl-item-end wl-border";
          }
        }
      }
    },
    // 年-周模式gantt标题
    dayGanttType(row, date, dates, unit = "days") {
      // 先判断当前任务名称是否存在然后判断当前计划开始时间和计划结束时间是否存在返回展示到页面对应的日期上尽量时间对上
      if (row.subTaskName) {
        if (row.planStartTime && row.planEndTime) {
          let start_date = row.planStartTime ? row.planStartTime : "";
          let end_date = row.planEndTime ? row.planEndTime : "";
          const between = dayjs(date).isBetween(
            start_date,
            end_date,
            unit,
            "[]"
          );

          if (between) {
            return "wl-item-on";
          }
          let start = dayjs(start_date).isSame(dates, unit);
          let end = dayjs(end_date).isSame(dates, unit);
          if (start && end) {
            return "wl-item-on wl-item-full wl-border";
          }
          if (start) {
            return "wl-item-on wl-item-start wl-border";
          }
          if (end) {
            return "wl-item-on wl-item-end wl-border";
          }
        }
      }
    },

    realDayGanttTypeDay(row, date, dates, unit = "days") {
      // 如果实际开始时间为空，直接返回空字符串
      if (!row.actualStartTime && row.planStartTime == null) return "";

      // 提取日期范围
      const start_date = row.actualStartTime;
      const end_date = row.actualEndTime;
      const end_d = row.planEndTime;

      // 新增逻辑：有实际开始时间且无实际结束时间时，仅在开始日期显示绿色圆圈

      if (!end_date) {
        return dayjs(date).isSame(start_date, unit)
          ? "wl-real-start-green"
          : "";
      }

      // 检查是否在实际开始和结束日期之间
      const isBetween = dayjs(date).isBetween(start_date, end_date, unit, "[]");
      // 检查是否是实际开始日期或结束日期
      const isStart = dayjs(start_date).isSame(dates, unit);
      const isEnd = dayjs(end_date).isSame(dates, unit);

      // 实际结束时间超过计划结束时间的情况
      if (end_date > end_d) {
        if (isBetween) return "wl-real-on";
        if (isStart && isEnd) return "wl-real-on wl-real-full wl-border";
        if (isStart) return "wl-real-on wl-real-start wl-border";
        if (isEnd) return " wl-real-end wl-border";
      } else {
        // 实际结束日期未超过计划结束日期的情况
        if (isBetween) return "wl-real-on";
        // if (isStart && isEnd) return "wl-real-on wl-real-full wl-real-border";
        // if (isStart) return "wl-real-on wl-real-start wl-real-border";
        // if (isEnd) return "wl-real-on wl-real-end wl-real-border";
      }
      return "";
    },
    realDayGanttType(row, date, dates, unit = "days") {
      // 如果实际开始时间为空，直接返回空字符串
      if (!row.actualStartTime && row.planStartTime == null) return "";

      // 提取日期范围
      const start_date = row.actualStartTime;
      const end_date = row.actualEndTime;
      const end_d = row.planEndTime;

      // 新增逻辑：有实际开始时间且无实际结束时间时，仅在开始日期显示绿色圆圈

      if (!end_date) {
        return dayjs(date).isSame(start_date, unit)
          ? "wl-real-start-green"
          : "";
      }

      // 检查是否在实际开始和结束日期之间
      const isBetween = dayjs(date).isBetween(start_date, end_date, unit, "[]");
      // 检查是否是实际开始日期或结束日期
      const isStart = dayjs(start_date).isSame(dates, unit);
      const isEnd = dayjs(end_date).isSame(dates, unit);

      // 实际结束时间超过计划结束时间的情况
      if (end_date > end_d) {
        if (isBetween) return "wl-real-on-red";
        if (isStart && isEnd)
          return "wl-real-on-red wl-real-full-red wl-red-border";
        if (isStart) return "wl-real-on-red wl-real-start-red wl-red-border";
        if (isEnd) return "wl-real-on-red wl-real-end-red wl-red-border";
      } else {
        // 实际结束日期未超过计划结束日期的情况
        if (isBetween) return "wl-real-on";
        if (isStart && isEnd) return "wl-real-on wl-real-full wl-real-border";
        if (isStart) return "wl-real-on wl-real-start wl-real-border";
        if (isEnd) return "wl-real-on wl-real-end wl-real-border";
      }
      return "";
    },

    setDataType(type) {
      this.self_date_type = type;
    },
    /**
     * 年-月模式gantt标题
     * start_year: 起始年
     * start_mouth：起始月
     * end_year：结束年
     * end_mouth：结束月
     */

    yearAndWeekTitleDate(start_year, start_mouth, end_year, end_mouth) {
      // 处理年份
      let year_diff = end_year - start_year;

      let dates = [];

      // 如果月份跨度小于6个月，调整结束月份
      let monthSpan =
        end_year * 12 + end_mouth - (start_year * 12 + start_mouth);
      if (monthSpan < 6) {
        // 计算新的结束月份
        let newEndMonth = start_mouth + 6;
        end_mouth = newEndMonth % 12 || 12; // 如果是13个月，取1月
        end_year = start_year + Math.floor(newEndMonth / 12);
      }

      // 如果时间跨度大于一年
      if (year_diff > 1) {
        // 处理起始年
        let isLeapStart = this.isLeap(start_year);
        let startMonths = this.generationMonths(
          start_year,
          start_mouth,
          13,
          isLeapStart,
          true,
          true
        );
        dates.push(...startMonths);

        // 处理中间年
        for (let year = start_year + 1; year < end_year; year++) {
          let isLeapMiddle = this.isLeap(year);
          let middleMonths = this.generationMonths(
            year,
            1,
            13,
            isLeapMiddle,
            true,
            true
          );
          dates.push(...middleMonths);
        }

        // 处理结束年
        let isLeapEnd = this.isLeap(end_year);
        let endMonths = this.generationMonths(
          end_year,
          1,
          end_mouth + 1,
          isLeapEnd,
          true,
          true
        );
        dates.push(...endMonths);
      } else if (year_diff === 0) {
        // 如果时间跨度为同一年
        let isLeap = this.isLeap(start_year);
        let months = this.generationMonths(
          start_year,
          start_mouth,
          end_mouth + 1,
          isLeap,
          true,
          true
        );
        dates.push(...months);
      } else if (year_diff === 1) {
        // 如果时间跨度为前后年
        let isLeapStart = this.isLeap(start_year);
        let startMonths = this.generationMonths(
          start_year,
          start_mouth,
          13,
          isLeapStart,
          true,
          true
        );
        dates.push(...startMonths);

        let isLeapEnd = this.isLeap(end_year);
        let endMonths = this.generationMonths(
          end_year,
          1,
          end_mouth + 1,
          isLeapEnd,
          true,
          true
        );
        dates.push(...endMonths);
      } else {
        // 其他情况
        let isLeapStart = this.isLeap(start_year);
        let startMonths = this.generationMonths(
          start_year,
          start_mouth,
          13,
          isLeapStart,
          true,
          true
        );
        dates.push(...startMonths);

        let isLeapEnd = this.isLeap(end_year);
        let endMonths = this.generationMonths(
          end_year,
          1,
          end_mouth + 1,
          isLeapEnd,
          true,
          true
        );
        dates.push(...endMonths);
      }

      return dates;
    },
    /**
     * 生成月份函数
     * year: Number 当前年份
     * start_num: Number 开始月分
     * end_num：Number 结束月份
     * isLeap: Boolean 是否闰年
     * insert_days: Boolean 是否需要插入 日
     * week: 是否以周的间隔
     */
    generationMonths(
      year,
      start_num = 1,
      end_num = 13,
      isLeap = false,
      insert_days = true,
      week = false
    ) {
      let months = [];
      if (insert_days) {
        // 无需 日 的模式
        for (let i = start_num; i < end_num; i++) {
          // 需要 日 的模式
          let days = this.generationDays(year, i, isLeap, week);
          months.push({
            name: `${i}月`,
            date: i,
            full_date: `${year}年${i}月`,
            children: days,
            id: uuidv4(),
          });
        }
        return months;
      }
      for (let i = start_num; i < end_num; i++) {
        // 需要 日 的模式
        months.push({
          name: `${i}月`,
          date: i,
          full_date: `${year}年${i}月`,
          id: uuidv4(),
        });
      }
      return months;
    },
    /**
     * 生成日期函数
     * year: Number 当前年份
     * month: Number 当前月份
     * isLeap: Boolean 是否闰年
     * week: Boolean 是否间隔一周
     */
    async getTimes() {
      this.self_start_date = this.ganttStartTime;
      this.self_end_date = this.ganttEndTime;

      if (this.ganttStartTime != null && this.ganttEndTime != null) {
        this.GStartDates = this.ganttStartTime.split("-");
        this.GEndDates = this.ganttEndTime.split("-");
        this.GMon = Number(this.GStartDates[1]);
        this.GEndMon = Number(this.GEndDates[1]);
        this.GDay = Number(this.GStartDates[2]);
        this.GEndDay = Number(this.GEndDates[2]);
      }
    },

    generationDays(year, month, isLeap = false, week = false) {
      let big_month = [1, 3, 5, 7, 8, 10, 12].includes(month);
      let small_month = [4, 6, 9, 11].includes(month);
      let dates_num = big_month ? 32 : small_month ? 31 : isLeap ? 30 : 29;
      let days = [];
      // 周日 - 周六 0 - 6

      // ganttStartTime
      if (week) {
        // let gantt_startTime = this.timeInWeek(`${year}-${month}-1`);
        let gantt_startTime = this.timeInWeek(`${year}-${month}-1`);
        // gantt_startTime 如果为0则默认+1 如果本月有31日那么本月最后一个日子为31日
        // 如果本月有31日那么本月最后一个日子为31日
        if (gantt_startTime == 0) {
          gantt_startTime = 1;
        }
        let _day = this.GDay; // 从周日开始

        // let _day = 1; // 从1日开始
        for (let i = _day; i < dates_num; i += 0) {
          // 如果本月有31日那么本月最后一个日子为31日
          if (i == 31) {
            i = 31;
          }
          days.push({
            date: i,
            name: `${month}-${i}`,
            id: uuidv4(),
            full_date: `${year}-${month}-${i}`,
            full_dates: `${year}-${month}-${i++}`,
          });
        }
      } else {
        if (month == this.GMon) {
          for (let i = this.GDay; i < dates_num; i++) {
            // 如果本月有31日那么本月最后一个日子为31日
            if (i == 31) {
              i = 31;
            }
            days.push({
              date: i,
              name: `${month}月${i}日`,
              id: uuidv4(),
              full_date: `${year}-${month}-${i}`,
            });
          }
        } else if (month == this.GEndMon) {
          for (let i = 1; i <= this.GEndDay; i++) {
            // 如果本月有31日那么本月最后一个日子为31日
            if (i == 31) {
              i = 31;
            }
            days.push({
              date: i,
              name: `${month}月${i}日`,
              id: uuidv4(),
              full_date: `${year}-${month}-${i}`,
            });
          }
        } else {
          for (let i = 1; i < dates_num; i++) {
            // 如果本月有31日那么本月最后一个日子为31日
            if (i == 31) {
              i = 31;
            }
            days.push({
              date: i,
              name: `${month}月${i}日`,
              id: uuidv4(),
              full_date: `${year}-${month}-${i}`,
            });
          }
        }
      }
      return days;
    },
    /**
     * 是否闰年函数
     * year: Number 当前年份
     */
    isLeap(year) {
      return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    },
    /**
     * 计算时差
     * startDate：开始时间
     * endDate：结束时间
     * unit：单位 days、months、yesrs
     */
    timeDiffTime(startDate, endDate, unit = "days") {
      return dayjs(endDate).diff(startDate, unit);
    },
    /**
     * 查询时间是周几
     */
    timeInWeek(date) {
      return dayjs(date).day();
    },
    // ------------------------------------------- 以下为提供方法 ------------------------------------
    /**
     * 手动调用树表懒加载
     * row 要展开的行信息
     */
    loadTree(row) {
      this.$refs["tableRef"].store.loadOrToggle(row);
    },

    dolayout() {
      this.$nextTick(() => {
        this.$refs["wl-gantt"].doLayout();
      });
    },

    async getdata() {
      let params = {
        projectId: this.$route.query.projectId,
        contractId: this.$route.query.contractId,
        sectionCount: this.$route.query.sectionCount,
        sectionSort: this.$route.query.sectionSort,
        isSection: this.$route.query.isSection,
        pageNum: 1,
        pageSize: 9999,
      };
      let res = await viewGantt(params);
      if (res.data.length != 0) {
        this.tableData = res.data.records;
      }
    },
  },
  async created() {
    this.self_date_type = this.dateType;
    await this.getTimes();
    this.getdata();
  },
  mounted() {
    this.$nextTick(() => {
      this.dolayout();
      let node = document.querySelector("#wl-gantt");
      let node2 = document.querySelector(".el-table__header");
      let btn = document.querySelector(".btnANDtext");
      if (window.screen.height > 1050) {
        // if (node.offsetHeight && node2.offsetHeight) {
        // this.maxH = apps.offsetHeight - node2.offsetHeight - btn.offsetHeight - 20;
        this.maxH =
          window.innerHeight - node2.offsetHeight - btn.offsetHeight - 100;
        // }
      } else if (window.screen.height <= 1050) {
        if (node.offsetHeight && node2.offsetHeight) {
          //135是头部导航与tab的高度  window.innerHeight是视口高度
          this.maxH =
            window.innerHeight - node2.offsetHeight - btn.offsetHeight - 100;
        }
      }
    });
    if (this.ganttStartTime === null && this.ganttEndTime === null) {
      // 替换为你的实际条件
      this.Gantt_tip();
    }
  },
};
</script>

<style lang="scss" scoped>
.tag {
  color: #fff;
  width: 60px;
  height: 25px;
  border: none;
  text-align: center;
}
::v-deep.el-table td {
  border-left: none !important;
  border-right: none !important;
}

[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  padding: 2.5px;
  border-radius: 5px;
  background-color: gray;
  color: white;
}
::v-deep .el-table__fixed {
  bottom: 10px !important;
  width: 330px !important;
  z-index: 9999;
}
::v-deep .el-table__row--level-1 .el-table__expand-icon--expanded {
  display: none !important;
}
.text {
  text-align: center;
}
.el-icon-arrow-right {
  display: none;
}
::v-deep .el-table__empty-text {
  position: absolute;
  left: 30%;
}
::v-deep .el-loading-spinner {
  position: absolute;
  top: 73%;
}
[v-clock] {
  display: none;
}
.wl-gantt .wl-item-on {
  position: absolute;
  top: 50%;
  left: 0;
  right: -1px;
  margin-top: -15px;
  height: 10px;
  background: rgb(66, 130, 255);
  transition: all 0.4s;
}
.wl-border {
  position: relative; /* 确保父元素有相对定位 */
}
.wl-border::before {
  position: absolute;
  top: 0px;
  left: -2px;
  z-index: 1;
  content: "";
  width: 3px;
  height: 8px;
  background: rgb(66, 130, 255);
  border: 1px solid rgb(66, 130, 255);
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}
.wl-border::after {
  position: absolute;
  top: 0px;
  right: -2px;
  z-index: 1;
  content: "";
  width: 3px;
  height: 8px;
  background: rgb(66, 130, 255);
  border: 1px solid rgb(66, 130, 255);
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}
.wl-real-border {
  position: relative; /* 确保父元素有相对定位 */
}
.wl-real-border::before {
  position: absolute;
  top: 0px;
  left: -2px;
  z-index: 2;
  content: "";
  width: 3px;
  height: 8px;
  background: rgb(255, 141, 26);
  border: 1px solid rgb(255, 141, 26);
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}
.wl-real-border::after {
  position: absolute;
  top: 0px;
  right: -4px;
  z-index: 1;
  content: "";
  width: 3px;
  height: 8px;
  background: rgb(255, 141, 26);
  border: 1px solid rgb(255, 141, 26);
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}
.wl-red-border {
  position: relative; /* 确保父元素有相对定位 */
}
.wl-red-border::before {
  position: absolute;
  top: 0px;
  left: -4px;
  z-index: 5;
  content: "";
  width: 3px;
  height: 8px;
  background: rgb(255, 26, 26);
  border: 1px solid rgb(255, 26, 26);
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}
.wl-red-border::after {
  position: absolute;
  top: 0px;
  right: -3px;
  z-index: 1;
  content: "";
  width: 3px;
  height: 8px;
  background: rgb(255, 26, 26);
  border: 1px solid rgb(255, 26, 26);
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}
.wl-gantt .wl-item-full {
  left: 0;
  right: 0;
}

.wl-gantt .wl-item-start {
  left: 50%;
}

.wl-gantt .wl-real-on {
  position: absolute;
  top: 70%;
  left: 0;
  right: -1px;
  margin-top: -5px;
  height: 10px;
  background: rgb(255, 141, 26);
  transition: all 0.4s;
}
.wl-gantt .wl-real-full {
  left: 0;
  right: 0;
}

.wl-gantt .wl-real-start {
  left: 50%;
}

.wl-gantt .wl-real-end {
  right: 50%;
}

// 超出
.wl-gantt .wl-real-on-red {
  position: absolute;
  top: 70%;
  left: 0;
  right: -1px;
  margin-top: -5px;
  height: 10px;
  background: rgb(255, 26, 26);
  transition: all 0.4s;
}

.wl-gantt .wl-real-start-green {
  position: absolute;
  top: 70%;
  left: 0;
  background-color: rgb(255, 141, 26); /* 绿色背景 */
  border-radius: 50%; /* 圆形 */
  width: 10px; /* 宽度 */
  height: 10px; /* 高度 */
  display: inline-block; /* 使其可以设置宽高 */
}

.el-table ::-webkit-scrollbar {
  width: 6px;
  height: 10px;
  z-index: 999;
}
.el-table ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  border-radius: 8px;
  background-color: #838282;
  -webkit-box-shadow: inset 0 0 10px rgba(49, 49, 49, 0.2);
}
.el-table ::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(48, 47, 47, 0.2);
  border-radius: 8px;
  background-color: #e7e7e7;
  border: 1px solid #cacaca;
}
::v-deep .el-table td,
th.is-leaf {
  border-bottom: none !important;
}
::v-deep .el-table thead.is-group th {
  background: #e2e2e254 !important;
}
::v-deep .el-table .el-table__expand-icon {
  display: none;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: center;
  // margin-bottom: 20px;
  font-size: 12px;
}

.task-status {
  width: 70px;
  margin-right: 10px;
  padding: 0px 10px;
  color: white;
  font-weight: bold;
  font-size: 10px;
  border-radius: 10px;
  text-align: center;
}

.task-status.blue {
  background-color: blue;
}

.task-status.orange {
  background-color: orange;
}

.task-status.red {
  background-color: red;
}

.task-status.green {
  background-color: green;
}

// 浅绿
.task-status.light-green {
  background-color: #67c23a;
}

.task-status.gray {
  background-color: gray;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  position: relative;
}

::v-deep .tooltip {
  position: fixed;
  background: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 99999 !important;
}

.wl-item1:hover {
  cursor: pointer;
}

/* 绿色圆圈样式 */
.wl-real-start-green {
  position: relative;
  background-color: rgb(255, 141, 26);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  border: 2px solid rgb(255, 141, 26);
}

/* 可选：添加动画效果 */
.wl-real-start-green::after {
  // content: "";
  // position: absolute;
  // top: -4px;
  // left: -4px;
  // right: -4px;
  // bottom: -4px;
  // border-radius: 50%;
  // border: 2px solid  rgb(255, 141, 26);
  // animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.cell-content {
  position: relative;
  cursor: pointer;
}

.info-box {
  position: fixed;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 4px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
</style>
