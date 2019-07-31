// 此文件是由模板文件 ".dtpl/component/$rawModuleName.ts.dtpl" 生成的，你可以自行修改模板

Component({
  properties : {
    bg: {
      type: String,
      value: 'bg'
    },
    draw: {
      type: String,
      value: 'draw'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
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
    showColumnAndRowLine: true
  },

  /**
   * 组件的可选项
   */
  options: {
    multipleSlot: true
  },
  methods:{
    preparePannelDark(w, h) {
      console.log(`Canvas size(${w}, ${h})`)
      let that = this
      const rw = w * that.data.rpx
      const rh = h * that.data.rpx
      const r = rw / 10;

      const offsetX = 0
      const offsetY = 0

      that.setData({
        width: rw,
        height: rh
      },()=>{
        let ctx = wx.createCanvasContext("ecg_bg", that)
        console.log('ecg_bg canvas:',ctx);
        ctx.fillStyle = 'white';
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
        // ctx.setShadow(0, 2, 9, 'rgba(101,101,101,0.07)');
        const d = that.data.pxmm
        // // 绘制竖行网格
        // if (that.data.showColumnAndRowLine) {
        if (that.data.showColumnAndRowLine) {
          for (var i = 0; i < rw / d; i++) {
            if (i % 5 == 0) {
              ctx.strokeStyle = "#eeeeee"
              ctx.lineWidth = 0.8
            } else {
              ctx.strokeStyle = "#eeeeee"
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
              ctx.strokeStyle = "#eeeeee"
              ctx.lineWidth = 0.8
            } else {
              ctx.strokeStyle = "#eeeeee"
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

        ctx.fillStyle = '#3a93ef';
        ctx.beginPath();
        ctx.moveTo(0, r);
        ctx.lineTo(0, 0);
        ctx.lineTo(r, 0);
        ctx.arcTo(0, 0, 0, r, r);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();

        ctx.moveTo(rw - r, 0);
        ctx.lineTo(rw, 0);
        ctx.lineTo(rw, r);
        ctx.arcTo(rw, 0, rw - r, 0, r);
        ctx.closePath();
        ctx.fill();
        that.data.baseY = rh / (2 * d) * d + offsetY

        ctx.draw()
        console.log('ecg_bg canvas绘制完成');
        let ctx2 = wx.createCanvasContext('ecg_draw', that)
        // ctx = that.data.ctx

        ctx2.fillStyle = "transparent"
        ctx2.fillRect(0, 0, rw, rh)
        ctx2.draw();
        this.setCanvasDefaultOptions(ctx2);
        that.data.ctx = ctx2;
      })
    },

    setCanvasDefaultOptions(ctx) {
      ctx.strokeStyle = "#3993EE";
      ctx.setLineJoin("round");
      ctx.lineWidth = 1.2;
    },

    drawWaveDark(data) {
      let that = this

      if (!that.data.ctx) {
        console.log('canvas context empty...')
        return
      }
      const ctx = that.data.ctx;


      let buffer = new Uint16Array(data);

      const speed = that.data.px1sec / that.data.sampleHz;
      const yunit = that.data.px1mv / that.data.adGain;
      // const scanBarWidth = 30
      // const h = that.data.height
      let opx = that.data.lastPoint.x, opy = that.data.lastPoint.y || that.data.baseY;
      let px = opx;
      let py = opy;
      let ogn = that.data.lastPoint.adGain || buffer[0];
      ctx.beginPath();
      ctx.moveTo(opx, opy);
      // console.log('传入的数据',buffer);
      const len = buffer.length;
      let reserve = true,isOverWidth = false;
      buffer.forEach((gain, index) => {
        px += speed;
        py += ((gain - ogn) * yunit);
        // ctx.clearRect(px, 0, scanBarWidth, h)
        ctx.lineTo(px, py);
        ctx.stroke();

        // ctx.closePath()
        // console.log(`line -- from(${opx},${opy}) to (${px},${py})`)

        opx = px;
        opy = py;
        ogn = gain;

        if (px > that.data.width) {
          console.log('已经越界', buffer);
          ctx.closePath();
          ctx.draw(false);
          // ctx.clearRect(0, 0, that.data.width + 20, that.data.height);
          reserve = false;
          px = opx = -speed;
          py = opy = that.data.baseY;
          this.setCanvasDefaultOptions(ctx);
          ctx.beginPath();
          ctx.moveTo(opx, opy);
        }

        if (index === (len - 1)) {
          that.data.lastPoint.index += index;
          that.data.lastPoint.adGain = ogn;
          that.data.lastPoint.x = px;
          that.data.lastPoint.y = py;
        }
      });

      //本次绘制是否接着上一次绘制。
      // 即 reserve 参数为 false，则在本次调用绘制之前 native 层会先清空画布再继续绘制；
      // 若 reserve 参数为 true，则保留当前画布上的内容，本次调用 drawCanvas 绘制的内容覆盖在上面，
      // 默认 false。
      ctx.draw(reserve);
    },

    resetPannel() {
      let that = this
      let ctx = that.data.ctx

      ctx.clearRect(0, 0, that.data.width, that.data.height)
      ctx.draw()

      that.data.lastPoint = {
        index: 0,
        adGain: 0,
        x: 0,
        y: 0
      }
    },

    _runEvent() {
      this.triggerEvent('runEvent', {}, {})
    },
  },
  lifetimes:{
    created() {
      let that = this
      that.data.rpx = 1; // wx.getSystemInfoSync().windowWidth / 375
    },
  },

});

