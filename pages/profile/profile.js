import Toast from "../../utils/toast";
import WXDialog from "../../utils/dialog";
import UserInfo from "../../apis/network/network/libs/userInfo";
import Protocol from "../../apis/network/protocol";
import {dealAuthUserInfo} from "../../utils/tools";
import HiNavigator from "../../components/navigator/hi-navigator";

Page({
    data: {
        phone: '4009210610',
        haveNum: true,
        haveAuthorize: false,
        isConnected: true
    },

    isRegister: false,
    onLoad(options) {
        getApp().onLoginSuccess = () => {
            this.setData({haveAuthorize: true});
        };
        if (!!wx.getStorageSync('isRegister')) {
            console.log('注册过了');
            let phoneNum = wx.getStorageSync('phoneNumber');
            console.log('手机号：', phoneNum);
            if (phoneNum === "") {
                this.setData({
                    haveNum: false,
                    haveAuthorize: true
                });
            } else {
                this.setData({
                    haveNum: true,
                    haveAuthorize: true
                });
            }
        } else {
            const phoneNumber = wx.getStorageSync('phoneNumber');
            console.log('还没注册', phoneNumber);
            if (phoneNumber) {
                console.log('有手机号');
                this.setData({
                    haveNum: true,
                });
            } else {
                this.setData({
                    haveNum: false,
                });
                console.log('没手机号');
            }
        }
    },

    onNetworkStatusChanged(res) {
        this.setData({
            isConnected: res.isConnected
        });
    },

    onNoNetworkConnected() {
        console.log('onNoNetworkConnected', this.data.isConnected);
        WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
    },

    onShow() {
        Protocol.checkHaveNetwork().then(() => {
            this.setData({isConnected: true});
        }).catch(() => {
            this.setData({isConnected: false});
        });
        this.setData({isConnected: getApp().globalData.isConnected});
        UserInfo.get().then((res) => {
            this.setData({
                userInfo: res.userInfo,
                haveAuthorize: true
            })
        })
    },

    getPhoneNumber(e) {
        const {detail: {encryptedData, iv, errMsg}} = e;
        if (errMsg === 'getPhoneNumber:ok') {
            Toast.showLoading();
            Protocol.getPhoneNum({
                encryptedData, iv
            }).then((phoneNumber) => {
                wx.setStorageSync('phoneNumber', phoneNumber);
            }).then((res) => {
                    this.setData({
                        haveNum: true
                    });
                }
            ).catch((res) => {
                console.log(res);
                Toast.showText('授权手机号失败，请重试');
            }).finally(() => {
                Toast.hiddenLoading();
            });
        } else {
            WXDialog.showDialog({content: '因您拒绝授权，无法使用更多专业服务', showCancel: false});
        }
    },

    onGotUserInfo(e) {
        dealAuthUserInfo(e).then((res) => {
            this.setData({
                haveAuthorize: true,
                userInfo: res.userInfo
            });
            let phone = wx.getStorageSync('phoneNumber');
            let userInfo = {...res.userInfo, phone};
            Protocol.accountUpdate(userInfo).then(res => {
                console.log(res);
            });
        }).catch((res) => {
            console.log(res);
            // Toast.showText('授权用户信息失败，请重试');
        });
    },

    toEditInfo() {
        if (!!wx.getStorageSync('isRegister')) {
            wx.navigateTo({
                    url: '../userdata/userdata'
                }
            );
        } else {
            Toast.warn('请您授权');
        }
    },

    onGotUserInfoAndToHistory(e) {
        dealAuthUserInfo(e).then((res) => {
            this.setData({
                haveAuthorize: true,
                userInfo: res.userInfo
            });
            wx.navigateTo({url: '../history/history'});
        }).catch((res) => {
            console.log(res);
        });
    },

    clickCell2() {
        wx.navigateTo({url: '../disease-arrhyth/disease-arrhyth'})
    },

    clickCell3() {
        wx.navigateTo({url: '../feedback/feedback'})
    },
    toShareCodePage() {
        HiNavigator.navigateToShareCode();
    },
    toKnowledgePage() {
        HiNavigator.navigateToKnowledge();
    }
})
