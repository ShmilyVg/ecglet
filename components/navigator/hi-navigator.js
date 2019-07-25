import CommonNavigator from "./../../base/heheda-navigator/navigator";

export default class HiNavigator extends CommonNavigator {
    static relaunchToStart() {
        this.reLaunch({url: '/pages/start/start'});
    }

    static relaunchToNewUserEdit() {
        this.reLaunch({url: '/pages/new-user-edit/userdata'});
    }

    static relaunchToWelcome() {
        this.reLaunch({url: '/pages/welcome/welcome'});
    }

    static navigateToArrhyth({type = 0} = {}) {
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

    static redirectToResultPageByType({type,dataId}) {
        if (type === 3) {
            this.redirectToHeartPressureResult({dataId});
        } else {
            this.redirectToNormalResult({dataId});
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
}
