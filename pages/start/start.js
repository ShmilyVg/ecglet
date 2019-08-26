import UserInfo from '../../apis/network/userInfo.js';
import {dealAuthUserInfo, MyUsed} from "../../utils/tools";
import WXDialog from "../../base/heheda-common-view/dialog";
import Protocol from "../../apis/network/protocol";
import HiNavigator from "../../components/navigator/hi-navigator";
import {RandomRemindData} from "../../utils/tips";
import * as tools from "../../utils/tools";

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
        UserInfo.get().then((res) => {
            let name = tools.HandleShortName(res.userInfo.nickName);
            this.setData({
                userInfo: res.userInfo,
                name: name
            })
        })
    },

    toNormalTestPage() {
        console.log('按钮toNormalTestPage点击了');
        Protocol.checkHaveNetwork().then(() => {
            console.log('将要进入采集页面');
            HiNavigator.navigateToArrhyth();
        }).catch((res) => {
            console.log('进入采集页面失败', res);
            WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
        });
    },
    to02TestPage() {
        Protocol.checkHaveNetwork().then(() => {
            HiNavigator.navigateToArrhyth({type: 2});
        }).catch(() => {
            WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
        })
    },

    onGotUserInfoNormalTest(e) {
        dealAuthUserInfo(e).then((res) => {
            this.setData({userInfo: res.userInfo});
            HiNavigator.navigateToArrhyth();
        }).catch((res) => {
            console.log(res);
        });
    },
    onGotUserInfo02Test(e) {
        dealAuthUserInfo(e).then((res) => {
            this.setData({userInfo: res.userInfo});
            HiNavigator.navigateToArrhyth({type: 2});
        }).catch((res) => {
            console.log(res);
        });
    },

    toHeartHealthPage() {
        HiNavigator.navigateToHeartHealthEvaluation();
    },
});

