// pages/AvgHR/AvgHR.js
import Protocol from "../../apis/network/protocol";

Page({

    data: {},
    onLoad(options) {
        console.log(options);
        this.dataId = options.dataId;

    },

    async onReady() {
        wx.setNavigationBarTitle({title: '心脏负荷评估'});
        const data = await Protocol.getPsilnterval({id: this.dataId});
        const {result} = data;
        this.setData({
            result
        }, () => {
            this.selectComponent('#press-detail-circle').drawCircle({score: parseInt(result.frequency)});
        });
    }
});
