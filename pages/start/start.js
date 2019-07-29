import UserInfo from '../../apis/network/userInfo.js';
import {dealAuthUserInfo, MyUsed} from "../../utils/tools";
import WXDialog from "../../base/heheda-common-view/dialog";
import Protocol from "../../apis/network/protocol";
import HiNavigator from "../../components/navigator/hi-navigator";
import {RandomRemindData} from "../../utils/tips";
import * as tools from "../../utils/tools";

Page({
    data: {
        userInfo: {},
        isConnected: true,
        isFirstUsed: true
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
        getApp().onLoginSuccess = () => {
            this.setData({haveAuthorize: true});
        };
    },

    onShow() {
        Protocol.checkHaveNetwork().then(() => {
            this.setData({isConnected: true});
        }).catch(() => {
            this.setData({isConnected: false});
        });
        this.setData({isConnected: getApp().globalData.isConnected});
        UserInfo.get().then((res) => {
            let name = tools.HandleShortName(res.userInfo.nickName);
            this.setData({
                userInfo: res.userInfo,
                name: name
            })
        })
    },

    toNormalTestPage() {
        Protocol.checkHaveNetwork().then(() => {
            HiNavigator.navigateToArrhyth();
        }).catch(() => {
            WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
        })
    },
    to02TestPage() {
        Protocol.checkHaveNetwork().then(() => {
            HiNavigator.navigateToArrhyth({type: 2});
        }).catch(() => {
            WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
        })
    },
    onNetworkStatusChanged(res) {
        this.setData({isConnected: res.isConnected});
    },
    onNoNetworkConnected() {
        console.log('onNoNetworkConnected', this.data.isConnected);
        WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
    },
    onGotUserInfoNormalTest(e) {
        console.log('onGotUserInfoNormalTest isConnected=', this.data.isConnected);
        dealAuthUserInfo(e).then((res) => {
            this.setData({userInfo: res.userInfo});
            HiNavigator.navigateToArrhyth();
        }).catch((res) => {
            console.log(res);
        });
    },
    onGotUserInfo02Test(e) {
        console.log('onGotUserInfo02Test isConnected=', this.data.isConnected);
        dealAuthUserInfo(e).then((res) => {
            this.setData({userInfo: res.userInfo});
            HiNavigator.navigateToArrhyth({type: 2});
        }).catch((res) => {
            console.log(res);
        });
    }


});

