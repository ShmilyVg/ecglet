import Protocol from "../../apis/network/protocol";
import Toast from "../../utils/toast";
import WXDialog from "../../utils/dialog";

Page({
    data: {
        reportUrl: '',
    },

    saveFile() {
        Protocol.downloadFile({url: this.data.reportUrl}).then(res => {
            const tempFilePath = res.tempFilePath;
            this.saveToLocal(tempFilePath);
        });

    },

    saveToLocal(tempFilePath) {
        wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: (res) => {
                Toast.success('保存成功');
            }, fail: (res) => {
                console.log(res);
                if (res.errMsg.indexOf('fail auth deny') !== -1) {
                    // WXDialog.showDialog({
                    //     title: '提示', content: '请您授权保存功能后\n才可正常使用该功能', confirmEvent: () => {
                    //         wx.getSetting({
                    //             success: (res) => {
                    //                 if (!res.authSetting['scope.writePhotosAlbum']) {
                    //                     wx.authorize({
                    //                         scope: 'scope.writePhotosAlbum',
                    //                         success: () => {
                    //                             // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                    //                             this.saveToLocal();
                    //                         },fail:res=>{
                    //                             console.log('1253',res);
                    //                             // wx.openSetting({
                    //                             //     success (res) {
                    //                             //         console.log(res.authSetting)
                    //                             //         // res.authSetting = {
                    //                             //         //   "scope.userInfo": true,
                    //                             //         //   "scope.userLocation": true
                    //                             //         // }
                    //                             //     },fail:res=>{
                    //                             //         console.log('1253',res);
                    //                             //
                    //                             //     }
                    //                             // })
                    //                         }
                    //                     })
                    //                 }
                    //             },fail:res=>{
                    //                 console.log('123',res);
                    //             }
                    //         });
                    //     }
                    // })

                } else {
                    Toast.warn('保存失败');
                }
            }
        })
    },
    prewview() {
        wx.previewImage({current: this.data.reportUrl, urls: [this.data.reportUrl]});
    },
    onLoad(options) {
        console.log("options: %o", options);

        // // 显示分享按钮
        // wx.showShareMenu({
        //     withShareTicket: true
        // });
        if (options.reportUrl) {
            let reportUrl = decodeURIComponent(options.reportUrl);
            this.setData({
                reportUrl: reportUrl
            });
        }
    },

    // onShareAppMessage(opts) {
    //     if (opts.from === 'button') {
    //         console.log(opts.target)
    //     }
    //     return {
    //         title: '心电智能分析咨询报告',
    //         path: `/pages/report/report?reportUrl=${this.data.reportUrl}`,
    //         success: (res) => {
    //             console.log('报告分享成功...')
    //         },
    //         fail: (res) => {
    //             console.log('报告分享失败...')
    //         }
    //     }
    // }
})
