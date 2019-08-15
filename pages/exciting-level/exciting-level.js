// pages/AvgHR/AvgHR.js
import Protocol from "../../apis/network/protocol";

Page({

    data: {
        lineColor: [
            {color: '#4BABEA', text: '放松/不兴奋'},
            {color: '#5ACD4E', text: '神经有点兴奋'},
            {color: '#FDC400', text: '神经比较兴奋'},
            {color: '#FC7648', text: '神经特别兴奋'},
        ],
        lineNum: [1, 5, 10]
    },
    onLoad(options) {
        console.log(options);
        this.dataId = options.dataId;
        Protocol.getMoodInterval({id: this.dataId}).then(data => {
            const {result, result: {frequency, title}} = data;
            let fre = parseInt(frequency) || 0, icon = '', position = 0;//iconWidth=2 是2%的意思
            const {lineNum} = this.data;
            if (fre <= lineNum[0]) {
                position = '6.5%';
                icon = 'e1';
            } else if (fre <= lineNum[1]) {
                position = '30.5%';
                icon = 'e2';
            } else if (fre <= lineNum[2]) {
                position = '56.5%';
                icon = 'e3';
            } else {
                position = '81.5%';
                icon = 'e4';
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
