/******************************************************************
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
 *******************************************************************/

import {pagify, MyPage, wxp} from 'base/'
import Toast from '../../base/heheda-common-view/toast.js';
import * as tools from "../../utils/tools";
import Protocol from '../../apis/network/protocol.js'

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

    getList({page = 1, recorded = false}){
        Toast.showLoading();
        Protocol.getHistoryList({ page }).then((data) =>{
            let list = data.result.dataList
            list.forEach(item=>{
                const {date, time} = tools.createDateAndTime(parseInt(item.time));
                item.date = date;
                item.time = time;
            })
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
