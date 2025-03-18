<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="700px"
    :title="otherConfig.title"
    append-to-body
    class="common-dialog"
  >
    <div class="source table-dialog">
      <!-- <FSearch
        :showTitle="false"
        :form="search"
        @queryList="getList(1)"
        v-if="search.config.length > 0"
      ></FSearch>-->
      <SrTable
        ref="table"
        :config="table.config"
        :page="table.page"
        :data="table.data"
        :formatter="table.formatter"
        @selected="handleSelect"
        @pageChanged="getPageData"
        @sizeChanged="getSizeDate"
        @clickRow="rowClick"
      >
        <div
          class="dialog-search flex flex-row"
          :class="otherConfig.selectInfo ? 'flex-between' : 'flex-end'"
          slot="search"
        >
          <div class="selectInfo" v-if="otherConfig.selectInfo">
            {{ otherConfig.selectInfo.label }}：
            <span class="font-color1">
              {{ otherConfig.selectInfo.value }}
            </span>
          </div>
          <div class="search relative" v-if="searchCol.length > 0">
            <el-input
              :placeholder="searchConfig.label"
              suffix-icon="el-icon-search"
              size="small"
              v-model="searchConfig.value"
            ></el-input>
            <div
              class="search-btn cursor"
              @click="seachList(searchConfig.value)"
            ></div>
          </div>
        </div>
      </SrTable>
    </div>
    <div slot="footer" class="dialog-footer" v-if="otherConfig.showBottom">
      <el-button @click="dialogVisible = false" size="small">关 闭</el-button>
      <el-button
        type="primary"
        v-debounce="[() => submitSelect(), config.deTime]"
        size="small"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
