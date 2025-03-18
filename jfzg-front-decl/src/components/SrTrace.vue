<template>
  <div>
    <SrTrace
      :trackData="trackData"
      :defaultProps="defaultProps"
      :imgUrl="imgUrl"
      :params="params"
      @preview="preview"
      @download="download"
      ref="sr_trace_track"
    ></SrTrace>

    <div @click="open">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import SrTrace from "./SrTraceTrack.vue";
export default {
  name: "SrTraceTrack",
  inject: ["traceTrackRequest"],
  components: {
    SrTrace,
  },
  data() {
    return {
      // 配置项
      defaultProps: {
        name: "name",
        value: "value",
        fileList: "fileList",
        list: "list",
      },
      // 留痕轨迹数据
      trackData: [
        {
          name: "确认",
          color: "#4481D8",
          list: [
            {
              name: "确认人",
              value: "陈斌",
              color: "normal",
            },
            {
              name: "确认时间",
              value: "2020-11-21  15:00:23",
              color: "normal",
            },

            {
              br: true,
            },
            {
              name: "审核结果",
              value: "通过",
              color: "normal",
            },
            {
              name: "确认意见",
              value:
                "城市发展重庆有悠久的历史。周朝为巴国都城历代都是郡、州、府的治所。重庆由于优越的地理位置历史上就是一个重要的物资集散市场和交通枢纽。近代开辟为商埠后工商业有所发展。",
              color: "normal",
            },
            {
              name: "fileId",
              color: "normal",
              fileList: [
                {
                  id: 1,
                  name: "附件",
                  url: "url",
                },
                {
                  id: 1,
                  name: "附件",
                  url: "url",
                },
                {
                  id: 1,
                  name: "附件",
                  url: "url",
                },
                {
                  id: 1,
                  name: "附件",
                  url: "url",
                },
              ],
            },
          ],
        },
        {
          name: "确认",
          list: [
            {
              name: "确认人",
              value: "陈斌",
              color: "normal",
            },
            {
              name: "确认时间",
              value: "2020-11-21  15:00:23",
              color: "normal",
            },
            {
              name: "确认意见",
              value:
                "城市发展重庆有悠久的历史。周朝为巴国都城历代都是郡、州、府的治所。重庆由于优越的地理位置历史上就是一个重要的物资集散市场和交通枢纽。近代开辟为商埠后工商业有所发展。",
              color: "normal",
            },
            {
              name: "附件",
              color: "normal",
              fileList: [
                {
                  id: 1,
                  name: "附件",
                  url: "url",
                },
              ],
            },
          ],
        },
        {
          name: "确认",
          list: [
            {
              name: "确认人",
              value: "陈斌",
              color: "normal",
            },
            {
              name: "确认时间",
              value: "2020-11-21  15:00:23",
              color: "normal",
            },
            {
              name: "确认意见",
              value:
                "城市发展重庆有悠久的历史。周朝为巴国都城历代都是郡、州、府的治所。重庆由于优越的地理位置历史上就是一个重要的物资集散市场和交通枢纽。近代开辟为商埠后工商业有所发展。",
              color: "normal",
            },
            {
              name: "附件",
              color: "normal",
              fileList: [
                {
                  id: 1,
                  name: "附件",
                  url: "url",
                },
              ],
            },
            {
              br: true,
            },
          ],
        },
        {
          name: "确认",
          list: [
            {
              name: "确认人",
              value: "陈斌",
              color: "normal",
            },
            {
              name: "确认时间",
              value: "2020-11-21  15:00:23",
              color: "normal",
            },
            {
              name: "确认意见",
              value:
                "城市发展重庆有悠久的历史。周朝为巴国都城历代都是郡、州、府的治所。重庆由于优越的地理位置历史上就是一个重要的物资集散市场和交通枢纽。近代开辟为商埠后工商业有所发展。",
              color: "normal",
            },
            {
              name: "附件",
              color: "normal",
              fileList: [
                {
                  id: 1,
                  name: "附件",
                  url: "url",
                },
              ],
            },
            {
              br: true,
            },
          ],
        },
      ],
      // 流程图地址

    };
  },
  props: {
    params: [Object],
    imgUrl: [String],
  },
  mounted() {
    this.traceTrackRequest.getTraceTrackList(this.params, (data) => {
      this.trackData = data.data;
    });
  },
  methods: {
    preview(item) {
      console.log(item);
    },
    download(item) {
      console.log(item);
    },
    open() {
      this.$refs.sr_trace_track.open();
    },
  },
};
</script>

<style>
</style>