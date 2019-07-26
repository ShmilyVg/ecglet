import UserInfo from "../../apis/network/network/libs/userInfo";
import HiNavigator from "../../components/navigator/hi-navigator";
import ResultTop from "../../components/result-top/index.js";
import Canvas from './canvas.js';
import Protocol from "../../apis/network/protocol";

Page({
    ...Canvas.options,
    data: {
        ...Canvas.data,
        time: '',
        pdfUrl: ''
    },

    lookDetail() {
        const pdfUrl = this.data.pdfUrl;
        if (pdfUrl) {
            HiNavigator.navigateToReport({reportUrl: pdfUrl});
        }
    },

    getTime(timestamp) {
        const date = new Date(timestamp || Date.now());
        console.log(timestamp, date);
        return `${date.getFullYear()}/${this.getTimeWithZero(date.getMonth() + 1)}/${this.getTimeWithZero(date.getDate())} ${this.getTimeWithZero(date.getHours())}:${this.getTimeWithZero(date.getMinutes())}`;
    },

    getTimeWithZero(num) {
        return ('0' + num).slice(-2);
    },

    getImagePosition(level) {
        switch (level) {
            case '1':
                return '7.5';
            case '2':
                return '31';
            case '3':
                return '56';
            case '4':
                return '80';
        }
    },

    onLoad(options) {
        //等级 1——7.5%；2——31%； 3——56%；4——80%；
        UserInfo.get().then((res) => {
            this.setData({userInfo: res.userInfo});
        });
        this.resultTop = new ResultTop(this);
        Protocol.getCardiac({id: parseInt(options.dataId)}).then(data => {
            const {result: {list: items, stress, emotion, tired, time, pdfUrl}} = data;

            this.setData({
                time: this.getTime(parseInt(time)), pdfUrl, stress, tired: {
                    ...tired,
                    position: this.getImagePosition(tired.level)
                }, emotion: {
                    ...emotion,
                    position: this.getImagePosition(emotion.level)
                }
            });
            this.resultTop.showItems({items});
            this.draw('runCanvas', stress.score, 100);
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

    onShareAppMessage() {
        return {title:'',imageUrl:'', path: ''};
    }
});
