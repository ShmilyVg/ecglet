/******************************************************************
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
 *******************************************************************/

import {pagify, MyPage, wxp} from 'base/'
import Toast from '../../base/heheda-common-view/toast.js';
import * as tools from "../../utils/tools";
import Protocol from '../../apis/network/protocol.js'

/*type Log = {
    id: number,
    localfile: string,
    rawdata: any,
    createdTime: string
}*/
@pagify()
export default class extends MyPage {
    data = {
        logs: [],
        page: 1,
    }

    onLoad(){
        this.getList({page: 1});
        console.log(this.data.logs)
    }

    /*onShow() {
        this.getList({page: 1});
        console.log(this.data.logs)
    }*/

    getList({page = 1, recorded = false}){
        Toast.showLoading();
        Protocol.getHistoryList({ page }).then(data =>{
            let list = data.result.dataList
            for (let i = 0;  i < list.length; i++) {
                const {date, time} = tools.createDateAndTime(list[i].time);
                console.log({date, time})
            }
            this.setData({
                logs : list
            })
        }).finally(() => {
            Toast.hiddenLoading();
            wx.stopPullDownRefresh();
        });
    }

    toPdfUrl(e){
        console.log(e)
        let pdfUrl = e.target.dataset.url
        this.app.$url.report.go({reportUrl: pdfUrl});
    }
}
