// pages/member-list/member-list.js
import Protocol from "../../apis/network/protocol";
import * as tools from "../../utils/tools";

Page({
    data: {
        showTopText: false
    },
    onLoad(options) {
        Protocol.memberRelevanceList({}).then((e) => {
            let members = e.result.dataList;
            members.map(value => {
                value.age = tools.jsGetAge(value.birthday);
            });
            this.setData({
                members: members
            })
        })
        if (options.state == 1) {


        } else if (options.state == 2) {
            this.setData({
                showTopText: true
            })
        }
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
                        break;
                    case 1:
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
    }
})
