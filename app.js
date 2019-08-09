//app.js
import "heheda-update";
import "heheda-adapter";
import 'utils/config';
import Login from "./apis/network/network/libs/login";
import UserInfo from "./apis/network/network/libs/userInfo";
import HiNavigator from "./components/navigator/hi-navigator";
import {initAnalysisOnApp} from "./analysis/mta";
import Toast from "./utils/toast";

App({
    onLaunch(options) {
        this.globalData.options = options;
        console.log('App.js onLaunch options', options);
        // 展示本地存储能力
        initAnalysisOnApp();
        wx.onNetworkStatusChange((res) => {
            console.log('网络状态变更', res);
            this.globalData.isConnected = res.isConnected;
            const currentPages = getCurrentPages();
            if (currentPages && currentPages.length) {
                const pageListener = currentPages[currentPages.length - 1].onNetworkStatusChanged;
                console.log('页面监听函数', pageListener);
                pageListener && pageListener(res);
            }
            // }
        });
        if (!this.globalData.options.query.withoutLogin) {
            this.doLogin();
        }
    },

    onShow(options) {
        this.globalData.options = options;
        console.log('App.js onShow options', options);
    },

    doLogin() {
        console.log('doLogin');
        Toast.showLoading();
        Login.doLogin().then((data) => {
            return UserInfo.get();
        }).then((res) => {
            console.log('app getUserInfo', res);
            wx.setStorageSync('isRegister', true);
            const {phone, birthday, height, weight} = res.userInfo;
            if (!wx.getStorageSync('phoneNumber')) {
                wx.setStorageSync('phoneNumber', res.userInfo.phone || '');
            }

            const {query} = this.globalData.options;
            if (!!query.isGetUserInfo) {
                this.onLoginSuccess && this.onLoginSuccess();
            } else if (!phone || !birthday || !weight || !height) {
                HiNavigator.relaunchToWelcome();
            } else {
                this.onLoginSuccess && this.onLoginSuccess();
            }
        }).catch((res) => {
            console.log('app.js login fail', res);
            if (res && res.data && res.data.code === 2) {
                HiNavigator.relaunchToWelcome();
            }
        }).finally(Toast.hiddenLoading);
    },

    globalData: {
        options: {query: {withoutLogin: false}},//无需登录即可使用？
        userInfo: {},
        tempGatherResult: {},
        isConnected: true,
        currentMember: {},
        editMember: {},
        countTimer: []
    },

    addNewArrhythTimer(timer) {
        this.globalData.countTimer.push(timer);
    },

    clearAllArrhythTimer() {
        const {countTimer} = this.globalData;
        console.log('开始清除计时器，总计时器个数', countTimer.length);
        if (countTimer && !!countTimer.length) {
            let item;
            while (!!(item = countTimer.pop())) {
                console.log('清除计时器，计时器timer=', item);
                clearInterval(item);
            }
        } else {
            console.log('没有要清除的计时器');
        }
    },
    onLoginSuccess: null,

});
