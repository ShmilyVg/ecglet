import CommonNavigator from "./../../base/heheda-navigator/navigator";

export default class HiNavigator extends CommonNavigator {

    static navigateToArrhyth({type = 0} = {}) {
        this.navigateTo({url: '/pages/arrhyth/arrhyth?type=' + type});
    }


}
