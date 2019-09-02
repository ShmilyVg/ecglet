// pages/member-list/member-list.js
import Protocol from "../../apis/network/protocol";
import UserInfo from "../../apis/network/network/libs/userInfo";
import * as Tools from "../../utils/tools";

Page({
    data: {
        showTopText: false,
        haveMainMember: false,
        members: []
    },

    onLoad(options) {
        let state = parseInt(options.state);
        console.log('状态：', state);
        switch (state) {
            case 1:
                // 检测完成后切换成员进入
                this.setData({
                    showTopText: true,
                    haveMainMember: true,
                    state: state
                });
                break;
            case 2:
                // 我的-成员管理进入
                this.setData({
                    showTopText: false,
                    haveMainMember: false,
                    state: state
                });
                break;
            case 3:
                // 检测记录-切换成员进入
                this.setData({
                    haveMainMember: true,
                    state: state
                });
                break;
        }
    },

    onShow() {
        getApp().globalData.editMember = {};
        Protocol.memberRelevanceList({}).then((e) => {
            let members = e.result.dataList;
            if (this.data.haveMainMember) {
                UserInfo.get().then(res => {
                    members.splice(0, 0, res.userInfo);
                    members = this.handleNameShow(members);
                    this.setData({
                        members: members
                    })
                })
            } else {
                members = this.handleNameShow(members);
                this.setData({
                    members: members
                })
            }
        });
    },

    handleNameShow(members) {
        members.map(item => {
            item.shortName = Tools.HandleShortName(item.nickName);
        });
        return members;
    },

    clickCell(e) {
        let index = e.currentTarget.dataset.index;
        console.log(index);
        switch (this.data.state) {
            case 1:
                this.saveCurrentMember(index);
                wx.navigateBack({
                    delta: 1
                });
                break;
            case 2:
                this.showSheet(index);
                break;
            case 3:
                this.toTabbarHistory(index);
                break;
        }
    },

    clickBtn(e) {
        let index = e.currentTarget.dataset.index;
        switch (this.data.state) {
            case 1:
                this.toEditMember(this, index);
                break;
            case 2:
                this.showSheet(index);
                break;
            case 3:
                this.toEditMember(this, index);
                break
        }
    },

    showSheet(index) {
        let that = this;
        wx.showActionSheet({
            itemList: ['检测记录', '编辑资料', '删除成员'],
            success(e) {
                switch (e.tapIndex) {
                    case 0:
                        that.toTabbarHistory(index);
                        break;
                    case 1:
                        that.toEditMember(that, index);
                        break;
                    case 2:
                        that.toDeleteMember(that, index);
                        break;
                }
            }
        })
    },

    toDeleteMember(that, index) {
        wx.showModal({
            content: '删除成员的同时，该成员下的所有数据也被删除',
            showCancel: true,
            confirmText: '执意删除',
            success(res) {
                if (res.confirm) {
                    let members = that.data.members;
                    let relevanceId = members[index].relevanceId;
                    Protocol.memberRelevanceDel({relevanceId}).then(() => {
                        if (relevanceId == getApp().globalData.currentMember.relevanceId) {
                            getApp().globalData.refresh = true;
                            getApp().globalData.currentMember = {};
                        }
                        members.splice(index, 1);
                        that.setData({
                            members: members
                        });
                    });
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            },
            fail() {
                console.log('fail');
            }
        });
    },

    toEditMember(that, index) {
        getApp().globalData.editMember = that.data.members[index];
        let isNormalMember = true;
        if (that.data.haveMainMember) {
            isNormalMember = !index;
        } else {
            isNormalMember = false
        }
        wx.navigateTo({url: '../userdata/userdata?isNormalMember=' + isNormalMember});
    },

    toTabbarHistory(index) {
        this.saveCurrentMember(index);
        getApp().globalData.refresh = true;
        wx.switchTab({
            url: '../history/history'
        });
    },

    saveCurrentMember(index) {
        getApp().globalData.currentMember = this.data.members[index];
    },

    addMember() {
        wx.navigateTo({
            url: '../userdata/userdata'
        })
    }
})
