Page({
    data: {
        reportUrl: '',
        ios: true
    },

    onloadSuccess() {
        console.log('加载完成');
        wx.setNavigationBarTitle({title: '检测报告'});
    },

    onLoad(options) {
        console.log("options: %o", options);

        // 显示分享按钮
        wx.showShareMenu({
            withShareTicket: true
        });

        if (options.reportUrl) {
            let reportUrl = decodeURIComponent(options.reportUrl);
            this.setData({
                reportUrl: reportUrl
            })
        }
    },

    onShareAppMessage(opts) {
        if (opts.from === 'button') {
            console.log(opts.target)
        }
        return {
            title: '心电智能分析咨询报告',
            path: `/pages/report/report?reportUrl=${this.data.reportUrl}`,
            success: (res) => {
                console.log('报告分享成功...')
            },
            fail: (res) => {
                console.log('报告分享失败...')
            }
        }
    }
})