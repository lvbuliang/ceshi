// 集中导出mock数据
import { mockXHR } from 'wl-http'
import appConfig from './app-configs'
import appConfigProd from './app-configs-prod'
let mocks = []
if (process.env.NODE_ENV === 'development') {
  mocks = [
    {
      intercept: true,
      fetchs: appConfig
    }
  ];
} else {
  mocks = [
    {
      intercept: true,
      fetchs: appConfigProd
    }
  ];
}

// 注册mock数据
mockXHR(mocks)
