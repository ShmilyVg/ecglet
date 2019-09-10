import UserInfo from '../../apis/network/userInfo.js';
import * as tools from "../../utils/tools";
import {dealAuthUserInfo, dealRegister, MyUsed} from "../../utils/tools";
import HiNavigator from "../../components/navigator/hi-navigator";
import {RandomRemindData} from "../../utils/tips";
import {firstUseToWelcomePage} from "../../utils/config";

const app = getApp();
Page({
    data: {
        userInfo: {},
        isFirstUsed: true,
    },

    async onLoad(param) {
        const {isNeedRegister, toRegister} = app.judgeNeedRegister(await UserInfo.get());
        if (isNeedRegister) {
            if (firstUseToWelcomePage) {
                toRegister();
                return;
            }
        }
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
        await dealRegister();
        HiNavigator.navigateToArrhyth();
    },
    async to02TestPage() {
        await dealRegister();
        HiNavigator.navigateToArrhyth({type: 2});
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

    async toHeartHealthPage() {
        await dealRegister();
        HiNavigator.navigateToHeartHealthEvaluation();
    },
});