// import FTable from "@/components/FTable";
import config from "@/settings.js";
export default {
  // components: {
  //   FTable
  // },
  props: {
    otherConfig: {
      type: Object,
      default() {
        return {
          // 其他配置项
          title: "请选择", // 弹框标题,
          getDataList: () => {}, // 接口
          multiple: true, // 是否多选
          noSelect: false, // 不显示选择框
          showBottom: true, // 显示底部确认按钮
          noPage: true, // 没有分页
          defaultParams: {
            // 默认参数
          },
          selectInfo: false,
        };
      },
    },
    tableCol: {
      type: Array,
      default() {
        return [];
      },
    },
    searchCol: {
      type: Array,
      default() {
        return [];
      },
    },
    buid: {
      type: Number,
    },
    idss: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      selectTime: 0,
      clearSelectFlag: false, // 单选状态，调用改变选中方法触发selected事件阻止该事件传递
      nowSelectList: [], //临时控制，每页刷新
      multipleSelection: [], //最终结果
      dialogVisible: false,
      searchConfig: {
        // 新搜索只有一个搜索选项
        label: "", // 提示信息
        prop: "", // 发给后台的参数
        value: "", // 发给后台的值
      },
      search: {
        // 预定废弃
        config: [],
        enum: {},
        form: {},
      },
      config,
      table: {
        config: {
          index: "序号",
          title: "",
          hideHeader: true,
          header: [
            { label: "姓名", prop: "fullname", width: "200" },
            { label: "手机号", prop: "mobile", cellSlot: true },
            { label: "登录时间", prop: "lastLoginTime" },
          ],
          noSelect: true,
          selection: true,
          noPage: false,
          noOption: true,
          multiple: true,
        },
        data: [],
        page: {
          pageNum: 1,
          pageSize: 5,
          total: 0,
        },
        selectArr: [],
      },
      authBtn: [],
      ids: [],
      tableData: [],
    };
  },
  created() {
    this.buid = this.$props.buid;
  },
  methods: {
    init(ids) {
      this.ids = ids;
      this.getList(1);
      this.dialogVisible = true;
    },
    /**
     * 转移控制权，将新的一页选中的数据从最终结果中去除，保证可以取消选中
     */
    getControlArr(selection) {
      let arr = this.multipleSelection;
      let arr1 = [];
      arr.map((res) => {
        if (this.isExist(selection, "id", res.id) == false) {
          arr1.push(res);
        }
      });
      this.multipleSelection = [...arr1];
    },
    /**
     * 判断是否存在
     */
    isExist(arr, key, value) {
      let flag = false;
      arr.map((res) => {
        if (res[key] == value) {
          flag = res;
        }
      });
      return flag;
    },
    /**
     * 当前页数据
     */
    handleSelect(selection) {
      let arr = [];
      if (!this.otherConfig.multiple) {
        // 单选
        this.nowSelectList = selection;
        this.getControlArr(selection); //获取控制权
        this.$emit("handleSelect", selection);
      } else {
        this.nowSelectList = [...selection];
        this.getControlArr(selection); //获取控制权
        arr = [...this.multipleSelection, ...this.nowSelectList];
        this.$emit("handleSelect", arr);
      }
    },
    submitSelect() {
      let arr = [...this.multipleSelection, ...this.nowSelectList];
      this.$emit("selectBc", arr);
      this.dialogVisible = false;
    },
    seachList(val) {
      let userList = [];
      if (val) {
        this.table.data.forEach((element) => {
          if (element.fullname && element.fullname.indexOf(val) != -1) {
            userList.push(element);
          }
        });
      } else {
        userList = this.tableData;
      }
      this.$set(this.table, "data", userList);
    },
    rowClick(val) {
      //单选某一行我改了
      if (this.otherConfig.multiple == false) {
        // this.multipleSelection=[val];
        this.$emit("selectBc", [val]);
        this.dialogVisible = false;
      }
      // this.multipleSelection = val;
    },
    /**
     * 组装表头和
     */
    contactConfig() {
      if (this.searchCol.length > 0) {
        this.searchConfig.label = this.searchCol[0].placeholder;
        this.searchConfig.prop = this.searchCol[0].bind;
        let select = {};
        let obj = {};
        this.searchCol.map((res) => {
          obj[res.bind] = "";
          if (res.type == "select") {
            select[res.bind] = res.dataList;
          }
        });
        // this.$set(this.table.config, "multiple", this.otherConfig.multiple);
        this.$set(this.table.config, "noSelect", this.otherConfig.noSelect);
        this.$set(this.table.config, "selection", !this.otherConfig.noSelect);
        this.$set(this.search, "form", obj);
        this.$set(this.search, "enum", select);
        this.$set(this.search, "config", this.searchCol);
      }
    },
    /**
     * 去重
     */
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1));
    },

    //对应相对操作
    // callFn(type, val) {
    //   console.log(type);
    //   if (type.method == "see") {
    //     //查看
    //     console.log("查看");
    //   } else if (type.method == "restart") {
    //     //重新执行
    //     console.log("重新执行");
    //   }
    // },
    // tbFormat(key, val, row) {
    //   if (key == "state") {
    //     if (row["state"] == "0") {
    //       return "未执行";
    //     } else if (row["state"] == "1") {
    //       return "执行中";
    //     } else if (row["state"] == "2") {
    //       return "执行失败";
    //     } else if (row["state"] == "3") {
    //       return "执行成功";
    //     } else {
    //       return "";
    //     }
    //   }
    // },
    selectID(rows) {
      //表格选中行
      var selectArr = [...this.table.selectArr, ...rows];
      this.$set(this.table, "selectArr", selectArr);
    },
    /**
     * 获取数据前判断是否有分页
     */
    getLists() {
      this.getList(1);
    },
    getList(page) {
      if (this.otherConfig.noPage) {
        this.getNoPageList();
      } else {
        this.getPageList(page);
      }
    },
    /**
     * 获取不带分页数据
     */
    getNoPageList() {
      let params = { buid: this.$props.buid };
      //liyufei mock
      var res = {
        msg: { code: "0000", reasonPhrase: "SUCCESS", message: "SUCCESS" },
        data: {
          buid: 54,
          buName: "华为软件",
          buCode: null,
          legal: null,
          realName: null,
          logoUrl: null,
          buProperty: 3,
          memberInfos: [
            {
              jfid: 23,
              userId: "liuzhenzong",
              nickname: "刘振宗",
              fullname: "刘振宗",
              email: "liuzhenzong@chinasofti.com",
              mobile: null,
              lastLoginTime: "2021-06-18",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 3,
                  roleCode: "CJDW_FZR",
                  roleName: "承建单位/负责人",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 24,
              userId: "miaoruigeng",
              nickname: "苗瑞庚",
              fullname: "苗瑞庚",
              email: "miaoruigeng@chinasofti.com",
              mobile: "1323427564",
              lastLoginTime: "2021-07-06",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 4,
                  roleCode: "CJDW_XMJL",
                  roleName: "承建单位/项目经理",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 25,
              userId: "chenzhipan",
              nickname: "程志攀",
              fullname: "程志攀",
              email: "chenzhipan@chinasofti.com",
              mobile: null,
              lastLoginTime: "2021-02-18",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 267,
              userId: "jf267",
              nickname: null,
              fullname: "徐图之",
              email: null,
              mobile: "13114362186",
              lastLoginTime: "2020-08-08",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 286,
              userId: "jf286",
              nickname: null,
              fullname: "李",
              email: null,
              mobile: null,
              lastLoginTime: "2020-07-20",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 287,
              userId: "jf287",
              nickname: null,
              fullname: "李",
              email: null,
              mobile: null,
              lastLoginTime: "2020-07-21",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 333,
              userId: "jf333",
              nickname: null,
              fullname: "徐",
              email: null,
              mobile: null,
              lastLoginTime: "2021-04-26",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 334,
              userId: "xuxiangyang123",
              nickname: null,
              fullname: "张三",
              email: null,
              mobile: "13234554567",
              lastLoginTime: "2021-03-30",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 4,
                  roleCode: "CJDW_XMJL",
                  roleName: "承建单位/项目经理",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 337,
              userId: "jf337",
              nickname: null,
              fullname: "祥龙",
              email: null,
              mobile: null,
              lastLoginTime: "2020-07-28",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 338,
              userId: "jf338",
              nickname: null,
              fullname: "周",
              email: null,
              mobile: "13357831900",
              lastLoginTime: "2020-08-08",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 346,
              userId: "jf346",
              nickname: null,
              fullname: null,
              email: null,
              mobile: "13999999999",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 347,
              userId: "jf347",
              nickname: null,
              fullname: null,
              email: null,
              mobile: "13899999999",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 356,
              userId: "jf356",
              nickname: null,
              fullname: null,
              email: null,
              mobile: "13412344321",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 357,
              userId: "jf357",
              nickname: null,
              fullname: null,
              email: null,
              mobile: "17356002709",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 358,
              userId: "jf358",
              nickname: null,
              fullname: null,
              email: null,
              mobile: "183629755-7",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 359,
              userId: "jf359",
              nickname: null,
              fullname: null,
              email: null,
              mobile: "18362975507",
              lastLoginTime: "2020-10-12",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 360,
              userId: "jf360",
              nickname: null,
              fullname: null,
              email: null,
              mobile: "18362975506",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 362,
              userId: "1223",
              nickname: null,
              fullname: "test1",
              email: "",
              mobile: "16762626632",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 363,
              userId: "jf363",
              nickname: "测试",
              fullname: "测试",
              email: null,
              mobile: "13201010202",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 364,
              userId: "jf364",
              nickname: "哈哈",
              fullname: "哈哈",
              email: null,
              mobile: "13212344321",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 365,
              userId: "jf365",
              nickname: "收到",
              fullname: "收到",
              email: null,
              mobile: "13423455432",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 366,
              userId: "jf366",
              nickname: "测试123",
              fullname: "测试123",
              email: null,
              mobile: "13000000000",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 368,
              userId: "jf368",
              nickname: "自行车",
              fullname: "自行车",
              email: null,
              mobile: "13867899876",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 446,
              userId: "liulanlan",
              nickname: null,
              fullname: "刘兰兰",
              email: null,
              mobile: "13770525960",
              lastLoginTime: "2021-04-26",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 4826,
              userId: "liuzhenzong1",
              nickname: null,
              fullname: "刘振宗1",
              email: null,
              mobile: "13569865325",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 3,
                  roleCode: "CJDW_FZR",
                  roleName: "承建单位/负责人",
                  roleType: 1,
                },
              ],
            },
          ],
        },
      };
      let tableData;
      tableData = res.data.memberInfos.filter(
        (item) => !this.ids.some((i) => i.memberJfid == item.jfid)
      );
      this.tableData = tableData;
      this.$set(this.table, "data", tableData);
      //
    },
    /**
     * 获取带分页数据
     */
    getPageList(page) {
      //liyufei mock
      var res = {
        msg: { code: "0000", reasonPhrase: "SUCCESS", message: "SUCCESS" },
        data: {
          buid: 54,
          buName: "华为软件",
          buCode: null,
          legal: null,
          realName: null,
          logoUrl: null,
          buProperty: 3,
          memberInfos: [
            {
              jfid: 23,
              userId: "liuzhenzong",
              nickname: "刘振宗",
              fullname: "刘振宗",
              email: "liuzhenzong@chinasofti.com",
              mobile: null,
              lastLoginTime: "2021-06-18",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 3,
                  roleCode: "CJDW_FZR",
                  roleName: "承建单位/负责人",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 24,
              userId: "miaoruigeng",
              nickname: "苗瑞庚",
              fullname: "苗瑞庚",
              email: "miaoruigeng@chinasofti.com",
              mobile: "1323427564",
              lastLoginTime: "2021-07-06",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 4,
                  roleCode: "CJDW_XMJL",
                  roleName: "承建单位/项目经理",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 25,
              userId: "chenzhipan",
              nickname: "程志攀",
              fullname: "程志攀",
              email: "chenzhipan@chinasofti.com",
              mobile: null,
              lastLoginTime: "2021-02-18",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 267,
              userId: "jf267",
              nickname: null,
              fullname: "徐图之",
              email: null,
              mobile: "13114362186",
              lastLoginTime: "2020-08-08",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 286,
              userId: "jf286",
              nickname: null,
              fullname: "李",
              email: null,
              mobile: null,
              lastLoginTime: "2020-07-20",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 287,
              userId: "jf287",
              nickname: null,
              fullname: "李",
              email: null,
              mobile: null,
              lastLoginTime: "2020-07-21",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 333,
              userId: "jf333",
              nickname: null,
              fullname: "徐",
              email: null,
              mobile: null,
              lastLoginTime: "2021-04-26",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 334,
              userId: "xuxiangyang123",
              nickname: null,
              fullname: "张三",
              email: null,
              mobile: "13234554567",
              lastLoginTime: "2021-03-30",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 4,
                  roleCode: "CJDW_XMJL",
                  roleName: "承建单位/项目经理",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 337,
              userId: "jf337",
              nickname: null,
              fullname: "祥龙",
              email: null,
              mobile: null,
              lastLoginTime: "2020-07-28",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 338,
              userId: "jf338",
              nickname: null,
              fullname: "周",
              email: null,
              mobile: "13357831900",
              lastLoginTime: "2020-08-08",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 346,
              userId: "jf346",
              nickname: null,
              fullname: null,
              email: null,
              mobile: "13999999999",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 347,
              userId: "jf347",
              nickname: null,
              fullname: null,
              email: null,
              mobile: "13899999999",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 356,
              userId: "jf356",
              nickname: null,
              fullname: null,
              email: null,
              mobile: "13412344321",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 357,
              userId: "jf357",
              nickname: null,
              fullname: null,
              email: null,
              mobile: "17356002709",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 358,
              userId: "jf358",
              nickname: null,
              fullname: null,
              email: null,
              mobile: "183629755-7",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 359,
              userId: "jf359",
              nickname: null,
              fullname: null,
              email: null,
              mobile: "18362975507",
              lastLoginTime: "2020-10-12",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 360,
              userId: "jf360",
              nickname: null,
              fullname: null,
              email: null,
              mobile: "18362975506",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 362,
              userId: "1223",
              nickname: null,
              fullname: "test1",
              email: "",
              mobile: "16762626632",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 363,
              userId: "jf363",
              nickname: "测试",
              fullname: "测试",
              email: null,
              mobile: "13201010202",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 364,
              userId: "jf364",
              nickname: "哈哈",
              fullname: "哈哈",
              email: null,
              mobile: "13212344321",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 365,
              userId: "jf365",
              nickname: "收到",
              fullname: "收到",
              email: null,
              mobile: "13423455432",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 366,
              userId: "jf366",
              nickname: "测试123",
              fullname: "测试123",
              email: null,
              mobile: "13000000000",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 368,
              userId: "jf368",
              nickname: "自行车",
              fullname: "自行车",
              email: null,
              mobile: "13867899876",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 446,
              userId: "liulanlan",
              nickname: null,
              fullname: "刘兰兰",
              email: null,
              mobile: "13770525960",
              lastLoginTime: "2021-04-26",
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 5,
                  roleCode: "CJDW_CY",
                  roleName: "承建单位/成员",
                  roleType: 1,
                },
              ],
            },
            {
              jfid: 4826,
              userId: "liuzhenzong1",
              nickname: null,
              fullname: "刘振宗1",
              email: null,
              mobile: "13569865325",
              lastLoginTime: null,
              accountStat: 0,
              roleInfos: [
                {
                  roleId: 3,
                  roleCode: "CJDW_FZR",
                  roleName: "承建单位/负责人",
                  roleType: 1,
                },
              ],
            },
          ],
        },
      };
      let tableData;
      tableData = res.data.memberInfos.filter(
        (item) => !this.ids.some((i) => (i.memberJfid || i.jfid) == item.jfid)
      );
      this.tableData = tableData;
      this.$set(this.table, "data", tableData);
      this.$set(this.table.page, "total", res.data.total);
      this.$set(this.table.page, "pages", res.data.totalPages);
    },
    // getPageData(page) {
    //   //分页查询
    //   this.getList(page);
    // },

    //改变页数
    getPageData(val) {
      this.table.page.pageNum = val;
      this.getList(val, this.table.page.pageSize);
    },
    //改变条数
    getSizeDate(val) {
      this.table.page.pageSize = val;
      this.getList(this.table.page.pageNum, val);
    },
  },
};
</script>

<style lang="scss" scoped>
.card-list {
  margin-top: 20px;
  padding: 20px;
  width: 100%;
  background: #fff;
  .btn-operation {
    text-align: right;
  }
}
.common-dialog {
  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
    height: 32px;
    width: 32px;
    z-index: 10;
  }
}
.common-dialog {
  ::v-deep.el-dialog__body {
    overflow: hidden;
  }
}
</style>

<style lang="scss">
.source .el-popover {
  min-width: 60px !important;
}
.source .el-popover--plain {
  padding: 0;
}

::v-deep.el-table--scrollable-y .table-dialog {
  .selectInfo {
    line-height: 32px;
  }
  .el-table__body-wrapper {
    overflow: hidden;
  }
  .dialog-search {
    margin-top: -20px;
    padding-bottom: 10px;
    .search {
      width: 342px;
      span {
        color: #1890ff;
      }
    }
  }
  .table-components {
    padding: 0;
  }
}
</style>
