// 此文件是由模板文件 ".dtpl/page/$rawModuleName.ts.dtpl" 生成的，你可以自行修改模板

import { pagify, MyPage, wxp } from 'base/'

@pagify()
export default class extends MyPage {
  data = {
    reportUrl: '',
    ios: true
  }

  onloadSuccess() {
    console.log('加载完成');
    wx.setNavigationBarTitle({title: '检测报告'});
  }
  async onLoad(options: any) {
    // console.log(await wxp.getUserInfo())
    console.log("options: %o", options)
    let that = this

    // 显示分享按钮
    await wxp.showShareMenu({
      withShareTicket: true
    })

    if (options.reportUrl) {
      let reportUrl = decodeURIComponent(options.reportUrl)
      that.setDataSmart({
        reportUrl: reportUrl
      })
    }
    // try {
    //   let systemInfo = await wxp.getSystemInfo()
    //   if (systemInfo.platform === "ios") {
    //     that.setDataSmart({
    //       ios: true
    //     })
    //   } else {
    //     that.setDataSmart({
    //       ios: false
    //     })
    //     let res = await wxp.downloadFile({
    //       url: that.data.reportUrl
    //     })
    //     if (res.statusCode === 200) {
    //       await wxp.openDocument({
    //         filePath: res.tempFilePath
    //       })
    //     }
    //   }
    // } catch (err) {
    //   console.log("openDocument -- %o", err)
    // }

  }

  onShareAppMessage(opts: any) {
    let that = this

    if (opts.from === 'button') {
      console.log(opts.target)
    }
    return {
      title: '心电智能分析咨询报告',
      path: `/pages/report/report?reportUrl=${that.data.reportUrl}`,
      success: (res: any) => {
        console.log('报告分享成功...')
      },
      fail: (res: any) => {
        console.log('报告分享失败...')
      }
    }
  }

}
