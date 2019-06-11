import {pagify, MyPage, wxp} from 'base/'
// import { wxp } from '../../../types/wxp'
import { APIs } from 'apis/request';
import { Md5 } from 'ts-md5/dist/md5';
import { Admin } from './../../utils/admin';


@pagify()
export default class extends MyPage {
  data = {
    mobile: '',
    password: '',
    pin: '',
    currentSelect: 0,
    disabled: true,
    time: '获取验证码',
    currentTime: 120,
    passHidden: true,
    showPassIcon: '../../assets/icons',
    sendBtnOpacity: 0.4,
    regBtnOpacity: 0.4,
    regDisabled: true,
    loginDisabled: true,
    loginBtnOpacity: 0.4,
    toastMessage: '',
    toast: false
  }

  async onLoad(options: any) {
    // console.log(await wxp.getUserInfo())
    console.log("登录页面")
  }

  switchTab(e: any) {
    console.log("点击切换事件：%o", e)

    let that = this
    if (that.data.currentSelect === e.currentTarget.dataset.current) {
      return false
    } else {
      that.setDataSmart({currentSelect: e.currentTarget.dataset.current})
      return true
    }
  }

  swipeChange(e: any) {
    console.log(`滑动切换事件：%o`, e)
    this.setDataSmart({currentSelect: e.detail.current})
  }

  bindMobileInput(e: any) {
    this.setDataSmart({mobile: e.detail.value})
    let phoneValid = this.isMobileValid()
    this.setDataSmart({disabled: !phoneValid})
    this.setDataSmart({sendBtnOpacity: phoneValid ? 1 : 0.4})

    this.checkResultButton()
  }

  private isMobileValid(): boolean {
    const mobileRegexp = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    let valid = mobileRegexp.test(this.data.mobile)
    console.log(`手机检查结果: ${valid}`)
    return valid
  }

  private isPinValid(): boolean {
    const pinRegExp = /^\d{6}$/
    let valid = pinRegExp.test(this.data.pin)
    console.log(`验证码检查结果: ${valid}`)
    return valid
  }

  private isPasswordValid(): boolean {
    const passRegExp = /^[a-zA-Z0-9]{6,20}$/
    let valid = passRegExp.test(this.data.password)
    console.log(`密码检查结果: ${valid}`)
    return valid
  }

  private checkRegisterDisabled() {
    let valid = this.isMobileValid() && this.isPinValid() /*&& this.isPasswordValid()*/
    console.log(`注册使能：${valid}`)
    this.setDataSmart({regDisabled: !valid})
    this.setDataSmart({regBtnOpacity: valid ? 1.0 : 0.4})
  }

  private checkLoginDisabled() {
    let valid = this.isMobileValid() && this.isPasswordValid()
    console.log(`登录使能：${valid}`)
    this.setDataSmart({loginDisabled: !valid})
    this.setDataSmart({loginBtnOpacity: valid ? 1.0 : 0.4})
  }

  private checkResultButton() {
    if (this.data.currentSelect == 0) {
      this.checkRegisterDisabled()
    } else {
      this.checkLoginDisabled()
    }
  }

  bindPinInput(e: any) {
    this.setDataSmart({pin: e.detail.value})

    this.checkResultButton()
  }

  async sendCode() {
    let that = this;
    that.setDataSmart({disabled: true})
    this.setDataSmart({sendBtnOpacity: 0.4})
    let currentTime = that.data.currentTime;
    that.setDataSmart({time: currentTime + '秒'})

    let interval = setInterval(function () {
      that.setDataSmart({time: (--currentTime) + '秒'})
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setDataSmart({
          time: '重新获取',
          disabled: false,
          sendBtnOpacity: 1.0,
          currentTime: 120
        })
      }
    }, 1000)

    let res = await APIs.default().getPinCode(this.data.mobile)
    console.log(`Get PIN code: %o`, res)
  }

  bindPassInput(e: any) {
    let that = this;
    that.setDataSmart({password: e.detail.value})

    this.checkResultButton()
  }

  changePassIcon() {
    console.log("show or hidden password tapped......")
    let that = this;
    that.setDataSmart({passHidden: !that.data.passHidden})
  }

  async register() {
    console.log("注册")
    let {code} = await wxp.login()
    let res = await APIs.default().postRequest({
      url: "register",
      data: {
        mobile: this.data.mobile,
        verificationcode: this.data.pin,
        // password: Md5.hashStr(this.data.password),
        code: code
      }
    })
    console.log('注册返回结果： %o', res)
    if (res) {
      Admin.default().credit = res
      APIs.default().updateCredit()

      // 注册成功，跳转主页
      // this.app.$back()
      this.app.$url.userdata.go()
    }
  }

  async login() {
    console.log("登录")
    let res = await APIs.default().postRequest({
      url: "/login",
      data: {
        mobile: this.data.mobile,
        password: Md5.hashStr(this.data.password),
      }
    })
    console.log('登录返回结果： %o', res)
    if (res) {
      const admin = Admin.default()
      admin.credit = res

      APIs.default().updateCredit()

      let userData = admin.userData
      if (!userData || !userData.first_name || !userData.birthday || !userData.sex) {
        this.app.$url.userdata.go()
      } else {
        // 登录成功，跳转主页
        this.app.$back()
      }
    }
  }

}