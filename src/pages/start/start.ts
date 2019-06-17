import {MyPage, pagify, wxp} from 'base/'
// @ts-ignore
import Login from '../../apis/network/login.js';
// @ts-ignore
import UserInfo from '../../apis/network/userInfo.js';
// @ts-ignore
import HiNavigator from '../../components/navigator/hi-navigator.js'
// @ts-ignore
import Toast from '../../base/heheda-common-view/toast.js';
// @ts-ignore
import WXDialog from '../../base/heheda-common-view/dialog.js';

@pagify()
export default class extends MyPage {
    data = {
        isRegister: true
    }

    onLoad(param: any): any {

    }

    async onGotUserInfo(e: any) {

        const {
            detail: {
                userInfo,
                encryptedData,
                iv
            }
        } = e;
        console.log(e);
        if (!!userInfo) {
            if (!!wxp.getStorageSync('isRegister')) {
                HiNavigator.navigateToArrhyth();
            } else {
                Toast.showLoading();
                Login.doRegister({
                    encryptedData, iv
                }).then(() => UserInfo.get())
                    .then((res: any) => {
                        console.log(res);
                        wxp.setStorageSync('isRegister', this.data.isRegister = true);
                            !this.setData({userInfo: res.userInfo});
                        }
                    ).catch((res:any) => {
                    console.log(res);
                    setTimeout(Toast.warn, 0, '获取信息失败');
                }).finally(() => {
                    Toast.hiddenLoading();
                    HiNavigator.navigateToArrhyth();
                });
            }

        } else {
            WXDialog.showDialog({content: '因您拒绝授权，无法使用更多专业服务', showCancel: false});
        }
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
