import Vue from "vue";
import Element from "./element";
import WlUi from './wlui'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import infiniteScroll from "vue-infinite-scroll";
import clickoutside from '@/utils/clickoutside.js'
import dataV from '@jiaminghi/data-view'

// 注册组件
[...Element.components, ...WlUi, dataV, VueAwesomeSwiper, infiniteScroll].forEach(i => Vue.use(i))

// 注册指令服务
Element.serve.forEach(i => Vue.use(i.directive));

// 注册挂载方法
Element.methods.forEach(i => Vue.prototype[`$${i.name}`] = i);

