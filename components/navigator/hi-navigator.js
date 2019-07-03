import CommonNavigator from "./../../base/heheda-navigator/navigator";

export default class HiNavigator extends CommonNavigator {

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
        this.redirectTo({url: '/pages/result/result'});
    }

}
