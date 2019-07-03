//app.js
// import "heheda-update";
// import "heheda-adapter";
import 'utils/config';
import Login from "./apis/network/network/libs/login";
import UserInfo from "./apis/network/network/libs/userInfo";

App({
  onLaunch: function () {
    // 展示本地存储能力
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

    Login.doLogin().then((data) => {
      return UserInfo.get();
    }).then((res) => {
      console.log('app getUserInfo',res);
      wx.setStorageSync('isRegister', true);
      if (!wx.getStorageSync('phoneNumber')) {
        wx.setStorageSync('phoneNumber', res.userInfo.phone || '');
      }
      this.onLoginSuccess && this.onLoginSuccess();
    }).catch((res) => {
      if (res && res.data && res.data.code === 2) {
        this.needRegisterCallBack && this.needRegisterCallBack();
      }
    });
  },
  globalData: {
    userInfo: {}, tempGatherResult: {}, isConnected: true
  },
  needRegisterCallBack: null,
  onLoginSuccess: null,

});
