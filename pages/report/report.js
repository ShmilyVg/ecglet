Page({
    data: {
        reportUrl: 'http://backend.stage.hipee.cn/hipee-web-hiecg/pdf/cf46b88dc0700e8bc2366b4d1c690bae_15820.pdf',
    },

    saveFile() {

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
