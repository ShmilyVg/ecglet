// 此文件是由模板文件 ".dtpl/page/$rawModuleName.ts.dtpl" 生成的，你可以自行修改模板

import {pagify, MyPage, wxp} from 'base/'
import {APIs} from 'apis/request';

@pagify()
export default class extends MyPage {
    data = {
        url: '',
        screenWidth: 0,
        screenHeight: 0,
        width: 0,
        height: 0
    }

    async onLoad(options: any) {
        let that = this

        try {
            let res = await wxp.getSystemInfo()

            console.log("system information: %o", res)
            that.setDataSmart({
                screenWidth: res.windowWidth,
                screenHeight: res.windowHeight
            })

            // TODO: 通过接口获取帮助url
            let {file_url} = await APIs.default().getRequest({
                url: 'arrhythmia'
            })
            console.log('file_url: ' + file_url)
            that.setDataSmart({
                url: file_url
            })
        } catch (err) {
            console.log("onLoad error: %o", err)
        }

    }

    bindLoad(e: any) {
        let that = this

        const w = e.detail.width
        const h = e.detail.height
        const ratio = w / h
        let viewWidth = that.data.screenWidth
        let viewHeight = viewWidth / ratio
        that.setDataSmart({
            width: viewWidth,
            height: viewHeight
        })
    }
}
