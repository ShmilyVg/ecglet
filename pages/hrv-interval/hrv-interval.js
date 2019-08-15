// pages/AvgHR/AvgHR.js
import Protocol from "../../apis/network/protocol";

Page({

  data: {
    lineColor: [
      {color: '#FC7648', text: '非常低'},
      {color: '#FDC400', text: '低'},
      {color: '#5ACD4E', text: '正常偏低'},
      {color: '#4BABEA', text: '正常'},
    ],
    lineNum: [20, 35, 50]
  },
  onLoad(options) {
    console.log(options);
    this.dataId = options.dataId;
    Protocol.getHrvInterval({id: this.dataId}).then(data => {
      const {result, result: {frequency}} = data;
      let fre = parseInt(frequency) || 0, titleColor = '', position = 0, maxNum = 150, iconWidth = 2;//iconWidth=2 是2%的意思
      const {lineNum, lineColor} = this.data;
      if (fre <= lineNum[0]) {
        position = (0.25 / lineNum[0] * fre * 100 - iconWidth).toFixed(3) + '%';
        titleColor = lineColor[0].color;
      } else if (fre <= lineNum[1]) {
        position = (25 + 0.25 / (lineNum[1] - lineNum[0]) * (fre - lineNum[0]) * 100 - iconWidth).toFixed(3) + '%';
        titleColor = lineColor[1].color;
      } else if (fre <= lineNum[2]) {
        position = (50 + 0.25 / (lineNum[2] - lineNum[1]) * (fre - lineNum[1]) * 100 - iconWidth).toFixed(3) + '%';
        titleColor = lineColor[2].color;
      } else {
        position = (75 + 0.25 / (maxNum - lineNum[2]) * (fre - lineNum[2]) * 100 - iconWidth);
        position = position <= (100 - iconWidth) ? position : 100 - iconWidth;
        position = position.toFixed(3) + '%';
        titleColor = lineColor[3].color;
      }

      this.setData({
        position,
        titleColor,
        result
      });
    });
  },

})
