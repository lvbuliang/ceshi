<template>
    <div class="sand_table">
        <DepartmentDialog class="dialog" :flag="dialogflag" ref="departmentDialog"></DepartmentDialog>
        <!-- <search-head @search="search"></search-head>
        <div ref="infinteList" class="infinite_list" v-infinite-scroll="load" style="overflow:auto">
            <template v-if="jfzgProjectLibraryList && jfzgProjectLibraryList.length>0">
              <project-list
                  v-for="(item, index) in jfzgProjectLibraryList"
                  :key="item.id"
                  v-bind="item"
                  :index="index"
              ></project-list>
            </template>
            <empty v-else></empty>
        </div>
        <footer v-if="checkCodeInArr('M001_009')">
            <img :src="imgUrl" alt="" @mouseover="imgUrl=imgHoverurl" @mouseleave="imgUrl=imgDefaulturl" @click="footerClick">
        </footer> -->
    </div>
</template>

<script>
import SearchHead from "./components/SearchHead.vue";
import ProjectList from "./components/ProjectList.vue";
import empty from "@/views/home/components/empty.vue";
import { getProjectBasciInfoList } from "@/api/home";
import riskAndQuestion from "./components/riskAndQuestion.vue"
import childProjectList from "./components/childProjectList.vue"
import  DepartmentDialog from "@/components/DepartmentDialog"
import { checkCodeInArr } from "@/utils/utils.js";
export default {
    components: {
        SearchHead,
        ProjectList,
        riskAndQuestion,
        childProjectList,
        DepartmentDialog,
        empty
    },
    computed: {
      permission_views() {
        // 工作台权限块列表
        return this.$store.getters.permission_views;
      },
    },
    data() {
        return {
			pageData: {
				pageNum: 0,
				pageSize: 5
			},
			params: {},
			jfzgProjectLibraryList: [],
            imgDefaulturl: require('@/assets/standtable/footer0.png'),
            imgHoverurl: require('@/assets/standtable/footer1.png'),
            imgUrl: "",
            dialogflag: false
        };
    },
	mounted() {
        this.imgUrl = this.imgDefaulturl
	},
    methods: {
      checkCodeInArr(code) {
        // 权限
        let arr = this.permission_views;
        return checkCodeInArr(code, arr);
      },
        // 滚动加载事件
        load() {
			this.pageData.pageNum++
			getProjectBasciInfoList({...this.pageData, ...this.params}).then((res) => {
                if (res.msg.code === '0000') {
                    this.jfzgProjectLibraryList = this.jfzgProjectLibraryList.concat(res.data.jfzgProjectLibraryList)
                }
            });
		},
        // 点击按钮查询和刷新事件
        search(params) {
            this.$refs.infinteList.scrollTop = 0
			this.pageData.pageNum = 1
			this.params = params
            getProjectBasciInfoList({...this.pageData, ...this.params}).then((res) => {
				if (res.msg.code === '0000') {
					this.jfzgProjectLibraryList= res.data.jfzgProjectLibraryList
				}
            });
        },
        // 更新tab页签
        toWorkBench() {
            let newTabsList = [];

            newTabsList = this.tabsList.map((res) => {
                if (res.url === this.currentPage) {
                    res = {
                        url: "/base/home",
                        title: "工作台",
                        routerBase: "/base",
                    };
                }
                return res;
            });
            this.$store.commit("tabs/UPDATE_CURRENT_PAGE", "/base/home");
            this.$store.commit("tabs/CHANGE_TABS_LIST", newTabsList);
            this.$router.push({ name: "workBench" });
        },
        toSingleProject() {
            this.$router.push({ name: "singleProject" });
        },
        footerClick() {
             this.$refs['departmentDialog'].init()
           
        }
    },
};
</script>

<style lang="scss" scoped>
.sand_table {
    padding-top: 24px;
	height: 100%;
	.infinite_list {
        padding: 0 24px;
		height: calc(100% - 85px);
	}
    
    footer {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 4px;
        img {
            width: 675px;
            cursor: pointer;
        }
    }
}
</style>>