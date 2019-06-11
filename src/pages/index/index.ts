/******************************************************************
MIT License http://www.opensource.org/licenses/mit-license.php
Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
*******************************************************************/

import {pagify, MyPage, wxp} from 'base/'
import { APIs } from './../../apis/request';
import { Admin } from './../../utils/admin';

// 把这个 class 转化成 微信的 Page 参数，并且注入全局 store
@pagify()
export default class extends MyPage {
  data = {
    userName: '',
    authorizeHidden: false
  }

  onShow() {
    /**
     * setDataSmart 和 setData 基本一样，但 setDataSmart 内部做过优化：
     *
     * 1. 支持双向绑定
     * 2. 页面隐藏是会缓存 data，等到页面显示的时候再 set
     */
    console.log("onShow...")
    this.updateUI()
  }

  async onLoad() {
    console.log("onLoad...")

    let that = this

    // 检查是否有版本更新
    that.checkUpdate()

    let userInfo = await Admin.default().userInfo()
    console.log("userInfo: %o", userInfo)
    that.setDataSmart({ authorizeHidden: userInfo ? true : false })
    if (userInfo) {
      that.setDataSmart({ userName: userInfo.nickName })
    }

    await wxp.showShareMenu({
      withShareTicket: true
    })

    // 本地已经有缓存，已经登录跳过，否则尝试登录
    const login = Admin.default().isLogin
    if (!login) {
      await that.login()
    } else {
      // 后台老版本bug，现在必须强制请求后台更新open_id
      that.updateWx()
    }
  }

  onHide() {
    console.log("onHide...")
  }

  async onReady() {
    console.log("onReady...")

    const login = Admin.default().isLogin
    if (!login) return

    // 检查用户数据是否完备
    const userData = Admin.default().userData
    console.log("userData: %o", userData)
    if (!userData || !userData.first_name || !userData.sex || !userData.birthday) {
      console.log("......ready go to userdata page")
      this.app.$url.userdata.go()
    } else if (userData.language_id != 1001) {
      // fix: 曾经已注册账号没有设定初始中文的，需要重新设定语言为中文
      await Admin.default().setLanguage()
    }

    this.updateUI()
  }

  onUnload() {
    console.log("onUnload...")
  }

  // gotoLogsPage() {
  //   // 跳转到 logs 页面
  //   this.app.$url.logs.go({id: 1})
  //   this.setDataSmart({motto: '开始跳转到 logs 页面'})
  // }

  async updateUI() {
    let that = this

    let uname = Admin.default().userName
    if (!uname) {
      let userInfo = await Admin.default().userInfo()
      if (userInfo && userInfo.nickName) {
        uname = userInfo.nickName
      } else {
        uname = "游客"
      }
    }
    if (Admin.default().isLogin) {
      that.setDataSmart({userName: `${uname}`})
    } else {
      that.setDataSmart({userName: `${uname}，请登录`})
    }
  }

  checkAccount() {
    console.log('账号点击')
    if (Admin.default().isLogin) {
      // TODO:
      // may be change account settings future
    } else {
      this.app.$url.login.go()
    }
  }

  goArrhyth() {
    console.log("常规心电检查")
    if (Admin.default().isLogin) {
      // TODO:
      // may be change account settings future
      this.app.$url.arrhyth.go()
    } else {
      this.app.$url.login.go()
    }
  }

  onUserInfo(e: any) {
    console.log("onUserInfo...")
    console.log("userInfo Event: %o", e)
    if (e.detail.userInfo) {
      Admin.default().setUserInfo(e.detail.userInfo)
      this.onLoad()
    }
  }

  onShareAppMessage(opts: any) {
    if (opts.from === 'button') {
      console.log(opts.target)
    }
    return {
      title: '四维心电',
      path: '/pages/index/index'
    }
  }

  private async login() {
    console.log("登录")

    let that = this
    try {
      let {code} = await wxp.login()
      let res = await APIs.default().postRequest({
        url: "login",
        data: {
          wxcode: code
        }
      })
      console.log('登录返回结果： %o', res)
      if (!!res) {
        if (res.resultcode == 1011) {
          // 非注册用户
          console.log("不是注册用户，需要用户先注册...")
        } else {
          const admin = Admin.default()
          admin.credit = res

          that.updateUI()

          APIs.default().updateCredit()

          let userData = admin.userData
          console.log("user data: %o", userData)
          if (!userData || !userData.first_name || !userData.birthday || !userData.sex) {
            this.app.$url.userdata.go()
          } else if (userData.language_id != 1001) {
            // 设置用户语言
            await admin.setLanguage()
          }
        }

      }
    } catch (err) {
      console.log(`login error: ${err}`)
    }

  }

  private async updateWx() {
    console.log("updateWx")

    try {
      let {code} = await wxp.login()
      let res = await APIs.default().postRequest({
        url: "oid",
        data: {
          wxcode: code
        }
      })
      console.log('登录返回结果： %o', res)
    } catch (err) {
      console.log(`login error: ${err}`)
    }

  }

  goDisease() {
    console.log('goDisease...')

    this.app.$url.diseaseArrhyth.go()
  }

  goManual() {
    console.log('goManual...')

    this.app.$url.manual.go()
  }

  checkUpdate() {
    const updateManager = wxp.getUpdateManager()

    updateManager.onCheckForUpdate(res => {
      console.log(`新版本：${res.hasUpdate}`)
    })

    let res = updateManager.onUpdateReady(async () => {
      try {
        let ret = await wxp.showModal({
          title: '更新提示',
          content: '新版本已经准备好了，请使用新版本！',
          showCancel: false
        })
        if (ret.confirm) {
          updateManager.applyUpdate()
        }
      } catch (err) {
        console.log('onUpdateReady弹窗更新时出错：%o', err)
      }
    })
    console.log('onUpdateReady返回结果：%o', res)

    res = updateManager.onUpdateFailed(() => {
      console.log('新版本下载失败，检查网络情况...')
    })
    console.log('onUpdateFailed返回结果：%o', res)

  }


}
