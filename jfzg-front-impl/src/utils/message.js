import { Message } from 'element-ui'

export function showSuccTips(tips){
  Message({
    message: tips,
    type: 'success'
  })
}

export function showErrorTips(tips){
  Message({
    message: tips,
    type: 'error'
  })
}