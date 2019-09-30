import Toast from '../../utils/toast';
import HiNavigator from "../../components/navigator/hi-navigator";
import Protocol from "../../apis/network/protocol";
import * as trend from "./view/view/trend";
import {createDateAndTime, dealRegister} from "../../utils/tools";
import * as Tools from "../../utils/tools";
import UserInfo from "../../apis/network/network/libs/userInfo";
import {stat} from "../../analysis/mta";
import WXDialog from "../../utils/dialog";

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
        isAllDeleteChecked: false,
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
        const {tempDataIdObj} = app.globalData;
        if (tempDataIdObj && tempDataIdObj.isCheck) {
            const {dataId} = tempDataIdObj, {logs} = this.data;
            for (let i = 0, len = logs.length; i < len; i++) {
                if (logs[i].id === dataId) {
                    const obj = {};
                    obj[`logs[${i}].isCheck`] = 1;
                    this.setData(obj);
                    break;
                }
            }
            app.globalData.tempDataIdObj = null;
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
            const checked = this.data.isAllDeleteChecked;
            list.forEach((item) => {
                const {date, time} = createDateAndTime(parseInt(item.created_timestamp));
                item.dateStr = date;
                item.timeStr = time;
                item.checked = checked;
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
            });
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
        const {currentTarget: {dataset: {item: {id: dataId}}}} = e, obj = {}, {logs} = this.data;
        for (let i = 0, len = logs.length; i < len; i++) {
            if (logs[i].id === dataId) {
                obj[`logs[${i}].showEditorDialog`] = false;
                this.setData(obj, () => {
                    this.data.showEditorDialogItemIndex = -1;
                    WXDialog.showDialog({
                        content: '确定删除这条记录吗？', showCancel: true,
                        confirmEvent: async () => {
                            try {
                                await Protocol.deleteGather({ids: [dataId]});
                                await this.getMainList({recorded: true});
                            } catch (e) {
                                Toast.showErrMsg(e);
                            }
                        }
                    });
                });
                break;
            }
        }

    },
    editAllEvent() {
        const obj = {};
        obj['showOperator'] = true;
        obj[`logs[${this.data.showEditorDialogItemIndex}].showEditorDialog`] = false;
        this.setData(obj, () => {
            this.data.showEditorDialogItemIndex = -1;
        })
    },

    onClickHistoryItemEvent(e) {
        const {currentTarget: {dataset: {item: {type, id: dataId, isCheck, isSetUp}}}} = e;
        this.hideEditDialog();//showEditorDialogItemIndex 在经过这一步后，肯定是等于-1了

        if (this.data.showOperator) {
            console.warn('正在批量处理，暂不进入详情页');
            let index = -1, logs = this.data.logs, itemChecked = false;
            for (let i = 0, len = logs.length; i < len; i++) {
                let item = logs[i];
                if (item.id === dataId) {
                    index = i;
                    itemChecked = item.checked;
                    break;
                }
            }
            if (index !== -1) {
                const obj = {};
                obj[`logs[${index}].checked`] = !itemChecked;

                this.setData(obj, () => {
                    this.setData({
                        isAllDeleteChecked: logs.every(item => item.checked)
                    });
                });
            }
            return;
        }
        if (this.data.showEditorDialogItemIndex === -1) {
            if (isSetUp) {
                if (!isCheck) {
                    app.globalData.tempDataIdObj = {dataId, isCheck};
                }
                HiNavigator.navigateToResultPageByType({type, dataId});
            } else {
                Toast.showText('该报告正在生成中，此处文案需要修改');
            }
        }
    },
    deleteAllItemsEvent() {
        const {logs} = this.data, obj = {}, isAllChecked = logs.every(item => item.checked);
        obj['isAllDeleteChecked'] = !isAllChecked;
        logs.forEach((item, index) => {
            obj[`logs[${index}].checked`] = !isAllChecked;
        });

        this.setData(obj);
    },
    deleteConfirmEvent() {
        const {logs, isAllDeleteChecked} = this.data;
        WXDialog.showDialog({
            title: '温馨提示', content: '确定删除选中的数据吗?', showCancel: true, confirmText: '删除', confirmEvent: async () => {
                if (isAllDeleteChecked) {
                    //TODO 处理删除所有数据
                    await Protocol.deleteAllGather();
                } else {
                    const ids = logs.filter(item => item.checked).map(item => item.id);
                    await Protocol.deleteGather({ids});
                }
                await this.getMainList({recorded: true});
            }
        })
    },
    deleteCancelEvent() {
        const {logs} = this.data, obj = {};
        obj['isAllDeleteChecked'] = false;
        obj['showOperator'] = false;
        logs.forEach((item, index) => {
            obj[`logs[${index}].checked`] = false;
        });
        this.setData(obj);
    },

    refreshAllData() {
        wx.startPullDownRefresh();
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
