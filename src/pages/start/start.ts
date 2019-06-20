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
// @ts-ignore
import WXDialog from "../../base/heheda-common-view/dialog";

@pagify()
export default class extends MyPage {
    data = {
        nameShow: '',
        userPic: '',
        isConnected: true
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

    onNetworkStatusChanged(res:any) {
        this.setData({isConnected: res.isConnected});
    }
    onNoNetworkConnected() {
        console.log('onNoNetworkConnected', this.data.isConnected);
        WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
    }
    async onGotUserInfo(e: any) {
        console.log('onGotUserInfo isConnected=', this.data.isConnected);
        dealAuthUserInfo(e).then((res: any) => {
            this.setData({userInfo: res.userInfo});
            HiNavigator.navigateToArrhyth();
        }).catch((res: any) => {
            console.log(res);
        });
    }


}
