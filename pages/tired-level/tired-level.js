// pages/AvgHR/AvgHR.js
import Protocol from "../../apis/network/protocol";

Page({

    data: {
        lineColor: [
            {color: '#4BABEA', text: '能量充沛'},
            {color: '#5ACD4E', text: '能量有所消耗'},
            {color: '#FDC400', text: '轻度疲劳'},
            {color: '#FC7648', text: '过度疲劳'},
        ],
        lineNum: [25, 50, 75]
    },
    onLoad(options) {
        console.log(options);
        this.dataId = options.dataId;
        Protocol.getRmssdInterval({id: this.dataId}).then(data => {
            const {result, result: {frequency, title}} = data;
            let fre = parseInt(frequency) || 0, icon = '', position = 0;//iconWidth=2 是2%的意思
            const {lineNum} = this.data;
            if (fre <= lineNum[0]) {
                position = '6.5%';
                icon = 'pl1';
            } else if (fre <= lineNum[1]) {
                position = '30.5%';
                icon = 'pl2';
            } else if (fre <= lineNum[2]) {
                position = '56.5%';
                icon = 'pl3';
            } else {
                position = '81.5%';
                icon = 'pl4';
            }

            this.setData({
                position,
                icon,
                result
            });
            wx.setNavigationBarTitle({title});
        });
    },

})
