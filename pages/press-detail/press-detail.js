// pages/AvgHR/AvgHR.js
import Protocol from "../../apis/network/protocol";

Page({

    data: {},
    onLoad(options) {
        console.log(options);
        this.dataId = options.dataId;

    },

    onReady() {
        Protocol.getPsilnterval({id: this.dataId}).then(data => {
            const {result} = data;
            this.setData({
                result
            }, () => {
                this.selectComponent('#press-detail-circle').drawCircle({score: parseInt(result.frequency)});
            });
            wx.setNavigationBarTitle({title: result.title});
        });
    }
});
