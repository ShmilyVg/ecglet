import UserInfo from '../../apis/network/userInfo.js';
import * as tools from "../../utils/tools";
import {dealAuthUserInfo, MyUsed} from "../../utils/tools";
import WXDialog from "../../base/heheda-common-view/dialog";
import Protocol from "../../apis/network/protocol";
import HiNavigator from "../../components/navigator/hi-navigator";
import {RandomRemindData} from "../../utils/tips";

const app = getApp();
Page({
    data: {
        userInfo: {},
        isFirstUsed: true,
    },

    onLoad(param) {
        const isFirstUsed = MyUsed.isFirstUsed();

        if (isFirstUsed) {
            MyUsed.setUsed();
            this.setData({isFirstUsed: true});
        } else {
            const tip = new RandomRemindData();
            tip.random();
            this.setData({isFirstUsed: false, tip: tip.getRemindData()});
        }
    },

    async onShow() {
        app.clearAllArrhythTimer();
        const {userInfo, userInfo: {nickName}} = await UserInfo.get();
        let name = tools.HandleShortName(nickName);
        this.setData({
            userInfo,
            name: name
        })
    },

    async toNormalTestPage() {
        console.log('按钮toNormalTestPage点击了');
        try {
            await Protocol.checkHaveNetwork();
            console.log('将要进入采集页面');
            HiNavigator.navigateToArrhyth();
        } catch (e) {
            console.log('进入采集页面失败', e);
            WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
        }
    },
    async to02TestPage() {
        try {
            await Protocol.checkHaveNetwork();
            HiNavigator.navigateToArrhyth({type: 2});
        } catch (e) {
            WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
        }
    },

    async onGotUserInfoNormalTest(e) {
        try {
            const {userInfo} = await dealAuthUserInfo(e);
            this.setData({userInfo});
            HiNavigator.navigateToArrhyth();
        } catch (e) {
            console.error(e);
        }
    },
    async onGotUserInfo02Test(e) {
        try {
            const {userInfo} = await dealAuthUserInfo(e);
            this.setData({userInfo});
            HiNavigator.navigateToArrhyth({type: 2});
        } catch (e) {
            console.error(e);
        }
    },

    toHeartHealthPage() {
        HiNavigator.navigateToHeartHealthEvaluation();
    },
});

