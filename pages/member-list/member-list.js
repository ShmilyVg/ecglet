// pages/member-list/member-list.js
import Protocol from "../../apis/network/protocol";
import * as tools from "../../utils/tools";
import UserInfo from "../../apis/network/network/libs/userInfo";

Page({
    data: {
        showTopText: false,
        haveMainMember: false
    },

    onLoad(options) {
        let state = parseInt(options.state);
        console.log('状态：', state);
        if (state === 1) {
            // 检测完成后的跳转
            this.setData({
                showTopText: true,
                haveMainMember: true,
                state: 1
            })
        } else if (state === 2) {
            // 不带主成员的列表
            this.setData({
                showTopText: false,
                haveMainMember: false,
                state: 2
            })
        } else if (state === 3) {
            // 带主成员的列表
            this.setData({
                haveMainMember: true,
                state: 3
            })
        }
    },

    onShow() {
        Protocol.memberRelevanceList({}).then((e) => {
            let members = e.result.dataList;
            if (this.data.haveMainMember) {
                UserInfo.get().then(res => {
                    members.splice(0, 0, res.userInfo);
                    this.setData({
                        members: members
                    })
                })
            } else {
                this.setData({
                    members: members
                })
            }
        });
    },

    clickCell(e) {
        let index = e.currentTarget.dataset.index;
        console.log(index);
        switch (this.data.state) {
            case 1:
                getApp().globalData.currentMember = this.data.members[index];
                wx.navigateBack({
                    delta: 1
                });
                break;
            case 2:
                break;
            case 3:
                getApp().globalData.currentMember = this.data.members[index];
                wx.switchTab({
                    url: '../history/history?member'
                });
                break;
        }
    },

    clickBtn(e) {
        let index = e.currentTarget.dataset.index;
        this.showSheet(index);
    },

    showSheet(index) {
        let that = this;
        wx.showActionSheet({
            itemList: ['检测记录', '修改资料', '删除成员'],
            success(e) {
                switch (e.tapIndex) {
                    case 0:
                        that.toTabbarHistory(index);
                        break;
                    case 1:
                        getApp().globalData.editMember = that.data.members[index];
                        let isNormalMember = true;
                        if (that.data.haveMainMember) {
                            isNormalMember = !index;
                        } else {
                            isNormalMember = false
                        }
                        wx.navigateTo({url: '../userdata/userdata?isNormalMember=' + isNormalMember});
                        break;
                    case 2:
                        wx.showModal({
                            content: '删除成员的同时，该成员下的所有数据也被删除',
                            showCancel: true,
                            confirmText: '执以删除',
                            success(res) {
                                if (res.confirm) {
                                    let members = that.data.members;
                                    let id = members[index].id;
                                    Protocol.memberRelevanceDel({id}).then(() => {
                                        members.splice(index, 1);
                                        that.setData({
                                            members: members
                                        })
                                    });
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            },
                            fail() {
                                console.log('fail');
                            }
                        });
                        break;
                }
            }
        })
    },

    addMember() {
        wx.navigateTo({
            url: '../userdata/userdata'
        })
    }
})
