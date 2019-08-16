import * as Tools from "../../utils/tools";
import UserInfo from "../../apis/network/network/libs/userInfo";
import Protocol from "../../apis/network/protocol";

const app = getApp();
Component({
    properties: {},
    data: {
        userInfo: {}
    },


    methods: {
        getUserInfo() {
            return this.data.userInfo;
        },
        switchMember() {
            // let myEventDetail = {} // detail对象，提供给事件监听函数
            // let myEventOption = {} // 触发事件的选项
            wx.navigateTo({url: '/pages/member-list/member-list?state=1'});
        },
        _whenUpdateUserInfo({userInfo}) {
            console.log('当前选择的用户信息',userInfo);
            this.setData({userInfo}, () => {
                Protocol.memberDiseaseGetMemberHistory({relevanceId: userInfo.relevanceId}).then(data => {
                    const myEventDetail = {disease: {...data.result.data}};
                    this.triggerEvent('onGetMemberDisease', myEventDetail);
                })
            });
        }

    },
    lifetimes: {
        created() {

        },
        attached() {

        },
        detached() {

        }
    },
    pageLifetimes: {
        show() {
            // 页面被展示
            const currentMember = app.globalData.currentMember;
            if (currentMember && currentMember.memberId) {
                currentMember.shortName = Tools.HandleShortName(currentMember.nickName);
                this._whenUpdateUserInfo({userInfo: currentMember});
            } else {
                UserInfo.get().then(res => {
                    res.userInfo.shortName = Tools.HandleShortName(res.userInfo.nickName);
                    this._whenUpdateUserInfo({userInfo: {...res.userInfo}});
                });
            }
        },
        hide() {
            // 页面被隐藏
        },
        resize(size) {
            // 页面尺寸变化
        }
    }
});
