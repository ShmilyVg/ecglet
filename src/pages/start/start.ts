import {MyPage, pagify} from 'base/'
// @ts-ignore
// @ts-ignore
import UserInfo from '../../apis/network/userInfo.js';
// @ts-ignore
import HiNavigator from '../../components/navigator/hi-navigator.js'
// @ts-ignore
import {dealAuthUserInfo} from "../../utils/tools";
// @ts-ignore
import WXDialog from "../../base/heheda-common-view/dialog";
// @ts-ignore
import Protocol from "../../apis/network/protocol";

@pagify()
export default class extends MyPage {
    data = {
        userInfo: {},
        isConnected: true
    }

    onLoad(param: any): any {
        // @ts-ignore
        getApp().onLoginSuccess = ()=>{
            this.setData({haveAuthorize: true});
        }
    }

    onShow(){
        Protocol.checkHaveNetwork().then(() => {
            this.setData({isConnected: true});
        }).catch(() => {
            this.setData({isConnected: false});
        });
        // @ts-ignore
        this.setData({isConnected: getApp().globalData.isConnected});
        UserInfo.get().then((res:any)=>{
            // res.userInfo.portraitUrl = '';
            // @ts-ignore
            this.setData({
                userInfo: res.userInfo,
            })
        })
    }

    toNormalTestPage() {
        Protocol.checkHaveNetwork().then(()=>{
            HiNavigator.navigateToArrhyth();
        }).catch(()=>{
            WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
        })
    }
    to02TestPage() {
        Protocol.checkHaveNetwork().then(()=>{
            HiNavigator.navigateToArrhyth({type: 3});
        }).catch(()=>{
            WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
        })
    }
    onNetworkStatusChanged(res:any) {
        this.setData({isConnected: res.isConnected});
    }
    onNoNetworkConnected() {
        console.log('onNoNetworkConnected', this.data.isConnected);
        WXDialog.showDialog({content: '网络断开，请检查网络后重新测试'});
    }
    async onGotUserInfoNormalTest(e: any) {
        console.log('onGotUserInfoNormalTest isConnected=', this.data.isConnected);
        dealAuthUserInfo(e).then((res: any) => {
            this.setData({userInfo: res.userInfo});
            HiNavigator.navigateToArrhyth();
        }).catch((res: any) => {
            console.log(res);
        });
    }
    async onGotUserInfo02Test(e: any) {
        console.log('onGotUserInfo02Test isConnected=', this.data.isConnected);
        dealAuthUserInfo(e).then((res: any) => {
            this.setData({userInfo: res.userInfo});
            HiNavigator.navigateToArrhyth({type: 3});
        }).catch((res: any) => {
            console.log(res);
        });
    }


}
