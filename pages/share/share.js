// pages/share/share.js
import Protocol from "../../apis/network/protocol";
import Toast from "../../utils/toast";
import {createDateAndTime, reLoginWithoutLogin} from "../../utils/tools";
import WXDialog from "../../base/heheda-common-view/dialog";

Page({

    data: {
        logs: [],
        page: 1,
        isFollow: false,
        isFinish: false
    },

    async onLoad(options) {
        getApp().globalData.options.query = options;
        let memberId = options.memberId;
        console.log('家人id：', memberId);
        try {
            const {result} = await Protocol.getRelativesInfo({memberId});
            this.setData({
                userInfo: result,
                memberId: memberId,
                isFollow: true,
            });
            this.getList({});
        } catch (e) {
            if (e.data.code == 0) {
                console.log('未关注');
                this.setData({
                    isFinish: true
                })
            }
        }

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

    async getList({page = 1, recorded = false}) {
        let memberId = this.data.memberId;
        Toast.showLoading();
        try {
            const {result: {dataList}} = await Protocol.getRelativesList({memberId, page});
            let list = dataList;
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
                    logs: list,
                    isFinish: true
                })
            } else {
                this.setData({
                    isFinish: true
                })
            }
        } catch (e) {
            console.error(e);
        } finally {
            Toast.hiddenLoading();
            wx.stopPullDownRefresh();
        }
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

    onHide() {
        this.isNeedRelogin = false;
    },
    onShow() {
        this.isNeedRelogin = true;
        getApp().globalData.options.query.isGetUserInfo = 1;
    },
    onUnload() {
        if (this.isNeedRelogin) {
            reLoginWithoutLogin();
        }
    },

    toResultPage(e) {
        const {currentTarget: {dataset: {item: {type, id: dataId}}}} = e;
        // HiNavigator.navigateToResultPageByType({type, dataId});
        if (type == 2) {
            wx.navigateTo({url: '/pages/pressure-result/pressure-result?dataId=' + dataId + '&isGetUserInfo=1'});
        } else {
            wx.navigateTo({url: '/pages/result/result?dataId=' + dataId + '&isGetUserInfo=1'});
        }
    }
})
