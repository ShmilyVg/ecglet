import UserInfo from "../../apis/network/network/libs/userInfo";
import HiNavigator from "../../components/navigator/hi-navigator";
import ResultTop from "../../components/result-top/index.js";
import Protocol from "../../apis/network/protocol";

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
        UserInfo.get().then((res) => {
            this.setData({userInfo: res.userInfo});
        });
        this.resultTop = new ResultTop(this);
        Protocol.getRoutine({id: parseInt(options.dataId)}).then(data => {
            console.log(data);
            const {result} = data;
            result.time = this.getTime(parseInt(result.time));
            this.setData({result});
            this.resultTop.showItems({items: result.report});
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
    }
})
