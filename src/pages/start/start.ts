import {MyPage, pagify} from 'base/'
// @ts-ignore
import Login from '../../apis/network/login.js';
// @ts-ignore
import UserInfo from '../../apis/network/userInfo.js';
// @ts-ignore
import HiNavigator from '../../components/navigator/hi-navigator.js'
// @ts-ignore
import Toast from '../../base/heheda-common-view/toast.js';

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
        if (!!userInfo) {
            Toast.showLoading();
            Login.doRegister({
                userInfo, encryptedData, iv
            }).then(() => UserInfo.get())
                .then((res: any) => {
                        !this.setData({userInfo: res.userInfo});
                    }
                ).catch(() => {
                setTimeout(Toast.warn, 0, '获取信息失败');
            }).finally(() => {
                    Toast.hiddenLoading();
                    HiNavigator.navigateToArrhyth();
                });
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
