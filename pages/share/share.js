// pages/share/share.js
import Protocol from "../../apis/network/protocol";
import Toast from "../../utils/toast";
import {createDateAndTime, reLoginWithoutLogin} from "../../utils/tools";
import WXDialog from "../../base/heheda-common-view/dialog";
import HiNavigator from "../../components/navigator/hi-navigator";

Page({

    data: {
        logs: [],
        page: 1,
        isFollow: false,
        isFinish: false
    },
    onLoad(options) {
        this.globalData.options = options;
        let memberId = options.memberId;
        console.log('家人id：', memberId);
        Protocol.getRelativesInfo({memberId}).then((res) => {
            this.setData({
                userInfo: res.result,
                memberId: memberId,
                isFollow: true,
                isFinish: true
            });
            this.getList({});
        }).catch((res) => {
            if (res.data.code == 0) {
                console.log('未关注');
                this.setData({
                    isFinish: true
                })
            }
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
        WXDialog.showDialog({
            showCancel: true,
            content: '不再关注后，将无法继续查看对方检测记录，给您的定期推送也将取消', confirmEvent: () => {
                Protocol.shareRelativesDelRelatives({memberId: this.data.memberId}).then(() => {
                    this.setData({
                        isFollow: false
                    })
                })
            }
        });
    },

    onUnload() {
        reLoginWithoutLogin();
    },

    toResultPage(e) {
        const {currentTarget: {dataset: {item: {type, id: dataId}}}} = e;
        HiNavigator.navigateToResultPageByType({type, dataId})
    }
})
