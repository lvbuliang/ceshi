import Vue from 'vue'
import Router from 'vue-router'
import viewPdf from './../views/pdf.vue'
import { getStorageToken } from '@/utils/user-vali'
import store from '@/store'
import { buriedPointSave } from '@/api/home'
import { api_getUserByToken } from '@/api/user.js'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: () => import('@/views/Layout'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginNew'),
    },
    {
      path: '/loginAuto',
      name: 'loginAuto',
      component: () => import('@/views/LoginAuto'),
    },
    // 钉钉跳工作台
    {
      path: '/loginDing',
      name: 'loginDing',
      component: () => import('@/views/loginDing'),
    },
    {
      path: '/loginOut',
      name: 'loginOut',
      component: () => import('@/views/LoginOut'),
    },
    {
      path: '/loginOutBefore',
      name: 'loginOutBefore',
      component: () => import('@/views/loginOutBefore'),
    },
    {
      path: '/jfzg/ucenter/thirApi/apiLogin/loginOut',
      name: 'loginOut',
      component: () => import('@/views/LoginOut'),
    },
    {
      path: '/base',
      component: () => import('@/views/HomeLayout'),
      //放开沙盘
      // redirect: "/base/sandTable",
      redirect: '/base/home',
      meta: {
        module: 'base',
      },
      children: [
        {
          path: 'dataBoard',
          name: 'dataBoard',
          component: () => import('@/views/dataBoard/index'),
          meta: {
            title: '数据看板',
            module: 'base',
            busiType: 'DATA_BOARD',
          },
        },
        {
          path: 'home',
          name: 'workBench',
          meta: {
            title: '工作台',
            module: 'base',
            busiType: 'WORK_BENCH',
          },
          component: () => import('@/views/home/index'),
          children: [
            {
              path: 'amountStandTable',
              name: 'amountStandTable',
              meta: {
                title: '金额统计沙盘',
                module: 'base',
                busiType: 'WORK_BENCH',
              },
              component: () => import('@/views/amountStandTable'),
            },
            {
              path: 'jsdwList',
              name: 'jsdwList',
              meta: {
                title: '建设单位列表',
                module: 'base',
                busiType: 'WORK_BENCH',
              },
              component: () => import('@/views/jsdwList'),
            },
            //
          ],
        },
        {
          path: 'sandTable',
          name: 'sandTable',
          component: () => import('@/views/sandTable/index'),
          meta: {
            title: '沙盘',
            module: 'base',
            busiType: 'WORK_BENCH',
          },
        },
        {
          path: 'singleProject',
          name: 'singleProject',
          component: () => import('@/views/singleProject/index'),
          meta: {
            title: '单项目沙盘',
            module: 'base',
            busiType: 'WORK_BENCH',
          },
        },
        {
          path: 'test',
          name: 'test',
          component: () => import('@/views/test'),
          meta: {
            title: '专家抽取',
            module: 'base',
            busiType: 'PROJECT_STUDY2',
          },
          children: [{ path: '**', component: () => import('@/views/404') }],
        },
        {
          path: 'noAccess',
          name: 'noAccess',
          component: () => import('@/views/noAccess.vue'),
          meta: {
            title: '无权限',
            module: 'base',
          },
        },
      ],
    },
    {
      path: '/set',
      component: () => import('@/views/HomeLayout'),
      redirect: '/set/setinformation',
      children: [
        {
          path: 'setinformation',
          component: () => import('@/views/set/index'),
          meta: {
            title: '设置',
            module: 'base',
            busiType: 'PERSON_SET',
          },
        },
      ],
    },
    {
      path: '/knowledgeBase',
      component: () => import('@/views/HomeLayout'),
      redirect: '/knowledgeBase/search',
      children: [
        {
          path: 'search',
          name: 'knowledgeBaseSearch',
          component: () => import('@/views/knowledgeBase/index'),
          meta: {
            title: '知识库',
            module: 'base',
            busiType: 'KNOWLEDGE_REPOSITORY',
          },
        },
        {
          path: 'search',
          name: 'knowledgeBaseSearch',
          component: () => import('@/views/knowledgeBase/index'),
          meta: {
            title: '知识库',
            module: 'base',
            busiType: 'KNOWLEDGE_REPOSITORY',
          },
        },
        {
          path: 'view',
          name: 'knowledgeBaseView',
          component: () => import('@/views/knowledgeBase/view'),
          meta: {
            title: '查看文档',
            module: 'base',
            busiType: 'KNOWLEDGE_REPOSITORY',
          },
        },
      ],
    },
    {
      path: '/subplan',
      component: () => import('@/views/Layout'),
      meta: {
        busiType: 'PROJECT_STUDY',
      },
      children: [{ path: '**', component: () => import('@/views/404') }],
    },
    {
      path: '/subzichan',
      component: () => import('@/views/Layout'),
      meta: {
        busiType: 'PROJECT_STUDY',
      },
      children: [{ path: '**', component: () => import('@/views/404') }],
    },
    {
      path: '/subdecl',
      component: () => import('@/views/Layout'),
      meta: {
        busiType: 'PROJECT_STUDY1',
      },
      children: [{ path: '**', component: () => import('@/views/404') }],
    },
    {
      path: '/subshenbao',
      component: () => import('@/views/Layout'),
      meta: {
        busiType: 'PROJECT_STUDY2',
      },
      children: [{ path: '**', component: () => import('@/views/404') }],
    },
    {
      path: '/subimpl',
      component: () => import('@/views/Layout'),
      meta: {
        busiType: 'PROJECT_STUDY2',
      },
      children: [{ path: '**', component: () => import('@/views/404') }],
    },
    {
      path: '/subdis',
      component: () => import('@/views/Layout'),
      meta: {
        busiType: 'PROJECT_STUDY2',
      },
      children: [{ path: '**', component: () => import('@/views/404') }],
    },
    {
      path: '/subcheck',
      component: () => import('@/views/Layout'),
      meta: {
        busiType: 'PROJECT_STUDY2',
      },
      children: [{ path: '**', component: () => import('@/views/404') }],
    },
    {
      path: '/subexpert',
      component: () => import('@/views/Layout'),
      meta: {
        busiType: 'PROJECT_STUDY2',
      },
      children: [{ path: '**', component: () => import('@/views/404') }],
    },
    {
      path: '/subfinal',
      component: () => import('@/views/Layout'),
      meta: {
        busiType: 'PROJECT_STUDY2',
      },
      children: [{ path: '**', component: () => import('@/views/404') }],
    },
    {
      path: '/subradial',
      component: () => import('@/views/Layout'),
      meta: {
        busiType: 'PROJECT_STUDY2',
      },
      children: [{ path: '**', component: () => import('@/views/404') }],
    },
    {
      path: '/subservice',
      component: () => import('@/views/Layout'),
      meta: {
        busiType: 'PROJECT_STUDY2',
      },
      children: [{ path: '**', component: () => import('@/views/404') }],
    },
    {
      path: '/subzaojia',
      component: () => import('@/views/Layout'),
      meta: {
        busiType: 'PROJECT_STUDY2',
      },
      children: [{ path: '**', component: () => import('@/views/404') }],
    },
    {
      path: '/viewPdf',
      name: 'viewPdf',
      component: viewPdf,
      meta: {
        title: 'PDF预览',
      },
    },
    {
      path: '*',
      component: () => import('@/views/404'),
    },
  ],
})
router.beforeEach((to, from, next) => {
  console.log('from.fullPathfrom.fullPathfrom.fullPathfrom.fullPathfrom.fullPathfrom.fullPath', from.fullPath);
  store.commit("userinfo/SET_FROM_ROUTE", from.fullPath);
  let tabsList = JSON.parse(sessionStorage.getItem('tabsList')) || [];
  let urlArr = tabsList.map((res) => res.url);

  // 如果是沙盘工作台互相切换就不新开页签
  if (
    ['workBench', 'sandTable', 'dataBoard'].includes(to.name) &&
    (urlArr.includes('/base/home') || urlArr.includes('/base/sandTable') || urlArr.includes('/base/dataBoard'))
  ) {
    let newTabsList = tabsList.map((res) => {
      if (res.url === '/base/home' || res.url === '/base/sandTable' || res.url === '/base/dataBoard') {
        res = {
          title: to.meta.title,
          url: to.fullPath,
          meta: to.meta,
        };
      }
      return res;
    });
    store.commit('tabs/CHANGE_TABS_LIST', newTabsList);
  } else if (to.meta.module === 'base') {
    store.commit('tabs/UPDATE_TABS_LIST', {
      title: to.meta.title,
      url: to.fullPath,
      meta: to.meta,
    });
  }
  store.commit('tabs/UPDATE_CURRENT_PAGE', to.fullPath);
  const token = getStorageToken();
  if (to && to.path === '/' && sessionStorage.getItem('DEFAULT_MENU')) {
    next(sessionStorage.getItem('DEFAULT_MENU'));
  } else {
    const toLogin =
      to.fullPath === '/login' ||
      to.path === '/loginAuto' ||
      to.path === '/loginDing' ||
      to.fullPath === '/loginOut';
    if (token || toLogin) {
      let menuList = sessionStorage.getItem('menus')
        ? JSON.parse(sessionStorage.getItem('menus'))
        : [];
      let falg = menuList.find((item) => to.fullPath.includes(item));
      if (
        to.fullPath == '/' ||
        to.path == '/loginAuto' ||
        to.path == '/loginDing' ||
        to.fullPath == '/login' ||
        to.fullPath === '/loginOut'
      ) {
        next();
      } else {
        next();
      }
    } else {
      next('/login');
    }
  }
});

router.afterEach((to, from) => {
  if (to.meta.busiType) {
    let params = {
      moduleCode: to.meta.busiType,
      requestAddr: window.location.href,
      operatorType: navigator.userAgent.match(
        /(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i
      )
        ? 2
        : 1,
      operateName: '',
      operateIp: sessionStorage.getItem('IP'),
      status: 1,
      buriedPointType: 1,
    };
    if (JSON.parse(sessionStorage.getItem('userInfo'))) {
      params.operateName = JSON.parse(sessionStorage.getItem('userInfo')).fullname;
      // buriedPointSave(params);
    } else {
      api_getUserByToken().then((response) => {
        params.operateName = response.data.fullname;
        // buriedPointSave(params);
      });
    }
  }
});

router.beforeResolve((to, from, next) => {
  store.commit('tabs/TO_PATH', to.fullPath);
  next();
});

export default router;