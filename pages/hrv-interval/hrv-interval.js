// pages/AvgHR/AvgHR.js
import Protocol from "../../apis/network/protocol";

Page({

    data: {
        lineColor: [
            {color: '#EF3A59', text: '非常低'},
            {color: '#FC7648', text: '低'},
            {color: '#FDC400', text: '正常偏低'},
            {color: '#5ACD4E', text: '正常'},
        ],
        lineNum: [20, 35, 50]
    },
    onLoad(options) {
        console.log(options);
        this.dataId = options.dataId;
        Protocol.getHrvInterval({id: this.dataId}).then(data => {
            const {result, result: {frequency, title}} = data;
            let fre = parseInt(frequency) || 0, titleColor = '', position = 0, maxNum = 150, iconWidth = 2,
                maxPosition = 96;//iconWidth=2 是2%的意思
            const {lineNum} = this.data;
            if (fre <= lineNum[0]) {
                position = (0.25 / lineNum[0] * fre * 100 - iconWidth).toFixed(3) + '%';
            } else if (fre <= lineNum[1]) {
                position = (25 + 0.25 / (lineNum[1] - lineNum[0]) * (fre - lineNum[0]) * 100 - iconWidth).toFixed(3) + '%';
            } else if (fre <= lineNum[2]) {
                position = (50 + 0.25 / (lineNum[2] - lineNum[1]) * (fre - lineNum[1]) * 100 - iconWidth).toFixed(3) + '%';
            } else {
                position = (75 + 0.25 / (maxNum - lineNum[2]) * (fre - lineNum[2]) * 100 - iconWidth);
                position = position <= maxPosition ? position : maxPosition;
                position = position.toFixed(3) + '%';
            }

            this.setData({
                position,
                result
            });
            wx.setNavigationBarTitle({title});
        });
    },

})
