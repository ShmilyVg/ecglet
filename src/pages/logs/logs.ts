/******************************************************************
MIT License http://www.opensource.org/licenses/mit-license.php
Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
*******************************************************************/

import {pagify, MyPage, wxp} from 'base/'
import { APIs } from 'apis/request';

type Log = {
  id: number,
  localfile: string,
  rawdata: any,
  createdTime: string
}
@pagify()
export default class extends MyPage {
  data = {
    logs: [],
    loadmorehidden: true,
    refreshhidden: true,
    refresh: false
  }

  backToHome() {
    this.app.$back()
  }

  async onLoad() {
    let location = this.getLocation()
    console.log(`当前页面 ${location.pathname}, 页面参数 ${JSON.stringify(location.query)}`)

    let logs: Log[] = wx.getStorageSync('logs') || []
    this.setDataSmart({
      logs: logs
    })

    await this.onPullDownRefresh()
  }

  async onPullDownRefresh() {
    console.log("onPullDownRefresh...")

    let that = this

    if (!that.data.refresh) {
      that.data.refresh = true

      that.setDataSmart({
        refreshhidden: false
      })

      try {
        let res = await wxp.startPullDownRefresh()
        console.log(`wxp.startPullDownRefresh result: ${res.errMsg}`)

        let dataList = await that.loadData(0, 40)
        if (!dataList || !dataList.length) {
          console.log("服务端没有返回数据......")
        }

        setTimeout(async () => {
          if (!!dataList && !!dataList.length) {
            wxp.removeStorageSync('logs')

            // 只保存当前最新的20条记录，用作在初始无网络加载时本地备忘记录
            let storeList = dataList.slice(0, 20)
            wxp.setStorageSync('logs', storeList)
          }

          that.data.refresh = false

          wxp.stopPullDownRefresh()

          that.setDataSmart({
            refreshhidden: true,
            logs: !dataList ? that.data.logs : dataList
          })
        }, 2000)
      } catch (err) {
        console.log("onPullDownRefresh error: %o", err)
      }
    } else {
      console.log('正在刷新...')
    }
  }

  async onReachBottom() {
    console.log("onReachBottom...")

    let that = this

    if (!that.data.refresh) {
      that.data.refresh = true

      that.setDataSmart({
        loadmorehidden: false
      })

      try {
        let list = that.data.logs

        let last: any = list[list.length - 1]
        let dataList = await that.loadData(last.id, 40)
        if (!dataList || !dataList.length) {
          console.log("没有获取到更多记录......")
        }

        setTimeout(async () => {
          that.data.refresh = false

          that.setDataSmart({
            loadmorehidden: true,
            logs: !!dataList ? list.concat(dataList) : list
          })
        }, 2000)
      } catch (err) {
        console.log("onReachBottom error: %o", err)
      }
    } else {
      console.log('正在刷新...')
    }
  }

  private async loadData(start: number, size: number) {
    let that = this
    let st = start
    let sz = size
    let apis = APIs.default()

    try {
      let res = await apis.postRequest({
        url: 'bs/get_records',
        data: {
          start: st,
          pageSize: 20,
        }
      }, false)
      let list = JSON.parse(JSON.stringify(res)).list
      if (!list.length) {
        throw new Error("返回数据为空...")
      }
      list = list.map((v: any) => {
        if (!!v.createtime) {
          let createdAt = parseInt(v.createtime) * 1000
          console.log(`createtime: ${createdAt}`)
          v.createtime = new Date(createdAt).format('yyyy-MM-dd HH:mm')
          console.log(`createtime: ${v.createtime}`)
        }
        return v
      })
      console.log("list: %o", list)
      console.log(`before size: ${sz}; list length: ${list.length}`)
      sz -= list.length
      st = list[list.length - 1].id
      console.log(`next size: ${sz}, next start: ${st}`)
      if (list.length == 20 && sz > 0) {
        console.log("next loadData...")
        let moreList = await that.loadData(st, sz)
        if (!!moreList) {
          list = list.concat(moreList)
        }
      }
      return list
    } catch (err) {
      console.log("loadData error: %o", err)
    }
    return
  }

  onDetail(e: any) {
    console.log("e: %o", e)
  }
}
