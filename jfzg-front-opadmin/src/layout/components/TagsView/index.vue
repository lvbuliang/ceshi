<template>
    <div id="tags-view-container" class="tags-view-container">
        <scroll-pane ref="scrollPane" class="tags-view-wrapper">
            <router-link
                v-for="tag in visitedViews"
                ref="tag"
                :key="tag.path"
                :class="isActive(tag)?'active':''"
                :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
                tag="span"
                class="tags-view-item"
                @click.native="refreshSelectedTag(tag)"
                @click.middle.native="closeSelectedTag(tag)"
                @contextmenu.prevent.native="openMenu(tag,$event)"
            >
                {{ tag.meta.title || tag.name }}
                <span
                    v-if="!tag.meta.affix"
                    class="el-icon-close"
                    @click.prevent.stop="closeSelectedTag(tag)"
                />
            </router-link>
        </scroll-pane>
        <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
            <li @click="refreshSelectedTag(selectedTag)">刷新</li>
            <li
                v-if="!(selectedTag.meta&&selectedTag.meta.affix)"
                @click="closeSelectedTag(selectedTag)"
            >关闭</li>
            <li @click="closeOthersTags">关闭其他</li>
            <li @click="closeAllTags(selectedTag)">关闭所有</li>
        </ul>
    </div>
</template>

<script>
import ScrollPane from "./ScrollPane";
import path from "path";

export default {
    components: { ScrollPane },
    data() {
        return {
            visible: false,
            top: 0,
            left: 0,
            selectedTag: {},
            affixTags: []
        };
    },
    computed: {
        visitedViews() {
            return this.$store.state.tagsView.visitedViews;
        },
        routes() {
            return this.$store.state.permission.routes;
        }
    },
    watch: {
        $route() {
            this.addTags();
            this.moveToCurrentTag();
        },
        visible(value) {
            if (value) {
                document.body.addEventListener("click", this.closeMenu);
            } else {
                document.body.removeEventListener("click", this.closeMenu);
            }
        }
    },
    mounted() {
        this.initTags();
        this.addTags();
    },
    methods: {
        isActive(route) {
            return route.path === this.$route.path;
        },
        filterAffixTags(routes, basePath = "/") {
            let tags = [];
            routes.forEach(route => {
                if (route.meta && route.meta.affix) {
                    const tagPath = path.resolve(basePath, route.path);
                    tags.push({
                        fullPath: tagPath,
                        path: tagPath,
                        name: route.name,
                        meta: { ...route.meta }
                    });
                }
                if (route.children) {
                    const tempTags = this.filterAffixTags(
                        route.children,
                        route.path
                    );
                    if (tempTags.length >= 1) {
                        tags = [...tags, ...tempTags];
                    }
                }
            });
            return tags;
        },
        initTags() {
            const affixTags = (this.affixTags = this.filterAffixTags(
                this.routes
            ));
            for (const tag of affixTags) {
                // Must have tag name
                if (tag.name) {
                    this.$store.dispatch("tagsView/addVisitedView", tag);
                }
            }
        },
        addTags() {
            const { name } = this.$route;
            if (name) {
                this.$store.dispatch("tagsView/addView", this.$route);
            }
            return false;
        },
        moveToCurrentTag() {
            const tags = this.$refs.tag;
            this.$nextTick(() => {
                for (const tag of tags) {
                    if (tag.to.path === this.$route.path) {
                        this.$refs.scrollPane.moveToTarget(tag);
                        // when query is different then update
                        if (tag.to.fullPath !== this.$route.fullPath) {
                            this.$store.dispatch(
                                "tagsView/updateVisitedView",
                                this.$route
                            );
                        }
                        break;
                    }
                }
            });
        },
        refreshSelectedTag(view) {
            this.$store.dispatch("tagsView/delCachedView", view).then(() => {
                const { fullPath } = view;
                this.$nextTick(() => {
                    this.$router.replace({
                        path: "/redirect" + fullPath
                    });
                });
            });
        },
        closeSelectedTag(view) {
            this.$store
                .dispatch("tagsView/delView", view)
                .then(({ visitedViews }) => {
                    if (this.isActive(view)) {
                        this.toLastView(visitedViews, view);
                    }
                });
        },
        closeOthersTags() {
            this.$router.push(this.selectedTag);
            this.$store
                .dispatch("tagsView/delOthersViews", this.selectedTag)
                .then(() => {
                    this.moveToCurrentTag();
                });
        },
        closeAllTags(view) {
            this.$store
                .dispatch("tagsView/delAllViews")
                .then(({ visitedViews }) => {
                    if (this.affixTags.some(tag => tag.path === view.path)) {
                        return;
                    }
                    this.toLastView(visitedViews, view);
                });
        },
        toLastView(visitedViews, view) {
            const latestView = visitedViews.slice(-1)[0];
            if (latestView) {
                this.$router.push(latestView);
            } else {
                // now the default is to redirect to the home page if there is no tags-view,
                // you can adjust it according to your needs.
                if (view.name === "Dashboard") {
                    // to reload home page
                    this.$router.replace({ path: "/redirect" + view.fullPath });
                } else {
                    this.$router.push("/");
                }
            }
        },
        openMenu(tag, e) {
            const menuMinWidth = 105;
            const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
            const offsetWidth = this.$el.offsetWidth; // container width
            const maxLeft = offsetWidth - menuMinWidth; // left boundary
            const left = e.clientX - offsetLeft + 15; // 15: margin right

            if (left > maxLeft) {
                this.left = maxLeft;
            } else {
                this.left = left;
            }

            this.top = e.offsetY;
            this.visible = true;
            this.selectedTag = tag;
        },
        closeMenu() {
            this.visible = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.tags-view-container {
    height: $tagsView;
    width: 100%;
    background: #fff;
    border-bottom: 0.5px solid #eaeaea;
    overflow: hidden;
    //box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
    .tags-view-wrapper {
        padding: 0 15px;
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            //height: 26px;
            //line-height: 26px;
            //border: 1px solid #d8dce5;
            color: #8f8f8f;
            background: #fff;
            padding: 12px 20px;
            font-size: 14px;
            //margin-left: 5px;
            margin-top: 2px;
            &.active {
                //background-color: #42b983;
                color: #2f54eb;
                //border-color: #42b983;
                // &::before {
                //   content: '';
                //   background: #fff;
                //   display: inline-block;
                //   width: 8px;
                //   height: 8px;
                //   border-radius: 50%;
                //   position: relative;
                //   margin-right: 2px;
                // }
            }

            &:after {
                content: "";
                position: absolute;
                top: 10px;
                right: 0;
                width: 1px;
                height: 20px;
                border-right: 1.5px solid #eaeaea;
            }

            &:nth-last-child(1) {
                &:after {
                    border-right: none;
                }
            }
        }
    }
    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;
            &:hover {
                background: #eee;
            }
        }
    }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
    .tags-view-item {
        .el-icon-close {
            width: 18px;
            height: 18px;
            vertical-align: 2px;
            //border-radius: 50%;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            transform-origin: 100% 50%;
            &:before {
                transform: scale(0.8);
                display: inline-block;
                vertical-align: -2px;
            }
            &:hover {
                //background-color: #b4bccc;
                //color: #fff;
                color: #000;
            }
        }
    }

    .el-scrollbar__wrap {
        margin-bottom: 0 !important;
        overflow: hidden;
    }
}
</style>
