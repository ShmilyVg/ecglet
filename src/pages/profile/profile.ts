// 此文件是由模板文件 ".dtpl/page/$rawModuleName.ts.dtpl" 生成的，你可以自行修改模板

import {pagify, MyPage, wxp} from 'base/';
// @ts-ignore
import Login from '../../apis/network/login.js';
// @ts-ignore
import UserInfo from '../../apis/network/userInfo.js';
// @ts-ignore
import HiNavigator from '../../components/navigator/hi-navigator.js'
// @ts-ignore
import Toast from '../../base/heheda-common-view/toast.js';
// @ts-ignore
import Protocol from '../../apis/network/protocol.js'
// @ts-ignore
import WXDialog from "../../base/heheda-common-view/dialog";
// @ts-ignore
import {dealAuthUserInfo} from "../../utils/tools";


@pagify()
export default class extends MyPage {
    data = {
        phone: '4009210610',
        haveNum: false,
        haveAuthorize: false
    };
    isRegister = false;

    async onLoad(options: any) {
        // console.log(await wxp.getUserInfo())
        let that = this;
        // if (!!wxp.getStorageSync('isRegister')) {
        //     UserInfo.get().then((res: any) => {
        //
        //
        //     });
        // }

        if (!!wxp.getStorageSync('isRegister')) {
            console.log('注册过了');
            let phoneNum = wx.getStorageSync('phoneNumber');
            console.log('手机号：', phoneNum);
            if (phoneNum === "") {
                that.setDataSmart({
                    haveNum: false,
                    haveAuthorize: true
                });
            } else {
                that.setDataSmart({
                    haveNum: true,
                    haveAuthorize: true
                });
            }
            UserInfo.get().then((res: any) => {
                console.log('res:', res);
                that.setDataSmart({
                    userInfo: res.userInfo
                })
            })
        } else {
            console.log('还没注册');
            if (wx.getStorageSync('phoneNumber')) {
                console.log('有手机号');
                that.setDataSmart({
                    haveNum: true,
                });
            } else {
                console.log('没手机号');
            }
        }
    }

    onShow() {
        UserInfo.get().then((res: any) => {
            this.setData({
                userInfo: res.userInfo
            })
        })
    }

    getPhoneNumber(e: any) {
        let that = this
        const {detail: {encryptedData, iv, errMsg}} = e;
        if (errMsg == 'getPhoneNumber:ok') {
            Toast.showLoading();
            Protocol.getPhoneNum({
                encryptedData, iv
            }).then((phoneNumber: any) => {
                wx.setStorageSync('phoneNumber', phoneNumber);

            }).then((res: any) => {
                    that.setDataSmart({
                        haveNum: true
                    })
                }
            ).catch((res: any) => {
                console.log(res);
                setTimeout(Toast.warn, 0, '获取信息失败');
            }).finally(() => {
                Toast.hiddenLoading();
                // HiNavigator.navigateToArrhyth();
            });
        } else {
            WXDialog.showDialog({content: '因您拒绝授权，无法使用更多专业服务', showCancel: false});
        }
    }

    onGotUserInfo(e: any) {
        dealAuthUserInfo(e).then((res: any) => {
            this.setDataSmart({
                haveAuthorize: true,
                userInfo: res.userInfo
            })
        }).catch((res: any) => {
            console.log(res);
        });
    }

    async toEditInfo() {
        if (!!wxp.getStorageSync('isRegister')) {
            wx.navigateTo({
                    url: '../userdata/userdata'
                }
            );
        } else {
            Toast.warn('请您授权');
        }
    }

    async onGotUserInfoAndToHistory(e: any) {
        dealAuthUserInfo(e).then((res: any) => {
            this.setDataSmart({
                haveAuthorize: true,
                userInfo: res.userInfo
            });
            wx.navigateTo({url: '../history/history'})
        }).catch((res: any) => {
            console.log(res);
        });
    }

    async clickCell2() {
        this.app.$url.diseaseArrhyth.go();
    }

    async clickCell3() {
        wx.navigateTo({url: '../feedback/feedback'})
    }
};
