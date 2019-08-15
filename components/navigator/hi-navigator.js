import CommonNavigator from "./../../base/heheda-navigator/navigator";

export default class HiNavigator extends CommonNavigator {
    static relaunchToStart() {
        this.reLaunch({url: '/pages/start/start?onLoginSuccess=true'});
    }

    static relaunchToNewUserEdit() {
        this.reLaunch({url: '/pages/new-user-edit/userdata'});
    }

    static relaunchToWelcome() {
        this.reLaunch({url: '/pages/welcome/welcome'});
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
        if (type === 2) {
            this.navigateToHeartPressureResult({dataId});
        } else {
            this.navigateToNormalResult({dataId});
        }
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

    static navigateToIllHistory({isNormalMember, isNewMember, relevanceId}) {
        wx.navigateTo({
            url: `/pages/ill-history/ill-history?isNewMember=${isNewMember}&isNormalMember=${isNormalMember}&relevanceId=${relevanceId}`
        })
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
}
