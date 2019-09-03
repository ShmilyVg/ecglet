import HiNavigator from "../../components/navigator/hi-navigator";
import ResultTop from "../../components/result-top/index.js";
import Protocol from "../../apis/network/protocol";
import * as Tools from "../../utils/tools";
import {reLoginWithoutLogin} from "../../utils/tools";
import Toast from "../../utils/toast";

Page({
    data: {
        time: '',
        pdfUrl: ''
    },

    async toReportDetail() {
        Toast.showLoading();
        try {
            const {result: {pdfUrl}} = await Protocol.getPdfUrl({id: this.dataId});
            if (pdfUrl) {
                HiNavigator.navigateToReport({reportUrl: pdfUrl});
            } else {
                Toast.showText('正在生成，请稍后');
            }
        } catch (e) {
            console.error(e);
            Toast.showText('服务异常，请稍后重试');
        } finally {
            Toast.hiddenLoading();
        }
    },

    getTime(timestamp) {
        let date = Tools.createDateAndTime(timestamp);
        return date.date + ' ' + date.time;
    },

    async onLoad(options) {
        getApp().globalData.options.query = options;
        this.resultTop = new ResultTop(this);
        this.dataId = options.dataId;
        const {dataList, userInfo} = await Protocol.getRoutine({id: options.dataId});
        dataList.time = this.getTime(parseInt(dataList.time));
        this.setData({result: dataList, userInfo});
        this.resultTop.showItems({items: dataList.report});
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
