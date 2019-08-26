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

    async onShow() {
        let userInfo = app.globalData.currentMember;
        console.log('切换成员：', userInfo);
        const {result: {isShow}} = await Protocol.getRelativesGetToolTip({});
        this.setData({
            bottomViewIsHidden: !isShow,
        });

        if (userInfo.relevanceId) {
            this.setData({
                userInfo: userInfo,
                isNormalMember: false,
                rightChoseIsLeft: true,
                trendRightChoseIsLeft: true,
                name: Tools.HandleShortName(userInfo.nickName),
                logs: []
            });
            this.getMainList({page: 1, recorded: true});
        } else {
            const {userInfo} = await UserInfo.get();
            const name = Tools.HandleShortName(userInfo.nickName);
            this.setData({
                userInfo, name, logs: [],
                isNormalMember: true,
                rightChoseIsLeft: true,
                trendRightChoseIsLeft: true,
            });
            this.getMainList({page: 1, recorded: true});
        }
    },

    async getMainList({page = 1, recorded = false}) {
        Toast.showLoading();
        let data = {data: {page}};
        if (!this.data.isNormalMember) {
            data = {data: {page, relevanceId: this.data.userInfo.relevanceId}}
        }
        let {result: {dataList: list}} = await Protocol.getHistoryList({data})
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
        });
        Toast.hiddenLoading();
        wx.stopPullDownRefresh();
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

    async getTags() {
        let type = this.data.trendRightChoseIsLeft ? 1 : 2;
        let {result: {data: tag}} = await Protocol.getTargetByType({type});
        tag.map((value, index) => {
            value.state = !index
        });
        this.setData({
            trendTag: tag,
            tagChose: tag[0].id
        });
        this.tagAllDataHandle();
    },

    switchTestType() {
        this.setData({
            trendRightChoseIsLeft: !this.data.trendRightChoseIsLeft,
            page: 1,
            itemPage: 1
        });
        this.getTags();
    },

    async tagAllDataHandle() {
        let type = this.data.trendRightChoseIsLeft ? 1 : 2;
        let data = {type, target: this.data.tagChose};
        if (!this.data.isNormalMember) {
            data = {type, target: this.data.tagChose, relevanceId: this.data.userInfo.relevanceId};
        }
        const {result: graph} = await Protocol.getLinearGraph({data});
        const {dataList, xTitle, yTitle} = graph;
        this.setData({
            trend: {xTitle, yTitle}
        });
        if (dataList.length > 0) {
            trend.setData(graph);
        }
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

    async getItemListData({page = 1, recorded = false}) {
        let type = this.data.trendRightChoseIsLeft ? 1 : 2;
        if (recorded) {
            this.data.itemPage = 1
        }
        let data = {type, target: this.data.tagChose, page: this.data.itemPage};
        if (!this.data.isNormalMember) {
            data = {
                type,
                target: this.data.tagChose,
                relevanceId: this.data.userInfo.relevanceId,
                page: this.data.itemPage
            }
        }
        let {result: {dataList: list}} = await Protocol.getLinearGraphList({data});
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
        Toast.hiddenLoading();
        wx.stopPullDownRefresh();
    },

    switchMember() {
        HiNavigator.navigateToMemberList({state: 3});
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
            async success() {
                await Protocol.getRelativesDelToolTip({});
                that.setData({
                    bottomViewIsHidden: true
                })
            }
        })
    }
})
