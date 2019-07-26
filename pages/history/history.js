import Toast from '../../utils/toast';
import HiNavigator from "../../components/navigator/hi-navigator";
import Protocol from "../../apis/network/protocol";
import * as trend from "./view/view/trend";
import {createDateAndTime} from "../../utils/tools";
import * as Tools from "../../utils/tools";
import UserInfo from "../../apis/network/network/libs/userInfo";

Page({
    data: {
        logs: [],
        page: 1,
        itemPage: 1,
        selectedType: '',
        rightChoseIsLeft: true,
        trendRightChoseIsLeft: true,
        trendResult: [],
        list: [1, 2, 3, 4],
        trendTag: [
            {id: 1, title: 'HR', state: true},
            {id: 1, title: '', state: false},
            {id: 2, title: '2', state: false}
        ],
        tagChose: 1,
        itemList: [],
        isNormalMember: true,
        bottomViewIsHidden: false
    },

    onLoad() {
        Protocol.getRelativesGetToolTip({}).then((res) => {
            this.setData({
                bottomViewIsHidden: !res.result.isShow
            })
        })
    },

    onShow() {
        let userInfo = getApp().globalData.currentMember;
        console.log('切换成员：', userInfo);
        if (userInfo.thirdpartyUId === null) {
            this.setData({
                userInfo: userInfo,
                isNormalMember: false,
                rightChoseIsLeft: true,
                trendRightChoseIsLeft: true,
            })
        } else {
            UserInfo.get().then((res) => {
                this.setData({
                    userInfo: res.userInfo,
                    isNormalMember: true,
                    rightChoseIsLeft: true,
                    trendRightChoseIsLeft: true,
                })
            })
        }
        this.getMainList({page: 1, recorded: true});
    },

    getMainList({page = 1, recorded = false}) {
        Toast.showLoading();
        let data = {data: {page}};
        if (!this.data.isNormalMember) {
            data = {data: {page, relevanceId: this.data.userInfo.id}}
        }
        Protocol.getHistoryList({data}).then((data) => {
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

    toPdfUrl(e) {
        const {currentTarget: {dataset: {item: {type, id: dataId}}}} = e;
        HiNavigator.navigateToResultPageByType({type, dataId})
    },

    onPullDownRefresh() {
        console.log('onPullDownRefresh');
        if (this.data.rightChoseIsLeft) {
            this.setData({
                page: 1,
                logs: []
            });
            this.getMainList({page: 1});
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


    clickRightBtn() {
        trend.init(this);
        trend.initTouchHandler();
        this.setData({
            rightChoseIsLeft: !this.data.rightChoseIsLeft
        });
        if (this.data.rightChoseIsLeft) {
            this.choseBigList()
        } else {
            this.choseBigTrend();
        }
    },

    choseBigList() {

    },

    choseBigTrend() {
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
            data = {type, target: this.data.tagChose, relevanceId: this.data.userInfo.id};
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
        let data = {type, target: this.data.tagChose, page: this.data.itemPage};
        if (!this.data.isNormalMember) {
            data = {type, target: this.data.tagChose, relevanceId: this.data.userInfo.id, page: this.data.itemPage}
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
