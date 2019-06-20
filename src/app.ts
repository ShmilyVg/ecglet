/******************************************************************
MIT License http://www.opensource.org/licenses/mit-license.php
Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
*******************************************************************/

import {appify, MyApp, wxp} from 'base/'
import 'utils/config';
// @ts-ignore
import Login from "./apis/network/login";
// @ts-ignore
import UserInfo from "./apis/network/userInfo.js";
// import {APIs} from 'apis/request'

@appify({pages: require('./app.cjson?pages'), tabBarList: require('./app.cjson?tabBar.list')})
export default class extends MyApp {
  needRegisterCallBack = function () {};
    globalData = {userInfo: {}, tempGatherResult: {}, isConnected: true};
  onLoginSuccess: any;

  async onLaunch() {
    // 检查是否小程序登录用户
    // 如果有登录记录，检查登录时效

    console.log('qqq')
    wx.onNetworkStatusChange((res)=> {
      console.log('网络状态变更', res);
      this.globalData.isConnected = res.isConnected;
      const currentPages = getCurrentPages();
      if (currentPages && currentPages.length) {
        const pageListener = currentPages[currentPages.length - 1].onNetworkStatusChanged;
        console.log('页面监听函数', pageListener);
        pageListener && pageListener(res);
      }
      // }
    });

    Login.doLogin().then((data: any) => {
      return UserInfo.get();
    }).then((res: any) => {
      console.log('app getUserInfo',res);
      wxp.setStorageSync('phoneNumber', res.userInfo.phone || '');
      wxp.setStorageSync('isRegister', true);
      this.onLoginSuccess && this.onLoginSuccess();
    }).catch((res: any) => {
      if (res && res.data && res.data.code === 2) {
        this.needRegisterCallBack && this.needRegisterCallBack();
      }
    });
    // try {
    //   let res = await wxp.setKeepScreenOn({
    //     keepScreenOn: true
    //   })
    //   console.log(`wxp.setKeepScreenOn(true) -- ${res.errMsg}`)
    //
    //   await wxp.checkSession()
    //   console.log("已登录，可以获取用户头像和昵称...")
    // } catch (error) {
    //   console.log(`wxp.checkSession-- ${error.message}`)
    //   try {
    //     let res = await wxp.login()
    //     console.log(`wxp.login-- (${res.code}): ${res.errMsg}`)
    //   } catch (error) {
    //     console.log(`wxp.login -- ${error.message}`)
    //   }
    // }


    // 检查是否授权获取用户信息

  }

}
