import {pagify, MyPage} from 'base/'


@pagify()
export default class extends MyPage {
  data = {

  }
  async savePic() {
      wx.downloadFile({
          url: 'http://backend.hipee.cn/assets/home/images/mine_fankui_hipeeerweima2x.png',
          success (res) {
              console.log(res)
              if (res.statusCode === 200) {
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res) {
                      wx.showToast({
                          title: '保存成功',
                          icon: 'success',
                          duration: 2000
                      })
                    },
                    fail(res) {
                        console.log(res)
                        wx.showToast({
                            title: '保存失败',
                            icon: 'fail',
                            duration: 2000
                        })
                    }
                })
              }
          }
      })
  }
}
