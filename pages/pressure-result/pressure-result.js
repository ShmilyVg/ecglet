import HiNavigator from "../../components/navigator/hi-navigator";
import ResultTop from "../../components/result-top/index.js";
import Protocol from "../../apis/network/protocol";
import Toast from "../../utils/toast";
import {reLoginWithoutLogin} from "../../utils/tools";
import * as Tools from "../../utils/tools";


Page({
    data: {
        pdfUrl: '',
        isPush: false,
    },

    onLoad(options) {
        getApp().globalData.options.query = options;
        this.dataId = options.dataId;
        Protocol.getCardiac({id: this.dataId}).then(res => {
            let {data: {result: {data: {hipeeSuggest, list, time}, userInfo}}} = res;
            let date = Tools.createDateAndTime(time);
            let topDate = date.date + ' ' + date.time;
            list.map(value => {
                if (value.target) {
                    value.point = 47 + 161 * (value.level - 1);
                    if (value.target === 6) {
                        value.image = `../../images/pressure-result/xf${value.level}.png`
                    } else if (value.target === 7) {
                        value.image = `../../images/pressure-result/pl${value.level}.png`
                    }
                }
            });
            this.setData({
                date: topDate,
                dataList: list,
                suggest: hipeeSuggest,
                userInfo
            })
        })
    },

    onShow() {
        this.isNeedRelogin = true;
    },

    onHide() {
        this.isNeedRelogin = false;
    },

    onUnload() {
        if (this.isNeedRelogin) {
            reLoginWithoutLogin();
        }
    },
    /**
     * 查看指标详情
     */
    toIndexDetailPage(e) {
        const {currentTarget: {dataset: {item}}} = e;
        const dataId = this.dataId;
        console.log(item);
        switch (item.target) {
            case 5://心脏压力
                HiNavigator.navigateToHeartPressureDetail({dataId});
                break;
            default:
                break;
        }
    },
    clickPush() {
        this.setData({
            isPush: true
        })
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

    onShareAppMessage() {
        return {
            title: '',
            imageUrl: '',
            path: '/pages/pressure-result/pressure-result?withoutLogin=1&dataId=' + this.dataId
        };
    },
});
