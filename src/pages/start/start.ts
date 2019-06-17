import {pagify, MyPage, wxp} from 'base/'
import {Admin} from './../../utils/admin'


@pagify()
export default class extends MyPage {
  data = {

  }

    async start() {
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
        console.log('qqq')
        wx.navigateTo({
            url: '../arrhyth/arrhyth'
        })
    }


}
