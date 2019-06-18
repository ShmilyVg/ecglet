/******************************************************************
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
 *******************************************************************/

import {MyPage, pagify} from 'base/'
// @ts-ignore
import Toast from '../../base/heheda-common-view/toast.js';
// @ts-ignore
import {createDateAndTime} from "../../utils/tools";
// @ts-ignore
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
        Protocol.getHistoryList({ page }).then((data:any) =>{
            let list = data.result.dataList
            if(list.length){
                list.forEach((item:any)=>{
                    const {date, time} = createDateAndTime(parseInt(item.time));
                    item.date = date;
                    item.time = time;
                })
                if (!recorded) {
                    list = this.data.logs.concat(list);
                } else {
                    this.data.page = 1;
                }
                this.setData({
                    logs : list
                })
            }
        }).finally(() => {
            Toast.hiddenLoading();
            wx.stopPullDownRefresh();
        });
    }

    toPdfUrl(e:any){
        console.log(e)
        let pdfUrl = e.currentTarget.dataset.url
        this.app.$url.report.go({reportUrl: pdfUrl});
    }

    onPullDownRefresh() {
        this.setData({
            page: 1,
            logs: []
        });
        this.getList({page: 1});
    }

    onReachBottom() {
        console.log('getList', this.data.page + 1);
        this.getList({page: ++this.data.page});
    }
}
