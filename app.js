//app.js
import "heheda-update";
import "heheda-adapter";
import 'utils/config';
import Login from "./apis/network/network/libs/login";
import UserInfo from "./apis/network/network/libs/userInfo";
import HiNavigator from "./components/navigator/hi-navigator";
import {initAnalysisOnApp} from "./analysis/mta";

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
        Login.doLogin().then((data) => {
            return UserInfo.get();
        }).then((res) => {
            console.log('app getUserInfo', res);
            wx.setStorageSync('isRegister', true);
            const {phone, birthday} = res.userInfo;
            if (!wx.getStorageSync('phoneNumber')) {
                wx.setStorageSync('phoneNumber', res.userInfo.phone || '');
            }

            const {query} = this.globalData.options;
            if (!!query.isGetUserInfo) {
                this.onLoginSuccess && this.onLoginSuccess();
            } else if (!phone || !birthday) {
                HiNavigator.relaunchToWelcome();
            } else {
                this.onLoginSuccess && this.onLoginSuccess();
            }
        }).catch((res) => {
            console.log('app.js login fail', res);
            if (res && res.data && res.data.code === 2) {
                HiNavigator.relaunchToWelcome();
            }
        });
    },

    globalData: {
        options: {query: {withoutLogin: false}},//无需登录即可使用？
        userInfo: {},
        tempGatherResult: {},
        isConnected: true,
        currentMember: {},
        editMember: {},
    },

    onLoginSuccess: null,

});
