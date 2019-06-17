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


@pagify()
export default class extends MyPage {
    data = {
        phone: '4009210610',
        haveNum: false,
        haveAuthorize: false
    }

    async onLoad(options: any) {
        // console.log(await wxp.getUserInfo())
        let that = this;
        if (!!wxp.getStorageSync('isRegister')) {
            console.log('注册过了');
            that.setDataSmart({
                haveNum: true,
                haveAuthorize: true
            });
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
            Toast.showLoading('手机号授权失败~')
        }
    }

    onGotUserInfo(e: any) {
        const {detail: {encryptedData, iv}} = e;
        Toast.showLoading();
        Login.doRegister({
            encryptedData, iv
        }).then(() => UserInfo.get())
            .then((res: any) => {
                    wxp.setStorageSync('isRegister', true);
                    // !this.setData({userInfo: res.userInfo});
                    this.setDataSmart({
                        haveAuthorize: true
                    })
                }
            ).catch((res: any) => {
            console.log(res);
            setTimeout(Toast.warn, 0, '获取信息失败');
        }).finally(() => {
            Toast.hiddenLoading();
        });
    }

    async toEditInfo() {
        wx.navigateTo({
                url: '../userdata/userdata'
            }
        )
    }

    async clickCell1() {
        wx.navigateTo({url: '../history/history'})
    }

    async clickCell2() {
        this.app.$url.diseaseArrhyth.go();
    }

    async clickCell3() {
        wx.navigateTo({url: '../feedback/feedback'})
    }
}
