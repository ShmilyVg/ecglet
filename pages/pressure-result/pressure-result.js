import HiNavigator from "../../components/navigator/hi-navigator";
import ResultTop from "../../components/result-top/index.js";
import Canvas from './canvas.js';
import Protocol from "../../apis/network/protocol";
import Toast from "../../utils/toast";


Page({
    ...Canvas.options,
    data: {
        ...Canvas.data,
        time: '',
        pdfUrl: '',
        showScore: true
    },

    lookDetail() {
        Toast.showLoading();
        Protocol.getPdfUrl({id: this.dataId}).then(res => {
            const {pdfUrl} = res.data.result;
            if (pdfUrl) {
                HiNavigator.navigateToReport({reportUrl: pdfUrl});
            } else {
                Toast.showText('正在生成，请稍后');
            }
        }).catch(res => {
            Toast.showText('服务异常，请稍后重试');
        }).finally(Toast.hiddenLoading);
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

    onUnload() {
    },

    onLoad(options) {
        getApp().globalData.options.query = options;
        //等级 1——7.5%；2——31%； 3——56%；4——80%；
        this.resultTop = new ResultTop(this);
        this.dataId = options.dataId;


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

    onReady() {
        Protocol.getCardiac({id: this.dataId}).then(data => {
            const {dataList: {list: items, stress, emotion, tired, time, isAbNormal}, userInfo} = data;

            this.setData({
                userInfo,
                isAbNormal,
                time: this.getTime(parseInt(time)), stress, tired: {
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
    },
    onShareAppMessage() {
        return {
            title: '',
            imageUrl: '',
            path: '/pages/pressure-result/pressure-result?withoutLogin=1&dataId=' + this.dataId
        };
    },
    lookReasonDialog() {
        const remindDialog = this.selectComponent('#myDialog');
        this.setData({
            showScore: false
        });
        const that = this;
        remindDialog.show({
            title: '心脏压力指数', content: '1、压力指数反映了您最近的压力状况，分数越高，压力越大；\n' +
                '2、仅表示当前时间段内的心脏负荷情况，可能是因为工作、生活中遇到了问题导致神经紧张所致，也许是进行了剧烈运动、服药、熬夜导致的生理性异常\n' +
                '3、仅针对个人不同时间段比较，不同人的压力指数不能作为比较的指标哦~', confirmText: '我知道了', confirmEvent: () => {
                console.warn('展示信息', that);
                that.setData({
                    showScore: true
                });
            }
        });
    },
});
