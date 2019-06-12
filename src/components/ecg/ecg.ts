// 此文件是由模板文件 ".dtpl/component/$rawModuleName.ts.dtpl" 生成的，你可以自行修改模板

import { MyComponent, comify, wxp } from 'base'
import "../../extensions/ArrayBuffer.ext"

interface ECGPoint {
  index: number
  adGain: number
  x: number
  y: number
}

interface ECGData {
  width: number
  height: number
  rpx: number
  baseY: number
  baseX: number
  ctx?: wxp.CanvasContext
  lastPoint: ECGPoint
  readonly sampleHz: number
  readonly adGain: number           // 增益
  readonly sampleBase: number
  readonly speed: number            // 走纸速度 25mm/s
  readonly calibration: number      // 定标电压 1mv/10mm
  readonly pxmm: number
  readonly px1sec: number
  readonly px1mv: number,
  animationId: any,
  sampleData?: Uint16Array,
  continueAnimation: boolean,
  terminated: boolean,
  showColumnAndRowLine: boolean;
}

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
  data: ECGData = {
    width: 0,
    height: 0,
    rpx: 1,
    baseX: 0,
    baseY: 0,
    ctx: undefined,
    lastPoint: {
      index: 0,
      adGain: 0,
      x: 0,
      y: 0
    },
    sampleHz: 200,
    adGain: 840,          // 增益
    sampleBase: 3200,
    speed: 25.0,          // 走纸速度 25mm/s
    calibration: 10,      // 定标电压 1mv/10mm
    pxmm: 4,
    px1mv: 4 * 10,
    px1sec: 4 * 25.0,
    animationId: undefined,
    sampleData: undefined,
    continueAnimation: false,
    terminated: false,
    showColumnAndRowLine: false
  }

  /**
   * 组件的可选项
   */
  options = {
    multipleSlot: true
  }

  /**
   * 组件属性值有更新时会调用此函数，不需要在 properties 中设置 observer 函数
   */
  onPropUpdate(prop: string, newValue: any, oldValue: any) {

  }

  preparePannel(w: number, h: number) {
    console.log(`Canvas size(${w}, ${h})`)
    let that = this

    const rw = w * that.data.rpx
    const rh = h * that.data.rpx
    const offsetX = 0
    const offsetY = 0

    that.setDataSmart({
      width: rw,
      height: rh
    })
    let ctx = wxp.createCanvasContext("√", that)

    ctx.fillStyle = "rgba(255, 255, 255, 1)"
    ctx.fillRect(0, 0, rw, rh)

    const d = that.data.pxmm
    // 绘制竖行网格
    for (var i = 0; i < rw / d; i++) {
      if (i % 5 == 0) {
        ctx.strokeStyle = "rgba(255, 0, 0, 6)"
        ctx.lineWidth = 0.5
      } else {
        ctx.strokeStyle = "rgba(255, 0, 0, 3)"
        ctx.lineWidth = 0.1
      }
      let x = i * d + offsetX
      ctx.beginPath()
      ctx.moveTo(x, offsetY)
      ctx.lineTo(x, offsetY + rh)
      ctx.stroke()
      ctx.closePath()
    }

    // 绘制横行网格
    for (var j = 0; j < rh / d; j++) {
      if (j % 5 == 0) {
        ctx.strokeStyle = "rgba(255, 0, 0, 6)"
        ctx.lineWidth = 0.5
      } else {
        ctx.strokeStyle = "rgba(255, 0, 0, 3)"
        ctx.lineWidth = 0.1
      }
      let y = j * d + offsetY
      ctx.beginPath()
      ctx.moveTo(offsetX, y)
      ctx.lineTo(rw + offsetX, y)
      ctx.stroke()
      ctx.closePath()
    }

    that.data.baseY = rh / (2 * d) * d + offsetY

    ctx.draw()

    that.data.ctx = wxp.createCanvasContext('ecg_draw', that)
    ctx = that.data.ctx

    ctx.fillStyle = "rgba(255, 255, 255, 0)"
    ctx.fillRect(0, 0, rw, rh)
    ctx.draw()

    that.data.ctx = ctx
  }

  drawWave(data: ArrayBuffer) {
    let that = this

    if (!that.data.ctx) {
      console.log('canvas context empty...')
      return
    }
    const ctx = that.data.ctx

    ctx.strokeStyle = "black"
    ctx.setLineJoin("round")
    ctx.lineWidth = 1.5

    const px1sec = that.data.px1sec
    const px1mv = that.data.px1mv

    let buffer = new Uint16Array(data)

    let x = 0
    let y = 0
    let nextX = 0
    let nextY = 0
    buffer.forEach((gain) => {
      if (0 > that.data.lastPoint.index) {
        that.data.lastPoint.index = 0
        that.data.lastPoint.adGain = gain
        that.data.lastPoint.x = that.data.baseX
        that.data.lastPoint.y = that.data.baseY
        return
      }
      x = that.data.lastPoint.x
      y = that.data.lastPoint.y
      let lastGain = that.data.lastPoint.adGain
      nextX = x + px1sec / that.data.sampleHz
      nextY = y + (gain - lastGain) * px1mv / that.data.adGain
      if (nextX > that.data.width) {
        // 重置起始点
        // ctx.fillStyle = "rgba(255, 255, 255, 0)"
        // ctx.fillRect(0, 0, that.data.width, that.data.height)
        ctx.clearRect(0, 0, that.data.width, that.data.height)
        ctx.draw()

        x = that.data.baseX
        y = that.data.baseY

        nextX = x + px1sec / that.data.sampleHz
        nextY = y + (gain - lastGain) * px1mv / that.data.adGain
      }
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(nextX, nextY)
      ctx.stroke()
      ctx.closePath()

      that.data.lastPoint.index++
      that.data.lastPoint.adGain = gain
      that.data.lastPoint.x = nextX
      that.data.lastPoint.y = nextY
    })

    ctx.draw(true)
  }

  drawWaveDark(data: ArrayBuffer) {
    let that = this

    if (!that.data.ctx) {
      console.log('canvas context empty...')
      return
    }
    const ctx = that.data.ctx

    ctx.strokeStyle = "#3993EE"
    ctx.setLineJoin("round")
    ctx.lineWidth = 1.5

    let buffer = new Uint16Array(data)

    const speed = that.data.px1sec / that.data.sampleHz
    const yunit = that.data.px1mv / that.data.adGain
    // const scanBarWidth = 30
    // const h = that.data.height
    let opx = that.data.lastPoint.x, opy = that.data.lastPoint.y || that.data.baseY
    let px = opx
    let py = opy
    let ogn = that.data.lastPoint.adGain || buffer[0]

    ctx.beginPath()
    ctx.moveTo(opx, opy)
    buffer.forEach((gain, index) => {
      px += speed
      py += ((gain - ogn) * yunit)
      // ctx.clearRect(px, 0, scanBarWidth, h)
      ctx.lineTo(px, py)
      ctx.stroke()
      // ctx.closePath()
      // console.log(`line -- from(${opx},${opy}) to (${px},${py})`)

      opx = px
      opy = py
      ogn = gain

      if (px > that.data.width) {
        ctx.closePath()
        ctx.clearRect(0, 0, that.data.width + 20, that.data.height)
        px = opx = -speed
        py = opy = that.data.baseY
        ctx.beginPath()
        ctx.moveTo(opx, opy)
      }

      if (index == (buffer.length - 1)) {
        that.data.lastPoint.index += index
        that.data.lastPoint.adGain = ogn
        that.data.lastPoint.x = px
        that.data.lastPoint.y = py
      }
    })

    ctx.draw(true)
  }

  preparePannelDark(w: number, h: number, bgColor: string) {
    console.log(`Canvas size(${w}, ${h})`)
    let that = this
    const rw = w * that.data.rpx
    const rh = h * that.data.rpx
    const r = rw / 10;

    const offsetX = 0
    const offsetY = 0

    that.setDataSmart({
      width: rw,
      height: rh
    })
    let ctx = wxp.createCanvasContext("ecg_bg", that)

    ctx.fillStyle = bgColor || 'transparent';
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(rw - r, 0);
    ctx.arcTo(rw, 0, rw, r, r);
    ctx.lineTo(rw, rh);
    ctx.lineTo(0, rh);
    ctx.lineTo(0, rh-r);
    ctx.arcTo(0, 0, r, 0, r);
    ctx.closePath();
    ctx.fill();

    const d = that.data.pxmm
    // // 绘制竖行网格
    if (that.data.showColumnAndRowLine) {
      for (var i = 0; i < rw / d; i++) {
        if (i % 5 == 0) {
          ctx.strokeStyle = "#1b4200"
          ctx.lineWidth = 0.8
        } else {
          ctx.strokeStyle = "#092100"
          ctx.lineWidth = 0.4
        }
        let x = i * d + offsetX;
        ctx.beginPath();
        ctx.moveTo(x, offsetY);
        ctx.lineTo(x, offsetY + rh);
        ctx.stroke();
        ctx.closePath();
      }

      // 绘制横行网格
      for (var j = 0; j < rh / d; j++) {
        if (j % 5 == 0) {
          ctx.strokeStyle = "#1b4200"
          ctx.lineWidth = 0.8
        } else {
          ctx.strokeStyle = "#092100"
          ctx.lineWidth = 0.4
        }
        let y = j * d + offsetY
        ctx.beginPath()
        ctx.moveTo(offsetX, y)
        ctx.lineTo(rw + offsetX, y)
        ctx.stroke()
        ctx.closePath()
      }
    }


    that.data.baseY = rh / (2 * d) * d + offsetY

    ctx.draw()

    that.data.ctx = wxp.createCanvasContext('ecg_draw', that)
    ctx = that.data.ctx

    ctx.fillStyle = "transparent"
    ctx.fillRect(0, 0, rw, rh)
    ctx.draw()

    that.data.ctx = ctx
  }

  drawWaveAnimation(data: ArrayBuffer, terminated = false) {
    let that = this

    if (!that.data.sampleData) {
      that.data.sampleData = new Uint16Array(data)
    } else {
      that.data.sampleData = new Uint16Array(that.data.sampleData.buffer.concat(data))
    }

    that.data.terminated = terminated

    if (that.data.continueAnimation) {
      return
    }

    console.log("Initial wave start...")
    if (!that.data.ctx) {
      console.log('canvas context empty...')
      return
    }
    const ctx = that.data.ctx

    ctx.strokeStyle = "#76f112"
    ctx.setLineJoin("round")
    ctx.lineWidth = 1.5

    const px1sec = that.data.px1sec
    const px1mv = that.data.px1mv

    const speed = px1sec / that.data.sampleHz
    const yunit = px1mv / that.data.adGain
    const scanBarWidth = that.data.width // 30
    const h = that.data.height
    let opx = that.data.lastPoint.x, opy = that.data.lastPoint.y || that.data.baseY
    let px = opx
    let py = opy
    let ogn = that.data.lastPoint.adGain || that.data.sampleData[0]
    let index = that.data.lastPoint.index ? 0 : 1

    that.animation(() => {
      if (!that.data.sampleData) {
        console.log("sample data empty...")
        return
      }

      if (!ctx) {
        console.log("canvas context empty...")
        return
      }

      px += speed
      py += ((that.data.sampleData[index] - ogn) * yunit)
      ctx.clearRect(px, 0, scanBarWidth, h)
      ctx.beginPath()
      ctx.moveTo(opx, opy)
      ctx.lineTo(px, py)
      ctx.stroke()
      ctx.draw(true)
      // console.log(`line -- from(${opx},${opy}) to (${px},${py})`)

      opx = px
      opy = py
      ogn = that.data.sampleData[index]
      index++

      if (px > that.data.width) {
        px = opx = -speed
        py = opy = that.data.baseY
      }

      if (index == that.data.sampleData.length && that.data.terminated) {
        that.data.lastPoint.index += index - 1
        that.data.lastPoint.adGain = ogn
        that.data.lastPoint.x = px
        that.data.lastPoint.y = py

        that.cancelAnimation()

        console.log('wave draw finished, trigger event to listner...')
        that.triggerEvent('finish', { /*data: that.data.sampleData*/ }, { bubbles: true })
      }
    })

  }


  resetPannel() {
    let that = this
    let ctx: any = that.data.ctx

    ctx.clearRect(0, 0, that.data.width, that.data.height)
    ctx.draw()

    that.data.lastPoint = {
      index: 0,
      adGain: 0,
      x: 0,
      y: 0
    }
  }

  _runEvent() {
    this.triggerEvent('runEvent', {}, {})
  }

  onCreated() {
    let that = this
    that.data.rpx = 1; // wxp.getSystemInfoSync().windowWidth / 375
  }

  onReady() {
    // this.data.ctx = wxp.createCanvasContext('ecg_bg', this)
  }

  requestAnimationFrame() {
    // if (typeof requestAnimationFrame !== 'undefined') {
    //   return requestAnimationFrame
    // } else if (typeof webkitRequestAnimationFrame !== 'undefined') {
    //   return webkitRequestAnimationFrame
    // } else if (typeof mozRequestAnimationFrame !== 'undefined') {
    //   return mozRequestAnimationFrame
    // } else {
      return (callback: (...args: any[]) => void) => {
        setTimeout(callback, 5)
    //   }
    }
  }

  cancelAnimationFrame() {
    // if (typeof cancelAnimationFrame !== 'undefined') {
    //   return cancelAnimationFrame;
    // } else if (typeof webkitCancelRequestAnimationFrame !== 'undefined') {
    //   return webkitCancelRequestAnimationFrame;
    // } else if (typeof webkitCancelAnimationFrame !== 'undefined') {
    //   return webkitCancelAnimationFrame;
    // } else if (typeof mozCancelRequestAnimationFrame !== 'undefined') {
    //   return mozCancelRequestAnimationFrame
    // } else if (typeof mozCancelAnimationFrame !== 'undefined') {
    //   return mozCancelAnimationFrame
    // } else {
      return (timer: NodeJS.Timer) => {
        return clearTimeout(timer)
      }
    // }
  }

  animation(callback: (...args: any[]) => void) {
    let that = this

    that.data.continueAnimation = true
    let requestAnimation = this.requestAnimationFrame()
    let animationCallback = () => {
      callback()
      that.data.animationId = requestAnimation(animationCallback)
    }
    that.data.animationId = requestAnimation(animationCallback)
  }

  cancelAnimation() {
    let that = this

    let cancel = that.cancelAnimationFrame()
    cancel(that.data.animationId)
    that.data.continueAnimation = false
  }

  drawWaveShit(data: ArrayBuffer) {
    let that = this

    if (!that.data.sampleData) {
      that.data.sampleData = new Uint16Array(data)
    } else {
      that.data.sampleData = new Uint16Array(that.data.sampleData.buffer.concat(data))
    }

    if (that.data.continueAnimation) {
      return
    }

    console.log("Initial wave-shift start...")
    if (!that.data.ctx) {
      console.log('canvas context empty...')
      return
    }
    const ctx = that.data.ctx

    ctx.strokeStyle = "#76f112"
    ctx.setLineJoin("round")
    ctx.lineWidth = 1.5

    const px1sec = that.data.px1sec
    const px1mv = that.data.px1mv

    const speed = px1sec / that.data.sampleHz
    const yunit = px1mv / that.data.adGain
    const scanBarWidth = 20
    const h = that.data.height
    let opx = that.data.lastPoint.x, opy = that.data.lastPoint.y || that.data.baseY
    let px = opx
    let py = opy
    let ogn = that.data.lastPoint.adGain || that.data.sampleData[0]
    let index = that.data.lastPoint.index ? 0 : 1

    that.animation(() => {
      if (!that.data.sampleData) {
        console.log("sample data empty...")
        return
      }

      if (!ctx) {
        console.log("canvas context empty...")
        return
      }

      px += speed
      py += ((that.data.sampleData[index] - ogn) * yunit)
      ctx.clearRect(px, 0, scanBarWidth, h)
      ctx.beginPath()
      ctx.moveTo(opx, opy)
      ctx.lineTo(px, py)
      ctx.stroke()
      ctx.draw()
      // console.log(`line -- from(${opx},${opy}) to (${px},${py})`)

      opx = px
      opy = py
      ogn = that.data.sampleData[index]
      index++

      if (px > that.data.width) {
        px = opx = -speed
      }

      if (index == that.data.sampleData.length) {
        that.data.lastPoint.index += index - 1
        that.data.lastPoint.adGain = ogn
        that.data.lastPoint.x = px
        that.data.lastPoint.y = py

        that.cancelAnimation()
      }
    })
  }

}

