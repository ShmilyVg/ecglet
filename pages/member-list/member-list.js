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
        if (state === 1) {
            // 检测完成后的跳转

        } else if (state === 2) {
            // 不带主成员的列表
            this.setData({
                showTopText: true,
                haveMainMember: false
            })
        } else if (state === 3) {
            // 带主成员的列表
            this.setData({
                haveMainMember: true
            })

        }
    },

    onShow() {
        Protocol.memberRelevanceList({}).then((e) => {
            let members = e.result.dataList;
            members.map(value => {
                value.age = tools.jsGetAge(value.birthday);
            });
            if (this.data.haveMainMember) {
                UserInfo.get().then(res => {
                    let userInfo = res.userInfo;
                    userInfo.name = userInfo.nickName;
                    userInfo.age = tools.jsGetAge(userInfo.birthday);
                    members.splice(0, 0, userInfo);
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

    clickMember(e) {
        let index = e.currentTarget.dataset.index;
        let that = this;
        console.log(index);
        wx.showActionSheet({
            itemList: ['检测记录', '修改资料', '删除成员'],
            success(e) {
                switch (e.tapIndex) {
                    case 0:
                        that.toTabbarHistory(index);
                        break;
                    case 1:
                        getApp().globalData.currentMember = that.data.members[index];
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
            url: '../new-user-edit/userdata'
        })
    },

    switchMember(e) {
        let index = e.currentTarget.dataset.index;
        this.toTabbarHistory(index);
    },

    toTabbarHistory(index) {
        getApp().globalData.currentMember = this.data.members[index];
        wx.switchTab({
            url: '../history/history?member'
        })
    }
})
