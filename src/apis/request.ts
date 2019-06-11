import { wxp } from 'base/'
import { Md5 } from 'ts-md5/dist/md5';
import '../extensions/Date.extensions'
import { Admin } from "../utils/admin"

type Params = {
  url: string,
  data?: any | string | ArrayBuffer,
  header?: any
}

interface APIResponse {
  resultcode: number
  message: string
  data?: any
}

interface SignParam<T> {
  [key: string]: T
}

interface Signaturable {
  addSignature(parameters?: SignParam<any>): SignParam<string>;
}

export class APIs implements Signaturable {

  private static host = "dev.jdremedical.com:8443"
  // private static host = "ecgai.jdremedical.com"

  private static base = 'https://' + APIs.host + '/v1'
  private static wxBase = APIs.base + '/wxsp'
  private static instance: APIs

  private _header: any

  private constructor() {
    let systemInfo = wxp.getSystemInfoSync()

    this._header = {
      program_id: '605b064c6ea3cf7f',
      channel: 'wx',
      program_ver: '0.9.7',
    }
    if (systemInfo.system) this._header.os_ver = systemInfo.system
    if (systemInfo.version) this._header.wx_ver = systemInfo.version
    if (systemInfo.brand) this._header.wx_ver = systemInfo.brand
    if (systemInfo.model )  this._header.model = systemInfo.model
    if (systemInfo.platform) this._header.platform = systemInfo.platform

    this.updateCredit()
  }

  updateCredit() {
    let credit = Admin.default().credit

    if (credit && credit.uid)  this._header.uid = credit.uid
    if (credit && credit.openid) this._header.openid = credit.openid
    if (credit && credit.unionid) this._header.unionid = credit.unionid
    if (credit && credit.rtoken) this._header.rtoken = credit.rtoken
  }

  static default(): APIs {
    if (!this.instance) {
      this.instance = new APIs()
    }
    return this.instance
  }

  isHttpSuccess(status: number): boolean {
    return status >= 200 && status < 300 || status === 304
  }

  addSignature(parameters?: SignParam<any>): SignParam<string> {
    let toSign: SignParam<string> = {}
    if (parameters) {
      for (const key in parameters) {
        toSign[key] = parameters[key].toString()
      }
    }
    toSign["timestamp"] = new Date().format("yyyyMMddHHmmss")
    let sortedKeys = Object.keys(toSign).sort().filter(k => k && k.length > 0)
    let sortedSign = sortedKeys.map(k => k + "=" + toSign[k])
    sortedSign.push("key=AB51D1290264F4A8032ADE1B63B1B879")
    let endSign =  Md5.hashStr(sortedSign.join("&"))
    if (typeof endSign === "string") {
      toSign['sign'] = endSign
    }

    return toSign
  }

  /**
   * GET类型API请求
   * @param url
   * @param data
   * @param header
   */
  async getRequest(params: Params, showLoading = true) {
    return this._request(params, 'GET', showLoading)
  }

  async deleteRequest(params: Params, showLoading = true) {
    return this._request(params, 'DELETE', showLoading)
  }

  async postRequest(params: Params, showLoading = true) {
    return this._request(params, 'POST', showLoading)
  }

  async putRequest(params: Params, showLoading = true) {
    return this._request(params, 'PUT', showLoading)
  }

  async uploadRequest(params: wxp.uploadFile.Param, showLoading = true) {
    let that = this
    let timeStart = Date.now()

    let cParams = params
    if (!!cParams.url && !!cParams.url.length) {
      if (cParams.url[0] !== '/') {
        cParams.url = '/' + cParams.url
      }
      cParams.url = APIs.wxBase + cParams.url
    } else {
      throw new Error("接口请求为空")
    }
    if (!cParams.header) {
      cParams.header = that._header
    }

    try {
      if (showLoading) {
        wxp.showLoading({
          title: "处理中，请等待"
        })
      }
      let res = await wxp.uploadFile(params)
      if (showLoading) {
        wxp.hideLoading()
      }
      console.log(`耗时${Date.now() - timeStart}`)
      if (that.isHttpSuccess(res.statusCode)) {
        console.log("网络请求结果：%o", res)
        return Promise.resolve(res.data)
      } else {
        throw new Error(`网络请求错误，返回状态: ${res.statusCode}`)
      }
    } catch (error) {
        console.log("发生错误：%o", error)
        wxp.showToast({
          title: error.name + ': ' + error.message,
          icon: 'none',
          duration: 3000
        })
    }
    return Promise.resolve("")
  }

  async getPinCode(mobile: string) {
    try {
      let params: SignParam<any> = {
        type: "register"
      }
      params = this.addSignature(params)
      let res = await wxp.request({
        method: "PUT",
        url: APIs.base + "/sms/" + mobile,
        data: params,
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
      })
      wx.hideLoading()
      console.log(`${mobile}: 请求短信验证码......`)
      if (this.isHttpSuccess(res.statusCode)) {
        console.log("请求结果：%o", res)
        return Promise.resolve(res.data)
      } else {
        throw new Error(`网络请求错误，返回状态: ${res.statusCode}`)
      }
    } catch (error) {
        console.log("发生错误：%o", error)
        wxp.showToast({
          title: error.name + ': ' + error.message,
          icon: 'none',
          duration: 3000
        })
    }

  }

  private async _request(params: Params, method: string, showLoading: boolean) {
    let timeStart = Date.now();
    let cParams = params
    if (!!cParams.url && !!cParams.url.length) {
      if (cParams.url[0] !== '/') {
        cParams.url = '/' + cParams.url
      }
      cParams.url = APIs.wxBase + cParams.url
    } else {
      throw new Error("接口请求为空")
    }
    (cParams as any).method = method;
    cParams.header || (cParams.header = this._header)
    if (method == 'POST' || method == 'PUT' || method == 'DELETE') {
      cParams.header['content-type'] = 'application/x-www-form-urlencoded;charset=utf-8'
    } else {
      cParams.header['content-type'] = 'application/json;charset=utf-8'
    }

    try {
      if (showLoading) {
        wxp.showLoading({
          title: "处理中，请等待"
        })
      }
      let res = await wxp.request(cParams)
      if (showLoading) {
        wxp.hideLoading()
      }
      console.log(`耗时${Date.now() - timeStart}`)
      if (this.isHttpSuccess(res.statusCode)) {
        console.log("网络请求结果：%o", res)
        let result: APIResponse = res.data
        if (result.resultcode == 1011) {
          return Promise.resolve(result)
        } else if (result.resultcode) {
          throw new Error(`错误：<${result.resultcode}> "${result.message}"`)
        }
        return Promise.resolve(result.data)
      } else {
        throw new Error(`网络请求错误，返回状态: ${res.statusCode}`)
      }
    } catch (error) {
        console.log("发生错误：%o", error)
        wxp.showToast({
          title: error.name + ': ' + error.message,
          icon: 'none',
          duration: 3000
        })
    }
  }

}
