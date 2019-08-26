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
        lineNum: [1, 3, 6]
    },
    async onLoad(options) {
        console.log(options);
        this.dataId = options.dataId;
        const {result, result: {level, title}} = await Protocol.getMoodInterval({id: this.dataId});
        let fre = parseInt(level) || 0, icon = '', position = 0;//iconWidth=2 是2%的意思
        if (fre === 1) {
            position = '6.5%';
            icon = 'xf1';
        } else if (fre === 2) {
            position = '30.5%';
            icon = 'xf2';
        } else if (fre === 3) {
            position = '56.5%';
            icon = 'xf3';
        } else {
            position = '81.5%';
            icon = 'xf4';
        }

        this.setData({
            position,
            icon,
            result
        });
        wx.setNavigationBarTitle({title: '心脏负荷评估'});

    },

})
