import { wxp } from 'base/';
import { APIs } from '../apis/request';

type UserData = {
  first_name?: string
  sex?: number
  birthday?: number
  language_id?: number
  doctor?: string
  hospital?: string
}

type Credit = {
  mobile?: string
  uid?: string
  unionid?: string
  openid?: string
  rtoken?: string
  user_data?: {
    birthday?: number
    sex?: number
    first_name?: string
    language_id?: number
    doctor?: string
    hospital?: string
  }
}

export class Admin {
  private static instance: Admin

  private _userInfo?: wxp.getUserInfo.PromisedPropUserInfo

  private constructor() {}

  static default() {
    if (!this.instance) {
      this.instance = new Admin()
    }
    return this.instance
  }

  get isLogin() {
    let credit = wxp.getStorageSync('credit')
    if (!!credit && !!credit.uid && !!credit.rtoken && !!credit.openid) {
      return true
    }
    return false
  }

  async userInfo() {
    if (!this._userInfo) {
      try {
        let setting = await wxp.getSetting()
        if (setting.authSetting['scope.userInfo']) { // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // 可以将 getUserInfo 返回的对象发送给后台解码出 unionId
          let res = await wxp.getUserInfo()
          console.log('微信 userInfo %o, encryptdata, iv: %o', res.userInfo, res.encryptedData, res.iv)
          this._userInfo = res.userInfo
        } else {
          console.log('没有授权。需要您的授权...')
          // let ret = await wxp.authorize({
          //   scope: "scope.userInfo"
          // })
          // console.log(`wxp.authorize: ${ret.errMsg}`)
          // let res = await wxp.getUserInfo()
          // if (res) {
          //   console.log('getUserInfo again: %o', res.userInfo)
          //   this._userInfo = res.userInfo
          //   return Promise.resolve(this._userInfo)
          // }
        }
      } catch (error) {
        console.log('getUserInfo error: %o', error)
      }
    }
     return Promise.resolve(this._userInfo)
  }

  setUserInfo(newValue: wxp.getUserInfo.PromisedPropUserInfo) {
    this._userInfo = newValue
  }

  get userName(): string | undefined  {
    let credit = wxp.getStorageSync("credit")
    return credit.mobile
  }

  get uid(): string | undefined {
    let credit = wxp.getStorageSync("credit")
    return credit.uid
  }

  get credit(): Credit | undefined {
    let credit = wxp.getStorageSync("credit")
    if (!credit || !credit.uid) return
    let obj: any = {
      mobile: credit.mobile,
      uid: credit.uid,
      openid: credit.openid,
      unionid: credit.unionid,
      rtoken: credit.rtoken,
    }
    if (!!credit.user_data) {
      obj.user_data = {
        first_name: credit.user_data.first_name,
        sex: credit.user_data.sex,
        birthday: credit.user_data.birthday,
        language_id: credit.user_data.language_id,
        doctor: credit.user_data.doctor,
        hospital: credit.user_data.hospital
      }
    }
    return obj
  }

  set credit(newValue: Credit | undefined) {
    if (newValue) {
      wxp.setStorageSync("credit", newValue)
    }
  }

  get userData(): UserData | undefined {
    const credit = this.credit
    if (!credit || !credit.uid || !credit.user_data) return
    return {
      first_name: credit.user_data.first_name,
      sex: credit.user_data.sex,
      birthday: credit.user_data.birthday,
      language_id: credit.user_data.language_id,
      doctor: credit.user_data.doctor,
      hospital: credit.user_data.hospital
    }
  }

  set userData(data: UserData | undefined) {
    const credit = this.credit
    if (!credit || !credit.uid) {
      throw new Error("尚未登录或注册，无法修改用户信息！")
    }
    if (!data) {
      console.log("用户数据为空，直接返回...")
      return
    }
    if (!credit.user_data) {
      credit.user_data = data
    } else {
      credit.user_data.birthday = data.birthday
      credit.user_data.sex = data.sex
      credit.user_data.first_name = data.first_name
      credit.user_data.language_id = data.language_id
      credit.user_data.doctor = data.doctor
      credit.user_data.hospital = data.hospital
    }
    wxp.setStorageSync("credit", credit)
  }

  async setLanguage() {
    try {
      let data = {
        language_id: 1001
      }
      await APIs.default().postRequest({
        url: 'bs/modify',
        data: data
      })

      const credit = this.credit
      if (!!credit && !!credit.user_data) {
        credit.user_data.language_id = data.language_id

        wxp.setStorageSync("credit", credit)
      }

    } catch (err) {
      console.log("setLanguage error: %o", err)
    }
  }

  clear() {
    wxp.clearStorage()
  }
}