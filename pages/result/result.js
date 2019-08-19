import HiNavigator from "../../components/navigator/hi-navigator";
import ResultTop from "../../components/result-top/index.js";
import Protocol from "../../apis/network/protocol";
import {reLoginWithoutLogin} from "../../utils/tools";
import Toast from "../../utils/toast";
import * as Tools from "../../utils/tools";

Page({
    data: {
        time: '',
        pdfUrl: ''
    },

    toReportDetail() {
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
        let date = Tools.createDateAndTime(timestamp);
        return date.date + ' ' + date.time;
    },

    onLoad(options) {
        getApp().globalData.options.query = options;
        this.resultTop = new ResultTop(this);
        this.dataId = options.dataId;
        Protocol.getRoutine({id: options.dataId}).then(data => {
            console.log(data);
            const {dataList, userInfo} = data;
            dataList.time = this.getTime(parseInt(dataList.time));
            this.setData({result: dataList, userInfo});
            this.resultTop.showItems({items: dataList.report});
        });
    },

    onHide() {
        this.isNeedRelogin = false;
    },

    onShow() {
        this.isNeedRelogin = true;
    },

    onUnload() {
        if (this.isNeedRelogin) {
            reLoginWithoutLogin();
        }
    },

    onShareAppMessage() {
        return {title: '', imageUrl: '', path: '/pages/result/result?withoutLogin=1&dataId=' + this.dataId};
    },
});
