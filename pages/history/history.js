import Toast from '../../utils/toast';
import {createDateAndTime} from "../../utils/tools";
import HiNavigator from "../../components/navigator/hi-navigator";
// import Protocol from '../../../ecglet的副本/src/apis/network/protocol.js'

Page({
    data: {
        logs: [],
        page: 1,
        selectedType: ''
    },

    onFilterSelected(e) {
        console.log(e);
        const {currentTarget: {dataset: {selectedType}}} = e;
        this.setData({selectedType: selectedType === this.data.selectedType ? '' : selectedType});
        // switch (selectedType) {
        //
        //     case 'time':
        //
        //         break;
        //     case 'type':
        //     default:
        //
        //         break;
        // }
    },
    onLoad() {
        // this.getList({page: 1});
        console.log(this.data.logs)
    },

    getList({page = 1, recorded = false}) {
        Toast.showLoading();
        Protocol.getHistoryList({page}).then((data) => {
            let list = data.result.dataList
            if (list.length) {
                list.forEach((item) => {
                    const {date, time} = createDateAndTime(parseInt(item.time));
                    item.dateStr = date;
                    item.timeStr = time;
                });
                if (!recorded) {
                    list = this.data.logs.concat(list);
                } else {
                    this.data.page = 1;
                }
                this.setData({
                    logs: list
                })
            }
        }).finally(() => {
            Toast.hiddenLoading();
            wx.stopPullDownRefresh();
        });
    },

    toPdfUrl(e) {
        getApp().globalData.tempGatherResult = e.currentTarget.dataset.item;
        HiNavigator.navigateToResult();
    },

    onPullDownRefresh() {
        this.setData({
            page: 1,
            logs: []
        });
        this.getList({page: 1});
    },

    onReachBottom() {
        console.log('getList', this.data.page + 1);
        this.getList({page: ++this.data.page});
    }
})
