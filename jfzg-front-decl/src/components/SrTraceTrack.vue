<template>
  <div class="sr-trace-track">
    <el-dialog
      :visible.sync="dialogVisible"
      width="800px"
      top="5vh"
      @close="dialogVisible = false"
      class="sr-trace-track-dialog"
    >
      <template slot="title">
        <el-tabs v-model="activeName">
          <el-tab-pane name="first">
            <div slot="label">
              <!-- <img
                width="24px"
                style="vertical-align: middle"
                height="auto"
                src="./traceTrack/xuanting.png"
                alt=""
              /> -->
              <span>留痕轨迹</span>
            </div>
          </el-tab-pane>
          <el-tab-pane name="second" v-if="imgUrl">
            <div slot="label">
              <!-- <img
                width="24px"
                style="vertical-align: middle"
                height="auto"
                src="./traceTrack/lanmu.png"
                alt=""
              /> -->
              <span>流程图</span>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
      <div class="dialog-content">
        <template v-if="activeName == 'first'">
          <el-timeline>
            <el-timeline-item
              :color="activity.color"
              class="track_content"
              v-for="(activity, index) in trackData"
              :key="index"
            >
              <div class="track_title">{{ activity.name }}</div>
              <div
                class="track_item"
                :class="{
                  advice:
                    list[defaultProps.name] &&
                    list[defaultProps.name].includes('意见'),
                  file: list[defaultProps.fileList],
                  result:
                    list[defaultProps.name] &&
                    list[defaultProps.name].includes('结果'),
                }"
                v-for="(list, i) in activity[defaultProps.list]"
                :key="i"
              >
                <div v-if="list[defaultProps.fileList]">
                  <span class="name" v-if="list[defaultProps.name] === 'fileId'"
                    >附件：</span
                  >
                  <span class="name" v-else
                    >{{ list[defaultProps.name] }}：</span
                  >
                  <ul>
                    <li
                      class="file_item"
                      v-for="item in list[defaultProps.fileList]"
                      :key="item.id"
                    >
                      <div class="left">
                        <slot name="linkSlot">
                          <i class="el-icon-paperclip"></i>
                        </slot>
                        <span
                          class="file_name"
                          :title="item.name || item.fileName"
                        >
                          {{ item.name || item.fileName }}
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div
                  v-else-if="
                    list[defaultProps.name] &&
                    list[defaultProps.name].includes('意见')
                  "
                >
                  <div class="name">{{ list[defaultProps.name] }}：</div>
                  <span class="value" v-html="list[defaultProps.value]"></span>
                </div>
                <div
                  v-else-if="
                    list[defaultProps.name] &&
                    list[defaultProps.name].includes('结果')
                  "
                >
                  <span class="name">{{ list[defaultProps.name] }}：</span>
                  <span
                    class="value"
                    style="color: #1890ff"
                    v-html="list[defaultProps.value]"
                  ></span>
                </div>
                <div v-else-if="list[defaultProps.name]">
                  <span class="name">{{ list[defaultProps.name] }}：</span>
                  <span class="value" v-html="list[defaultProps.value]"></span>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </template>
        <template v-if="activeName == 'second'">
          <img
            width="100%"
            height="auto"
            class="flow_img"
            :src="`data:text/html;base64,${imgUrl}`"
          />
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="dialogVisible = false"
          >关 闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  inject: ["traceTrackRequest"],
  props: {
    defaultProps: Object,
    imgUrl: String,
    showIcon: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: {},
    },
    trackData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      activeName: "first",
      dialogVisible: false,
      trackData: null,
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    preview(item) {
      this.$emit("preview", item);
    },
    download(item) {
      this.$emit("download", item);
    },
    open() {
      this.dialogVisible = true;
    },
  },
};
</script>