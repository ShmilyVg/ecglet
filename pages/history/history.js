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
        isNormalMember: true
    },

    onLoad() {
    },

    onShow() {
        let userInfo = getApp().globalData.currentMember;
        if (userInfo.name) {
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
        this.getList({page: 1});
    },

    getList({page = 1, recorded = false}) {
        Toast.showLoading();
        let data = {data: {page}};
        if (!this.data.isNormalMember) {
            data = {data: {page, relevanceId: this.data.userInfo.id}}
        }
        Protocol.getHistoryList({data}).then((data) => {
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

    clickTrendTop() {
        this.setData({
            trendRightChoseIsLeft: !this.data.trendRightChoseIsLeft
        });
        this.getTags();
    },

    tagAllDataHandle() {
        let type = this.data.trendRightChoseIsLeft ? 1 : 2;
        Protocol.getLinearGraph({type, target: this.data.tagChose}).then(data => {
            trend.setData(data.result.dataList);
        });
        this.tagItemListData();
    },

    clickIndexItem(e) {
        const {currentTarget: {dataset: {current}}} = e;
        console.log(current);
        this.data.trendTag.map((value) => {
            value.state = current === value.id
        });

        this.setData({
            trendTag: this.data.trendTag,
            tagChose: current
        });

        this.tagAllDataHandle();
    },

    tagItemListData() {
        let type = this.data.trendRightChoseIsLeft ? 1 : 2;
        let data = {data: {type, target: this.data.tagChose}};
        if (!this.data.isNormalMember) {
            data = {data: {type, target: this.data.tagChose, relevanceId: this.data.userInfo.id}}
        }
        Protocol.getLinearGraphList({data}).then(data => {
            let {result: {dataList}} = data;
            dataList.map(value => {
                let dataAndTime = Tools.createDateAndTime(parseInt(value.created_timestamp));
                value.titleTime = dataAndTime.time;
                value.titleDate = dataAndTime.date;
            });
            this.setData({
                itemList: dataList
            })
        })
    },

    switchMember() {
        wx.navigateTo({
            url: '../member-list/member-list?state=3'
        })
    }
})
