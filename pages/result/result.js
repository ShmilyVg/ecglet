import HiNavigator from "../../components/navigator/hi-navigator";
import ResultTop from "../../components/result-top/index.js";
import Protocol from "../../apis/network/protocol";
import {reLoginWithoutLogin} from "../../utils/tools";

Page({
    data: {
        time: '',
        pdfUrl: ''
    },

    lookDetail() {
        const pdfUrl = this.data.result.pdfUrl;
        if (pdfUrl) {
            HiNavigator.navigateToReport({reportUrl: pdfUrl});
        }
    },

    getTime(timestamp) {
        const date = new Date(timestamp);
        console.log(timestamp, date);
        return `${date.getFullYear()}/${this.getTimeWithZero(date.getMonth() + 1)}/${this.getTimeWithZero(date.getDate())} ${this.getTimeWithZero(date.getHours())}:${this.getTimeWithZero(date.getMinutes())}`;
    },

    getTimeWithZero(num) {
        return ('0' + num).slice(-2);
    },

    onLoad(options) {
        getApp().globalData.options.query = options;
        this.resultTop = new ResultTop(this);
        this.dataId = options.dataId;
        Protocol.getRoutine({id: options.dataId}).then(data => {
            console.log(data);
            const {dataList,userInfo} = data;
            dataList.time = this.getTime(parseInt(dataList.time));
            this.setData({result: dataList, userInfo});
            this.resultTop.showItems({items: dataList.report});
        });



        // const result = getApp().globalData.tempGatherResult;
        //
        // console.log('接收到的结果', result);
        // // // const result = this.data.result;
        // result.time = this.getTime(parseInt(result.time));
        // this.setData({result});
        // wx.setNavigationBarColor({
        //     backgroundColor: this.data.isGreen ? '#00C6BC' : '#3A93EF', frontColor: '#ffffff', animation: {
        //         duration: 400,
        //         timingFunc: 'easeIn'
        //     }
        // });
    },
    onUnload() {
    },
    onShareAppMessage() {
        return {title: '', imageUrl: '', path: '/pages/result/result?withoutLogin=1&dataId=' + this.dataId};
    },
})
