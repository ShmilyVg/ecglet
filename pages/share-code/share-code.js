// pages/share-code/share-code.js
import drawQrcode from 'weapp-qrcode'
import Toast from "../../utils/toast";

Page({
    data: {},

    onLoad() {
        drawQrcode({
            width: 244,
            height: 244,
            canvasId: 'myQrcode',
            text: '1234567890'
        });
        // Protocol.getRelatedQrcode({}).then(data => {
        //
        // })
    },

    saveCanvas() {
        Toast.showLoading('保存中...');
        wx.canvasToTempFilePath({
            canvasId: 'myQrcode',
            success: (res) => {
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: () => {
                        Toast.success('保存成功');
                    }, fail: () => {
                        Toast.success('保存失败请重试');
                    }
                })
            }
        })
    }
})
