import {MyPage, pagify} from 'base/'
// @ts-ignore
// @ts-ignore
import UserInfo from '../../apis/network/userInfo.js';
// @ts-ignore
import HiNavigator from '../../components/navigator/hi-navigator.js'
// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
import {dealAuthUserInfo} from "../../utils/tools";
import Toast from "../../base/heheda-common-view/toast";

@pagify()
export default class extends MyPage {
    data = {
        nameShow: '',
        userPic: ''
    }

    onLoad(param: any): any {
        UserInfo.get().then((res:any)=>{
            // @ts-ignore
            this.setData({
                nameShow: res.userInfo.nickName,
                userPic: res.userInfo.portraitUrl
            })
        })
    }

    onShow(){
        UserInfo.get().then((res:any)=>{
            // @ts-ignore
            this.setData({
                nameShow: res.userInfo.nickName,
                userPic: res.userInfo.portraitUrl
            })
        })
    }

    async onGotUserInfo(e: any) {
        dealAuthUserInfo(e).then((res: any) => {
            this.setData({userInfo: res.userInfo});
            HiNavigator.navigateToArrhyth();
        }).catch((res: any) => {
            Toast.showText('授权用户信息失败，请重试');
            console.log(res);
        });
        // Protocol.getNetworkType().then((res: any) => {
        //     if (res.networkType === 'none' || res.networkType === 'unknown') {
        //         WXDialog.showDialog({content: '请检查网络'});
        //         return;
        //     }
        //     const {
        //         detail: {
        //             userInfo,
        //             encryptedData,
        //             iv
        //         }
        //     } = e;
        //     console.log(e);
        //     if (!!userInfo) {
        //         if (!!wxp.getStorageSync('isRegister')) {
        //             HiNavigator.navigateToArrhyth();
        //         } else {
        //             Toast.showLoading();
        //             Login.doRegister({
        //                 encryptedData, iv
        //             }).then(() => UserInfo.get())
        //                 .then((res: any) => {
        //                         console.log(res);
        //                         wxp.setStorageSync('isRegister', this.data.isRegister = true);
        //                         !this.setData({userInfo: res.userInfo});
        //                     }
        //                 ).catch((res: any) => {
        //                 console.log(res);
        //                 setTimeout(Toast.warn, 0, '获取信息失败');
        //             }).finally(() => {
        //                 Toast.hiddenLoading();
        //                 HiNavigator.navigateToArrhyth();
        //             });
        //         }
        //
        //     } else {
        //         WXDialog.showDialog({content: '因您拒绝授权，无法使用更多专业服务', showCancel: false});
        //     }
        // });

        /*wx.getSetting({
            success (res){
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: function(res) {
                            console.log(res.userInfo)
                        }
                    })
                }
            }
        })*/
    }


}
