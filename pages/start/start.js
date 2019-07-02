import UserInfo from '../../apis/network/userInfo.js';
import {dealAuthUserInfo} from "../../utils/tools";
import WXDialog from "../../base/heheda-common-view/dialog";
import Protocol from "../../apis/network/protocol";
import HiNavigator from "../../components/navigator/hi-navigator";

Page({
    data: {
        userInfo: {},
        isConnected: true
    },

    onLoad(param) {
        // @ts-ignore
        getApp().onLoginSuccess = ()=>{
            this.setData({haveAuthorize: true});
        }
    },

    onShow(){
        Protocol.checkHaveNetwork().then(() => {
            this.setData({isConnected: true});
        }).catch(() => {
            this.setData({isConnected: false});
        });
        this.setData({isConnected: getApp().globalData.isConnected});
        UserInfo.get().then((res)=>{
            this.setData({
                userInfo: res.userInfo,
            })
        })
    },

    toNormalTestPage() {
        Protocol.checkHaveNetwork().then(()=>{
            HiNavigator.navigateToArrhyth();
        }).catch(()=>{
            WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
        })
    },
    to02TestPage() {
        Protocol.checkHaveNetwork().then(()=>{
            HiNavigator.navigateToArrhyth({type: 3});
        }).catch(()=>{
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
            HiNavigator.navigateToArrhyth({type: 3});
        }).catch((res) => {
            console.log(res);
        });
    }


});

