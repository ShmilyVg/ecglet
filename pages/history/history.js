import Toast from '../../utils/toast';
import HiNavigator from "../../components/navigator/hi-navigator";
import Protocol from "../../apis/network/protocol";
import * as trend from "./view/view/trend";
import {createDateAndTime} from "../../utils/tools";
import * as Tools from "../../utils/tools";
import UserInfo from "../../apis/network/network/libs/userInfo";

const app = getApp();
Page({
    data: {
        logs: [],
        page: 1,
        itemPage: 1,
        selectedType: '',
        rightChoseIsLeft: true,
        trendRightChoseIsLeft: true,
        trendResult: [],
        trendTag: [],
        tagChose: 1,
        itemList: [],
        isNormalMember: true,
        bottomViewIsHidden: true
    },

    onShow() {
        let userInfo = app.globalData.currentMember;
        console.log('切换成员：', userInfo);
        Protocol.getRelativesGetToolTip({}).then((res) => {
            this.setData({
                bottomViewIsHidden: !res.result.isShow
            })
        });

        if (userInfo.relevanceId) {
            this.setData({
                userInfo: userInfo,
                isNormalMember: false,
                rightChoseIsLeft: true,
                trendRightChoseIsLeft: true,
                name: Tools.HandleShortName(userInfo.nickName)
            });
            this.getMainList({page: 1, recorded: true});
        } else {
            UserInfo.get().then((res) => {
                let name = Tools.HandleShortName(res.userInfo.nickName);
                this.setData({
                    userInfo: res.userInfo,
                    isNormalMember: true,
                    rightChoseIsLeft: true,
                    trendRightChoseIsLeft: true,
                    name: name
                });
                this.getMainList({page: 1, recorded: true});
            })
        }
    },

    getMainList({page = 1, recorded = false}) {
        Toast.showLoading();
        let data = {data: {page}};
        if (!this.data.isNormalMember) {
            data = {data: {page, relevanceId: this.data.userInfo.relevanceId}}
        }
        Protocol.getHistoryList({data}).then((data) => {
            let list = data.result.dataList;
            if (list.length) {
                list.forEach((item) => {
                    const {date, time} = createDateAndTime(parseInt(item.created_timestamp));
                    item.dateStr = date;
                    item.timeStr = time;
                });
            }
            if (!recorded) {
                list = this.data.logs.concat(list);
            } else {
                this.data.page = 1;
            }
            this.setData({
                logs: list
            })
        }).finally(() => {
            Toast.hiddenLoading();
            wx.stopPullDownRefresh();
        });
    },

    toResultPage(e) {
        const {currentTarget: {dataset: {item: {type, id: dataId}}}} = e;
        HiNavigator.navigateToResultPageByType({type, dataId})
    },

    onPullDownRefresh() {
        console.log('onPullDownRefresh');
        if (this.data.rightChoseIsLeft) {
            this.getMainList({recorded: true});
        } else {
            this.getItemListData({recorded: true});
        }
    },

    onReachBottom() {
        console.log('onReachBottom');
        if (this.data.rightChoseIsLeft) {
            this.getMainList({page: ++this.data.page});
        } else {
            this.getItemListData({page: ++this.data.itemPage});
        }
    },

    clickRightTopBtn() {
        this.setData({
            rightChoseIsLeft: !this.data.rightChoseIsLeft,
            page: 1,
            itemPage: 1
        });
        if (this.data.rightChoseIsLeft) {
            this.handleRightTopList()
        } else {
            this.handleRightTopTrend();
        }
    },

    handleRightTopList() {
        // to do ...
    },

    handleRightTopTrend() {
        trend.init(this);
        trend.initTouchHandler();
        this.getTags();
    },

    getTags() {
        let type = this.data.trendRightChoseIsLeft ? 1 : 2;
        Protocol.getTargetByType({type}).then(data => {
            let tag = data.result.data;
            tag.map((value, index) => {
                value.state = !index
            });
            this.setData({
                trendTag: tag,
                tagChose: tag[0].id
            });
            this.tagAllDataHandle();
        });
    },

    switchTestType() {
        this.setData({
            trendRightChoseIsLeft: !this.data.trendRightChoseIsLeft,
            page: 1,
            itemPage: 1
        });
        this.getTags();
    },

    tagAllDataHandle() {
        let type = this.data.trendRightChoseIsLeft ? 1 : 2;
        let data = {type, target: this.data.tagChose};
        if (!this.data.isNormalMember) {
            data = {type, target: this.data.tagChose, relevanceId: this.data.userInfo.relevanceId};
        }
        Protocol.getLinearGraph({data}).then(data => {
            const {result: {xTitle, yTitle}} = data;
            this.setData({
                trend: {xTitle, yTitle}
            });
            if (data.result.dataList.length > 0) {
                trend.setData(data.result);
            }
        });
        this.getItemListData({recorded: true});
    },

    clickTag(e) {
        const {currentTarget: {dataset: {current: index}}} = e;
        this.data.trendTag.map((value) => {
            value.state = index === value.id
        });

        this.setData({
            trendTag: this.data.trendTag,
            tagChose: index,
            itemPage: 1
        });

        this.tagAllDataHandle({recorded: true});
    },

    getItemListData({page = 1, recorded = false}) {
        let type = this.data.trendRightChoseIsLeft ? 1 : 2;
        if (recorded) {
            this.data.itemPage = 1
        }
        let data = {type, target: this.data.tagChose, page: this.data.itemPage};
        if (!this.data.isNormalMember) {
            data = {type, target: this.data.tagChose, relevanceId: this.data.userInfo.relevanceId, page: this.data.itemPage}
        }
        Protocol.getLinearGraphList({data}).then(data => {
            let {result: {dataList: list}} = data;
            if (list.length) {
                list.map(value => {
                    let dataAndTime = Tools.createDateAndTime(parseInt(value.created_timestamp));
                    value.titleTime = dataAndTime.time;
                    value.titleDate = dataAndTime.date;
                });
                if (!recorded) {
                    list = this.data.itemList.concat(list);
                } else {
                    this.data.itemPage = 1;
                }
                this.setData({
                    itemList: list
                })
            } else {
                if (!recorded) {
                    list = this.data.itemList.concat(list);
                } else {
                    this.data.itemPage = 1;
                }
                this.setData({
                    itemList: list
                })
            }
        }).finally(() => {
            Toast.hiddenLoading();
            wx.stopPullDownRefresh();
        });
    },

    switchMember() {
        wx.navigateTo({
            url: '../member-list/member-list?state=3'
        })
    },

    toFamily() {
        HiNavigator.navigateToShareCode();
    },

    hiddenBottomView() {
        let that = this;
        wx.showModal({
            content: '关闭后，您可以在“我的”页面继续设置将记录同步给亲友',
            showCancel: false,
            confirmText: '确定',
            success() {
                Protocol.getRelativesDelToolTip({}).then(() => {
                    that.setData({
                        bottomViewIsHidden: true
                    })
                })
            }
        })
    }
})
