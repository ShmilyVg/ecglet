import CommonNavigator from "./../../base/heheda-navigator/navigator";

export default class HiNavigator extends CommonNavigator {
    static relaunchToStart() {
        this.reLaunch({url: '/pages/start/start'});
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

    static navigateToResult() {
        this.navigateTo({url: '/pages/result/result'});
    }

    static redirectToResult() {
        const pages = getCurrentPages();
        console.log('页面', pages);
        if (pages && pages.length) {
            const isHomePage = pages[pages.length-1].route === 'pages/start/start';
            if (isHomePage) {
                this.navigateToResult();
            } else {
                this.redirectTo({url: '/pages/result/result'});
            }
        } else {
            this.navigateToResult();
        }
    }

}
