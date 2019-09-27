import Toast from '../../utils/toast';
import HiNavigator from "../../components/navigator/hi-navigator";
import Protocol from "../../apis/network/protocol";
import * as trend from "./view/view/trend";
import {createDateAndTime, dealRegister} from "../../utils/tools";
import * as Tools from "../../utils/tools";
import UserInfo from "../../apis/network/network/libs/userInfo";
import {stat} from "../../analysis/mta";

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
        bottomViewIsHidden: true,
        showOperator: false,
        showEditorDialogItemIndex: -1
    },

    async onLoad() {
        const {result: {isShow}} = await Protocol.getRelativesGetToolTip({});
        this.setData({bottomViewIsHidden: !isShow});
        this.handleBaseData();
    },

    async onShow() {
        let userInfo = app.globalData.currentMember;
        let isNormalMember = true;
        if (userInfo.relevanceId) {
            isNormalMember = false
        } else {
            const norMember = await UserInfo.get();
            userInfo = norMember.userInfo;
        }
        const name = Tools.HandleShortName(userInfo.nickName);
        this.setData({userInfo, name, isNormalMember});
        if (getApp().globalData.refresh) {
            this.handleBaseData();
            getApp().globalData.refresh = false;
        }
    },

    async handleBaseData() {
        let userInfo = app.globalData.currentMember;
        let isNormalMember = true;
        if (userInfo.relevanceId) {
            isNormalMember = false
        } else {
            const norMember = await UserInfo.get();
            userInfo = norMember.userInfo;
        }
        const name = Tools.HandleShortName(userInfo.nickName);
        this.setData({
            userInfo, name, isNormalMember,
            rightChoseIsLeft: true, trendRightChoseIsLeft: true,
        });
        this.data.page = 1;
        this.getMainList({page: 1, recorded: true});
    },

    async getMainList({page = 1, recorded = false}) {
        Toast.showLoading();
        let data = {data: {page}};
        if (!this.data.isNormalMember) {
            data = {data: {page, relevanceId: this.data.userInfo.relevanceId}}
        }
        let {result: {dataList: list}} = await Protocol.getHistoryList({data});
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
    hideEditDialog() {
        if (this.data.showEditorDialogItemIndex !== -1) {
            const obj = {};
            obj[`logs[${this.data.showEditorDialogItemIndex}].showEditorDialog`] = false;
            this.setData(obj, () => {
                this.data.showEditorDialogItemIndex = -1;
            })
        }
    },
    onLongPressHistoryItemEvent(e) {
        if (this.data.showOperator) {
            console.warn('正在批量处理，暂不处理长按事件');
            return;
        }
        const {currentTarget: {dataset: {item: {id: dataId}}}} = e, logs = this.data.logs;
        let index = -1;
        for (let i = 0, len = logs.length; i < len; i++) {
            if (logs[i].id === dataId) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            const obj = {};
            obj[`logs[${index}].showEditorDialog`] = true;
            if (this.data.showEditorDialogItemIndex !== -1) {
                obj[`logs[${this.data.showEditorDialogItemIndex}].showEditorDialog`] = false;
            }
            this.setData(obj, () => {
                this.data.showEditorDialogItemIndex = index;
            });
        }
    },
    deleteCurrentItemEvent(e) {
        const {currentTarget: {dataset: {item}}} = e;
        //TODO 编写删除逻辑
    },
    editAllEvent() {
        const obj = {};
        obj['showOperator'] = true;
        obj[`logs[${this.data.showEditorDialogItemIndex}].showEditorDialog`] = false;
        this.setData(obj, () => {
            this.data.showEditorDialogItemIndex = -1;
        })
    },

    toResultPage(e) {
        if (this.data.showOperator) {
            console.warn('正在批量处理，暂不处理长按事件');
            return;
        }
        const {currentTarget: {dataset: {item: {type, id: dataId}}}} = e;
        // if()
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
            stat({key: 'click_ecg_jiancejilu_tendency'});
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

    async switchMember() {
        await dealRegister();
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
