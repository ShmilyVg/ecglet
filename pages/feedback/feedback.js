Page({
    data: {},
    savePic() {
        wx.downloadFile({
            url: 'https://backend.stage.hipee.cn/hipee-web-hiecg/img/mine_fankui_hipeeerweima.png',
            success(res) {
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
})
