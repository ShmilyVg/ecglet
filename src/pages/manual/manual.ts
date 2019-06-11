// 此文件是由模板文件 ".dtpl/page/$rawModuleName.ts.dtpl" 生成的，你可以自行修改模板

import { pagify, MyPage } from 'base/'
import { APIs } from 'apis/request';

@pagify()
export default class extends MyPage {
  data = {
    manual: ''
  }

  async onLoad(options: any) {
    let that = this

    try {

      // TODO: 通过接口获取帮助url
      let { file_url } = await APIs.default().getRequest({
        url: 'operation'
      })
      console.log('file_url: ' + file_url)
      that.setDataSmart({
        manual: file_url
      })
    } catch (err) {
      console.log("onLoad error: %o", err)
    }
  }
}
