import HiNavigator from "../../components/navigator/hi-navigator";
import Protocol from "../../apis/network/protocol";
import Toast from "../../utils/toast";
import * as Tools from "../../utils/tools";
import {reLoginWithoutLogin} from "../../utils/tools";


Page({
    data: {
        pdfUrl: '',
        isPush: false,
    },

    async onLoad(options) {
        getApp().globalData.options.query = options;
        this.dataId = options.dataId;
        const data = await Protocol.getCardiac({id: this.dataId});
        let {result: {data: {hipeeSuggest, list, time}, userInfo}} = data;
        let date = Tools.createDateAndTime(time);
        let topDate = date.date + ' ' + date.time;
        list.map(value => {
            if (value.target) {
                value.point = 47 + 161 * (value.level - 1);
                if (value.target === 6) {
                    value.image = `../../images/pressure-result/pl${value.level}.png`
                } else if (value.target === 7) {
                    value.image = `../../images/pressure-result/xf${value.level}.png`
                }
            }
        });
        this.setData({
            date: topDate,
            dataList: list,
            suggest: hipeeSuggest,
            userInfo
        });
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
            case 1://平均心率
                HiNavigator.navigateToAvgHrDetail({dataId});
                break;
            case 4://心率变异性
                HiNavigator.navigateToHrvIntervalDetail({dataId});
                break;
            case 5://心脏压力
                HiNavigator.navigateToHeartPressureDetail({dataId});
                break;
            case 6://疲劳指数
                HiNavigator.navigateToTiredLevelDetail({dataId});
                break;
            case 7://情绪指数
                HiNavigator.navigateToExcitingLevelDetail({dataId});
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

    async toReportDetail() {
        Toast.showLoading();
        try {
            const data = await Protocol.getPdfUrl({id: this.dataId})
            const {pdfUrl} = data.result;
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

    onShareAppMessage() {
        return {
            title: '',
            imageUrl: '',
            path: '/pages/pressure-result/pressure-result?withoutLogin=1&dataId=' + this.dataId
        };
    },
});
