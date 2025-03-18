<template>
  <div class="Swiper">
    <Swiper ref="todoSwiper" :options="swiperOption" class="swiperTodo">
      <Swiper-slide class="swiperTodoItem" v-for="(item, i) in eletab" :key="'s_' + i">
        <div @click="handleClick(i, $event)">
          <span :class="['cellClass', active == i ? 'activeClass' : '']" v-if='item.tagTypeName.length<15' :title='item.tagTypeName'>
            {{ item.tagTypeName }}
          </span>
          <span :class="['cellClass', active == i ? 'activeClass' : '']" v-else :title='item.tagTypeName'>
            {{ item.tagTypeName.substring(0,12)+"..." }}
          </span>
          <span class="line" v-if="i != eletab.length - 1"></span>
        </div>
      </Swiper-slide>
      <div class="swiper-button-prev" slot="button-prev" @click="prev">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="swiper-button-next" slot="button-next" @click="next">
        <i class="el-icon-arrow-right"></i>
      </div>
    </Swiper>
  </div>
</template>

<script>
import store from "@/store";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import config from "@/settings.js";
import upload from "@/utils/upload";
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  provide() {
    return {
      baseUrl: config.uploadBaseUrl,
      imgBaseUrl: config.imgBaseUrl,
      uploadRequest: upload,
      uploadBaseUrl: config.uploadBaseUrl,
    };
  },
  computed: {
    swiper() {
      return this.$refs.todoSwiper.$swiper;
    },
  },
  props: {
    eletab: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      active: 0,
      swiperOption: {
        loop: false,
        slidesPerView: "auto", // 每页展示几条数据
        spaceBetween: 0,
        initialSlide: 0,
        freeMode: true,
        navigation: {
          nextEl: ".swiper-button-Next",
          prevEl: ".swiper-button-Prev",
        },
      },
    };
  },
  methods: {
    prev() {
      this.swiper.slidePrev();
    },
    next() {
      this.swiper.slideNext();
    },
    handleClick(tab) {
      this.$parent.changeshow(tab);
      this.active = tab;
      console.log(tab);
    },
  },
};
</script>

<style lang="scss" scoped>
.Swiper {
  background: #FAFAFA;
  .swiperTodo {
    border: 1px solid #efefef;
    border-radius: 8px;
    margin-top: -4px;
    width: 100%;
    .swiper-container {
      overflow-y: inherit;
    }
    .swiper-button-next:after,
    .swiper-container-rtl .swiper-button-prev:after {
      font-size: 0px;
      color: #999;
    }
    [class^="el-icon-"],
    [class*=" el-icon-"] {
      line-height: 1;
    }
    .swiper-button-prev::after,
    .swiper-container-rtl .swiper-button-next::after {
      content: "";
    }
    .swiper-button-next::after,
    .swiper-container-rtl .swiper-button-prev::after {
      content: "";
    }
    .swiper-button-prev:after,
    .swiper-button-next:after {
      font-size: 16px;
      color: #999 !important;
      margin-top: -5px;
    }
    .swiper-button-prev {
      left: 0 !important;
      border-right: 1px solid #efefef;
    }
    .swiper-button-next,
    .swiper-button-prev {
      font-size: 16px;
      font-weight: bold;
      color: #999 !important;
      width: 40px;
      height: 40px;
    background: #FAFAFA;
      margin-top: 2px;
      transform: translateY(-58%);
    }
    .swiper-button-next {
      right: 0 !important;
      border-left: 1px solid #efefef;
    }
    &:hover {
      .swiper-button-next,
      .swiper-button-prev {
        display: flex;
      }
    }
  }
  .swiper-container {
    position: relative;
    width: 100%;
    height: 40px;

    .swiperTodoItem {
      height: 40px;
      line-height: 40px;
      width: 175px !important;
      color: #666;
      -moz-user-select: none;
      -o-user-select: none;
      -khtml-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      cursor: pointer;
      div {
        text-align: center;
        position: relative;
        .line {
          border-left: 1px solid #cccccc;
          height: 18px;
          position: absolute;
          right: 0%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .cellClass {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
      .activeClass {
        color: #1890ff;
      }
    }
    .swiperTodoItem:nth-child(1) {
      margin-left: 40px;
    }
    .swiperTodoItem:nth-last-child(1) {
      margin-right: 40px;
    }
  }
}
</style>
