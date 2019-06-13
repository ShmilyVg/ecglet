import {pagify, MyPage} from 'base/'


@pagify()
export default class extends MyPage {
  data = {

  }

    async start() {
        wx.getSetting({
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
        })
    }


}
