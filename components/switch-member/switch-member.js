import * as Tools from "../../utils/tools";
import UserInfo from "../../apis/network/network/libs/userInfo";

const app = getApp();
Component({
    properties: {
    },
    data: {
        userInfo: {}
    },


    methods:{
        getUserInfo() {
            return this.data.userInfo;
        },
        switchMember(){
            // let myEventDetail = {} // detail对象，提供给事件监听函数
            // let myEventOption = {} // 触发事件的选项
            wx.navigateTo({url: '/pages/member-list/member-list?state=1'});
        }

    },
    lifetimes:{
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
                this.setData({userInfo: currentMember});
            } else {
                UserInfo.get().then(res => {
                    console.log(res);
                    res.userInfo.shortName = Tools.HandleShortName(res.userInfo.nickName);
                    this.setData({userInfo: {...res.userInfo}});
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
