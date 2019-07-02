// import UserInfo from '../../../ecglet的副本/src/apis/network/userInfo.js';
// import Toast from '../../../ecglet的副本/src/base/heheda-common-view/toast.js';
// import Protocol from '../../../ecglet的副本/src/apis/network/protocol.js'
// import WXDialog from "../../../ecglet的副本/src/base/heheda-common-view/dialog";
// import {dealAuthUserInfo} from "../../../ecglet的副本/src/utils/tools";


Page({
    data: {
        phone: '4009210610',
        haveNum: true,
        haveAuthorize: false,
        isConnected: true
    },

    isRegister: false,
    onLoad(options) {
        let that = this;
        getApp().onLoginSuccess = () => {
            this.setData({haveAuthorize: true});
        };
        if (!!wx.getStorageSync('isRegister')) {
            console.log('注册过了');
            let phoneNum = wx.getStorageSync('phoneNumber');
            console.log('手机号：', phoneNum);
            if (phoneNum === "") {
                that.setData({
                    haveNum: false,
                    haveAuthorize: true
                });
            } else {
                that.setData({
                    haveNum: true,
                    haveAuthorize: true
                });
            }
        } else {
            const phoneNumber = wx.getStorageSync('phoneNumber');
            console.log('还没注册', phoneNumber);
            if (phoneNumber) {
                console.log('有手机号');
                that.setData({
                    haveNum: true,
                });
            } else {
                that.setData({
                    haveNum: false,
                });
                console.log('没手机号');
            }
        }
    },

    onNetworkStatusChanged(res) {
        this.setData({isConnected: res.isConnected});
    },

    onNoNetworkConnected() {
        console.log('onNoNetworkConnected', this.data.isConnected);
        WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
    },

    onShow() {
        // Protocol.checkHaveNetwork().then(() => {
        //     this.setData({isConnected: true});
        // }).catch(() => {
        //     this.setData({isConnected: false});
        // });
        // // @ts-ignore
        // this.setData({isConnected: getApp().globalData.isConnected});
        // UserInfo.get().then((res) => {
        //     this.setData({
        //         userInfo: res.userInfo,
        //         haveAuthorize: true
        //     })
        // })
    },

    getPhoneNumber(e) {
        let that = this
        const {detail: {encryptedData, iv, errMsg}} = e;
        if (errMsg == 'getPhoneNumber:ok') {
            Toast.showLoading();
            Protocol.getPhoneNum({
                encryptedData, iv
            }).then((phoneNumber) => {
                wx.setStorageSync('phoneNumber', phoneNumber);

            }).then((res) => {
                    that.setDataSmart({
                        haveNum: true
                    });
                }
            ).catch((res) => {
                console.log(res);
                Toast.showText('授权手机号失败，请重试');
            }).finally(() => {
                Toast.hiddenLoading();
                // HiNavigator.navigateToArrhyth();
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
            })
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
            wx.navigateTo({url: '../history/history'})
        }).catch((res) => {
            console.log(res);
        });
    },

    clickCell2() {
        this.app.$url.diseaseArrhyth.go();
    },

    clickCell3() {
        wx.navigateTo({url: '../feedback/feedback'})
    }
})
