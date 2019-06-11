// 此文件是由模板文件 ".dtpl/component/$rawModuleName.ts.dtpl" 生成的，你可以自行修改模板

import { MyComponent, comify, wxp } from 'base'
// import { CanvasUtils } from 'minapp-canvas-utils'

@comify()
export default class extends MyComponent {
  /**
   * 组件的属性列表
   */
  properties = {
    bg: {
      type: String,
      value: 'bg'
    },
    draw: {
      type: String,
      value: 'draw'
    }
  }

  /**
   * 组件的初始数据
   */
  data = {
    size: 0,
    step: 1,
    num: 100,
    rpx: 1,
  }

  options = {
    multipleSlot: true
  }

  drawCircleBg(id: string, radius: number, width: number) {
    let that = this
    const r = radius * that.data.rpx
    const w = width * that.data.rpx
    that.setDataSmart({
      size: 2 * r
    })
    const ctx = wxp.createCanvasContext(id, that)
    ctx.setLineWidth(w / 2)
    // ctx.setStrokeStyle('#20183b')
    ctx.setStrokeStyle('#bbb')
    ctx.setLineCap('round')
    ctx.beginPath()
    ctx.arc(r, r, r - w, 0, 2 * Math.PI, false)
    ctx.stroke()
    ctx.draw()
  }

  drawCircle(id: string, radius: number, width: number, step: number) {
    let that = this
    const r = radius * that.data.rpx
    const w = width * that.data.rpx
    const ctx = wxp.createCanvasContext(id, that)
    // const gradient = ctx.createLinearGradient(2 * r, r, r, 0)
    // gradient.addColorStop(0, '#2661DD')
    // gradient.addColorStop(0.5, '#40ED94')
    // gradient.addColorStop(1.0, '#5956CC')
    // gradient.addColorStop(0, '#67a445')
    // gradient.addColorStop(0.9, '#0d69b1')
    // gradient.addColorStop(1.0, '#67a445')
    ctx.setLineWidth(width / 2 + 1)
    // ctx.setStrokeStyle(gradient);
    ctx.setStrokeStyle("#0d69b1")
    ctx.setLineCap('round')
    ctx.beginPath()
    ctx.arc(r, r, r - w, -Math.PI / 2, step * Math.PI - Math.PI / 2, false)
    ctx.stroke()
    ctx.draw()
  }

  _runEvent() {
    this.triggerEvent('runEvent', {}, {})
  }

  /**
   * 组件属性值有更新时会调用此函数，不需要在 properties 中设置 observer 函数
   */
  onPropUpdate(prop: string, newValue: any, oldValue: any) {

  }

  onCreated() {
    let that = this
    that.data.rpx = wxp.getSystemInfoSync().windowWidth / 375
  }
}

