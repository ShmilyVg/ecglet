import UserInfo from "../../apis/network/network/libs/userInfo";
import HiNavigator from "../../components/navigator/hi-navigator";
import * as tools from "../../utils/tools";
import {SoftwareVersion} from "../../utils/config";

Page({
    data: {
        userInfo: {},
        SoftwareVersion
    },

    onLoad() {
        getApp().onLoginSuccess = () => {
            UserInfo.get().then(res => {
                this.setData({userInfo: res.userInfo});
            });
        };
    },

    onShow() {
        UserInfo.get().then((res) => {
            let name = tools.HandleShortName(res.userInfo.nickName);
            this.setData({
                userInfo: res.userInfo,
                name: name
            })
        })
    },

    toEditInfo() {
        UserInfo.get().then((res) => {
            getApp().globalData.editMember = res.userInfo;
            wx.navigateTo({
                    url: '../userdata/userdata?isNormalMember=true'
                }
            );
        });
    },

    toMemeberListPage(e) {
        HiNavigator.navigateToMemberList({state: 2});
    },

    clickCell2() {
        wx.navigateTo({url: '../disease-arrhyth/disease-arrhyth'})
    },

    clickCell3() {
        wx.navigateTo({url: '../feedback/feedback'})
    },
    toShareCodePage() {
        HiNavigator.navigateToShareCode();
    },
    toKnowledgePage() {
        HiNavigator.navigateToKnowledge();
    }
})
