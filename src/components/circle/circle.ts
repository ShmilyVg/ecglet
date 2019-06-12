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
    ctx: {}
  }

  options = {
    multipleSlot: true
  }

  drawCircleBg(id: string, radius: number) {
    //源代码 start------------
    // let that = this
    // const r = radius * that.data.rpx
    // const w = width * that.data.rpx
    // that.setDataSmart({
    //   size: 2 * r
    // })
    // const ctx = wxp.createCanvasContext(id, that)
    // ctx.setLineWidth(w / 2)
    // // ctx.setStrokeStyle('#20183b')
    // ctx.setStrokeStyle('#bbb')
    // ctx.setLineCap('round')
    // ctx.beginPath()
    // ctx.arc(r, r, r - w, 0, 2 * Math.PI, false)
    // ctx.stroke()
    // ctx.draw()
    //源代码 end------------

    this.drawCircle(id, radius,-1);
  }

  drawCircle(id: string, radius: number, step: number) {
    let that = this
    const r = radius * that.data.rpx
    that.setDataSmart({
      size: 2 * r
    });
    const ctx = wxp.createCanvasContext(id, that), x1 = r, smallRadius = r / 12, y1 = smallRadius,
        wholeDegree = 2 * Math.PI, a = 2 * Math.PI / 15, circleRadius = r - smallRadius, maxPointNum = 15,
        currentStep = Math.ceil(step / 2);
    console.log(currentStep);

    let x = x1, y = y1;
    for (let i = 1; i <= maxPointNum; i++) {
      ctx.beginPath();
      ctx.setFillStyle(currentStep >= i ? 'white' : '#257AD1');
      ctx.arc(x, y, smallRadius, 0, wholeDegree, false);
      ctx.fill();
      const degree = a * i;
      x = x1 + circleRadius * Math.sin(degree);
      y = y1 + circleRadius - circleRadius * Math.cos(degree);
    }
    ctx.draw();

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

