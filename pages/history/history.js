import Toast from '../../utils/toast';
import HiNavigator from "../../components/navigator/hi-navigator";
import Protocol from "../../apis/network/protocol";
import * as trend from "./view/view/trend";
import {createDateAndTime} from "../../utils/tools";

Page({
    data: {
        logs: [],
        page: 1,
        selectedType: '',
        rightChoseIsLeft: true,
        trendRightChoseIsLeft: true,
        list: [1, 2, 3, 4],
        trendTag: [0, 1, 2, 3, 4]
    },

    onLoad() {
        this.getList({page: 1});
        trend.init(this);
        trend.initTouchHandler();
        console.log(this.data.logs)
    },

    getList({page = 1, recorded = false}) {
        Toast.showLoading();
        Protocol.getHistoryList({page}).then((data) => {
            let list = data.result.dataList;
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
    },


    clickRightBtn() {
        trend.init(this);
        trend.initTouchHandler();
        this.setData({
            rightChoseIsLeft: !this.data.rightChoseIsLeft
        })
    },

    clickTrendTop() {
        this.setData({
            trendRightChoseIsLeft: !this.data.trendRightChoseIsLeft
        })
    },
    clickIndexItem(e) {
        const {currentTarget: {dataset: {current}}} = e;
        console.log(current);
    }
})
