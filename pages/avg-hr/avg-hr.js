// pages/AvgHR/AvgHR.js
import Protocol from "../../apis/network/protocol";

Page({

    data: {
        lineColor: [
            {color: '#4BABEA', text: '严重心动过缓'},
            {color: '#5ACD4E', text: '心动过缓'},
            {color: '#FDC400', text: '正常'},
            {color: '#FC7648', text: '轻度心动过速'},
            {color: '#EF3A59', text: '心动过速'}
        ],
        lineNum: [50, 60, 90, 100]
    },
    onLoad(options) {
        console.log(options);
        this.dataId = options.dataId;
        Protocol.getHrInterval({id: this.dataId}).then(data => {
            const {result, result: {frequency, title}} = data;
            let fre = parseInt(frequency) || 0, titleColor = '', position = 0, maxNum = 200, iconWidth = 2,
                maxPosition = 96;//iconWidth=2 是2%的意思
            const {lineNum} = this.data;
            if (fre <= lineNum[0]) {
                position = (0.2 / lineNum[0] * fre * 100 - iconWidth).toFixed(3) + '%';
            } else if (fre <= lineNum[1]) {
                position = (20 + 0.2 / (lineNum[1] - lineNum[0]) * (fre - lineNum[0]) * 100 - iconWidth).toFixed(3) + '%';
            } else if (fre <= lineNum[2]) {
                position = (40 + 0.2 / (lineNum[2] - lineNum[1]) * (fre - lineNum[1]) * 100 - iconWidth).toFixed(3) + '%';
            } else if (fre <= lineNum[3]) {
                position = (60 + 0.2 / (lineNum[3] - lineNum[2]) * (fre - lineNum[2]) * 100 - iconWidth).toFixed(3) + '%';
            } else {
                position = (80 + 0.2 / (maxNum - lineNum[3]) * (fre - lineNum[3]) * 100 - iconWidth);
                console.log('位置1', position);
                position = position <= maxPosition ? position : maxPosition;
                console.log('位置2', position);

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
