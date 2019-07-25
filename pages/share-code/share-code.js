// pages/share-code/share-code.js
import drawQrcode from 'weapp-qrcode'
import Toast from "../../utils/toast";
import Protocol from "../../apis/network/protocol";

Page({
    data: {},

    onLoad() {
        Protocol.getQRCode({}).then((res) => {
            drawQrcode({
                width: 244,
                height: 244,
                canvasId: 'myQrcode',
                text: res.result.QRCodeUrl
            });
        })
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
