/**
 * Created by Haoyu on 19/7/23
 */
export default {
  data: {
    percentage: '', //百分比
    animTime: '', // 动画执行时间
  },
  options: {
    // 绘制圆形进度条方法
    run(c, w, h) {
      let that = this;
      //Math.PI 180
      const num = (2 * Math.PI / 100 * c) - 0.5 * Math.PI,lineWidth = 9;
      that.data.ctx2.arc(w, h, w - 4, -0.5 * Math.PI, num); //每个间隔绘制的弧度
      //that.data.ctx2.setStrokeStyle("#00c6bc");
      //颜色渐变 XY
      var gradient = that.data.ctx2.createLinearGradient(0, 170);
      gradient.addColorStop("0", "#00BFB5");
      gradient.addColorStop("0.6", "#00C6BC");
      gradient.addColorStop("0.99", "#AFEAE7");
      that.data.ctx2.strokeStyle = gradient;
      that.data.ctx2.lineWidth = lineWidth;
      //线头圆形
      that.data.ctx2.setLineCap("round");
      that.data.ctx2.stroke();
      that.data.ctx2.beginPath();
      that.data.ctx2.setFillStyle("#00c6bc");
      that.data.ctx2.setTextAlign("center");
      that.data.ctx2.setTextBaseline("middle");
      that.data.ctx2.setFontSize(35); //注意不要加引号
      if(c<100){
        that.data.ctx2.fillText(c, w - 10, h);
        that.data.ctx2.setFontSize(15);
        that.data.ctx2.fillText("分", w + 20, h + 7);
      }else{
        that.data.ctx2.fillText(c, w - 10, h);
        that.data.ctx2.setFontSize(15);
        that.data.ctx2.fillText("分", w + 30, h + 7);
      }

      that.data.ctx2.draw();
    },
    /**
     * start 起始百分比
     * end 结束百分比
     * w,h 其实就是圆心横纵坐标
     */
    // 动画效果实现
    canvasTap(start, end, time, w, h) {
      var that = this;
      start++;
      if (start > end) {
        return false;
      }
      that.run(start, w, h);
      setTimeout(function () {
        that.canvasTap(start, end, time, w, h);
      }, time);
    },
    /**
     * id----------------canvas画板id
     * percent-----------进度条百分比
     * time--------------画图动画执行的时间
     */
    draw: function (id, percent, animTime) {
      var that = this;
      const ctx2 = wx.createCanvasContext(id);
      that.setData({
        ctx2: ctx2,
        percentage: percent,
        animTime: animTime
      }, () => {
          var time = that.data.animTime / that.data.percentage + 10;
          console.log(time)
          setTimeout(() => {
              wx.createSelectorQuery().select('#' + id).boundingClientRect(function (rect) { //监听canvas的宽高
                  var w = parseInt(rect.width / 2); //获取canvas宽的的一半
                  var h = parseInt(rect.height / 2); //获取canvas高的一半，
                console.log('canvas score的信息',rect);
                that.canvasTap(0, that.data.percentage, time, w, h)
              }).exec();
          }, 100);

      });

    },
  }
}
