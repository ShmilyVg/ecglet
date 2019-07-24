// pages/share/share.js
import Protocol from "../../apis/network/protocol";
import Toast from "../../utils/toast";
import {createDateAndTime} from "../../utils/tools";

Page({

    data: {
        logs: [],
        page: 1
    },
    onLoad(options) {
        let memberId = options.memberId;
        console.log('家人id：', memberId);
        Protocol.getRelativesInfo({memberId}).then((res) => {
            this.setData({
                userInfo: res.result,
                memberId: memberId
            });
            this.getList({});
        });

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

    getList({page = 1, recorded = false}) {
        let memberId = this.data.memberId;
        Toast.showLoading();
        Protocol.getRelativesList({memberId, page}).then((data) => {
            let list = data.result.dataList;
            if (list.length) {
                list.forEach((item) => {
                    const {date, time} = createDateAndTime(parseInt(item.created_timestamp));
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

    noFollow() {

    }
})