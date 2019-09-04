import CommonNavigator from "./../../base/heheda-navigator/navigator";
import {stat} from "../../analysis/mta";

export default class HiNavigator extends CommonNavigator {
    static relaunchToStart() {
        this.reLaunch({url: '/pages/start/start?onLoginSuccess=true'});
    }

    static relaunchToNewUserEdit() {
        this.reLaunch({url: '/pages/new-user-edit/userdata'});
    }

    static redirectToNewUserEdit() {
        this.redirectTo({url: '/pages/new-user-edit/userdata'});
    }

    static relaunchToWelcome() {
        this.reLaunch({url: '/pages/welcome/welcome'});
    }

    static navigateToWelcome() {
        this.navigateTo({url: '/pages/welcome/welcome'});
    }

    static navigateToInstruction() {
        this.navigateTo({url: '/pages/instruction/instruction'});
    }

    static navigateToArrhyth({type = 1} = {}) {
        this.navigateTo({url: '/pages/arrhyth/arrhyth?type=' + type});
    }

    static navigateToReport({reportUrl}) {
        this.navigateTo({url: '/pages/report/report?reportUrl=' + reportUrl});
    }

    static navigateToShareCode() {
        wx.navigateTo({url: '/pages/share-code/share-code'});
    }

    static navigateToKnowledge() {
        wx.navigateTo({url: '/pages/knowledge/knowledge'});
    }

    static navigateToMemberList({state}) {
        wx.navigateTo({url: '/pages/member-list/member-list?state=' + state});
    }

    static redirectToRichContent({tempFileUrl, type}) {
        const pages = getCurrentPages();
        if (pages && pages.length) {
            const isHomePage = pages[pages.length - 1].route === 'pages/start/start';
            if (isHomePage) {
                this.navigateToRichContent(arguments[0]);
            } else {
                wx.redirectTo({url: '/pages/rich-content/rich-content?type=' + type + '&tempFileUrl=' + encodeURIComponent(tempFileUrl)});
            }
        } else {
            this.navigateToRichContent(arguments[0]);
        }
    }

    static navigateToRichContent({tempFileUrl, type}) {
        wx.navigateTo({url: '/pages/rich-content/rich-content?type=' + type + '&tempFileUrl=' + encodeURIComponent(tempFileUrl)});
    }

    static redirectToResultPageByType({type, dataId}) {
        if (type === 2) {
            this.redirectToHeartPressureResult({dataId});
        } else {
            this.redirectToNormalResult({dataId});
        }
    }

    static navigateToResultPageByType({type, dataId}) {
        let value = '心脏负荷报告页';
        if (type === 2) {
            this.navigateToHeartPressureResult({dataId});
        } else {
            value = '常规心电报告页';
            this.navigateToNormalResult({dataId});
        }
        stat({key: 'click_ecg_jiancebaogao_pdf', value});
    }

    static navigateToNormalResult({dataId}) {
        wx.navigateTo({url: '/pages/result/result?dataId=' + dataId});
    }

    static redirectToNormalResult({dataId}) {
        this.redirectTo({url: '/pages/result/result?dataId=' + dataId});
    }

    static navigateToHeartPressureResult({dataId}) {
        wx.navigateTo({url: '/pages/pressure-result/pressure-result?dataId=' + dataId});
    }

    static redirectToHeartPressureResult({dataId}) {
        wx.redirectTo({url: '/pages/pressure-result/pressure-result?dataId=' + dataId});
    }

    static navigateToIllHistory({isFirstInto = 0}) {
        wx.navigateTo({url: `/pages/ill-history/ill-history?isFirstInto=${isFirstInto}`})
    }

    static navigateToHeartPressureDetail({dataId}) {
        this.navigateTo({url: `/pages/press-detail/press-detail?dataId=${dataId}`});
    }

    static navigateToAvgHrDetail({dataId}) {
        this.navigateTo({url: `/pages/avg-hr/avg-hr?dataId=${dataId}`});
    }

    static navigateToHrvIntervalDetail({dataId}) {
        this.navigateTo({url: `/pages/hrv-interval/hrv-interval?dataId=${dataId}`});
    }

    static navigateToTiredLevelDetail({dataId}) {
        this.navigateTo({url: `/pages/tired-level/tired-level?dataId=${dataId}`});
    }

    static navigateToExcitingLevelDetail({dataId}) {
        this.navigateTo({url: `/pages/exciting-level/exciting-level?dataId=${dataId}`});
    }

    static navigateToHeartHealthEvaluation() {
        this.navigateTo({url: `/pages/heart-health-evaluate/heart-health-evaluate`});
    }


    static navigateToHeartHealthEvaluationResult({result}) {
        getApp().globalData.tempHeartHealthEvaluationResult = result;
        this.navigateTo({url: `/pages/heart-health-evaluate-result/heart-health-evaluate-result`});
    }

    static getHeartHealthEvaluationResult() {
        return getApp().globalData.tempHeartHealthEvaluationResult;
    }
}
