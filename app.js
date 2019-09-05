//app.js
import "heheda-update";
import "heheda-adapter";
import 'utils/config';
import Login from "./apis/network/network/libs/login";
import UserInfo from "./apis/network/network/libs/userInfo";
import HiNavigator from "./components/navigator/hi-navigator";
import {initAnalysisOnApp} from "./analysis/mta";
import Toast from "./utils/toast";
import CommonProtocol from "./apis/network/network/libs/protocol";
import {SoftwareVersion} from "./utils/config";
import {notifyCurrentPage} from "./utils/notify";

App({
    onLaunch(options) {
        this.globalData.options = options;
        console.log('App.js onLaunch options', options);
        // 展示本地存储能力
        initAnalysisOnApp();
        wx.onNetworkStatusChange(async (res) => {
            console.log('网络状态变更', res);
            this.globalData.isConnected = res.isConnected;
            await notifyCurrentPage({name: 'onNetworkStatusChanged', value: res});

        });
        if (!this.globalData.options.query.withoutLogin) {
            this.doLogin();
            wx.getSystemInfo({
                success: res => {
                    CommonProtocol.postSystemInfo({
                        systemInfo: res,
                        hiSoftwareVersion: SoftwareVersion
                    });
                }
            });

        }
    },

    async onShow(options) {
        this.globalData.options = options;
        console.log('App.js onShow options', options);
        const currentPages = getCurrentPages();
        console.log('当前页面', currentPages);
        if (currentPages.length) {
            const current = currentPages[currentPages.length - 1];
            if (current.route !== options.path) {
                setTimeout(() => {
                    HiNavigator.redirectTo({url: `/${current.route}`});
                })
            }
        }
    },

    onHide() {

    },

    async doLogin() {
        console.log('doLogin');
        Toast.showLoading();
        try {
            await Login.doLogin();
            const {userInfo} = await UserInfo.get();

            console.log('app getUserInfo', userInfo);
            wx.setStorageSync('isRegister', true);
            const {phone, birthday, height, weight, cardiopathy, diabetes, hypertension} = userInfo;
            if (!wx.getStorageSync('phoneNumber')) {
                wx.setStorageSync('phoneNumber', phone || '');
            }
            const {query} = this.globalData.options;
            if (!!query.isGetUserInfo) {
                await notifyCurrentPage({name: 'onLoginSuccess'})
            } else if (!phone || !birthday || !weight || !height || cardiopathy === undefined || diabetes === undefined || hypertension === undefined) {
                HiNavigator.relaunchToWelcome();
            } else {
                await notifyCurrentPage({name: 'onLoginSuccess'})
            }

        } catch (res) {
            console.log('app.js login fail', res);
            if (res && res.data && res.data.code === 2) {
                HiNavigator.relaunchToWelcome();
            }
        } finally {
            Toast.hiddenLoading();
        }

    },

    globalData: {
        options: {query: {withoutLogin: false}},//无需登录即可使用？
        userInfo: {},
        tempGatherResult: {},
        isConnected: true,
        currentMember: {isEmpty: true},
        editMember: {},
        countTimer: [],
        connectedFailedTimer: [],
        refresh: false
    },

    addNewArrhythTimer(timer) {
        this.globalData.countTimer.push(timer);
    },

    addNewConnectedFailedTimer(timer) {
        this.globalData.connectedFailedTimer.push(timer);
    },
    clearAllArrhythTimer() {
        const {countTimer, connectedFailedTimer} = this.globalData;
        console.log('开始清除计时器，总计时器个数', countTimer.length);
        if (countTimer && !!countTimer.length) {
            let item;
            while (!!(item = countTimer.pop())) {
                console.log('清除计时器，计时器timer=', item);
                clearInterval(item);
            }
            while (!!(item = connectedFailedTimer.pop())) {
                clearTimeout(item);
            }
        } else {
            console.log('没有要清除的计时器');
        }
    },
    onLoginSuccess: null,

});
